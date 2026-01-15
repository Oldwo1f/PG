import { defineEventHandler, getQuery, setHeader } from "h3";

function buildGoogleCss2Url(fonts: string[], display: string): string {
	const uniqueFonts = [...new Set(fonts.filter(Boolean))];
	const families = uniqueFonts.map(
		(font) => `family=${encodeURIComponent(font)}:wght@400;700`
	);
	return `https://fonts.googleapis.com/css2?${families.join(
		"&"
	)}&display=${encodeURIComponent(display || "swap")}`;
}

function rewriteGstaticUrls(cssText: string): string {
	// Rewrite all font file URLs to same-origin proxy endpoint
	// Examples in Google CSS:
	//   url(https://fonts.gstatic.com/s/roboto/v30/KFOmCnq...woff2) format('woff2')
	return cssText.replace(
		/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g,
		(_m, url) => `url(/fonts/google/file?url=${encodeURIComponent(url)})`
	);
}

export default defineEventHandler(async (event) => {
	const q = getQuery(event);
	const familiesParam = typeof q.families === "string" ? q.families : "";
	const display = typeof q.display === "string" ? q.display : "swap";

	const families = familiesParam
		.split("|")
		.map((s) => s.trim())
		.filter(Boolean);

	if (!families.length) {
		setHeader(event, "Content-Type", "text/css; charset=utf-8");
		return "";
	}

	const googleUrl = buildGoogleCss2Url(families, display);
	const res = await fetch(googleUrl);
	const cssText = res.ok ? await res.text() : "";

	setHeader(event, "Content-Type", "text/css; charset=utf-8");
	// Cache CSS a bit (browser can revalidate), fonts themselves are cached long-term
	setHeader(event, "Cache-Control", "public, max-age=3600");

	return rewriteGstaticUrls(cssText);
});

