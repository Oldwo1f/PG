function escapeHtmlAttribute(value: string): string {
	return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function escapeInlineStyleTagContent(css: string): string {
	// Prevent closing the <style> tag early if something unexpected slips in.
	return css.replace(/<\/style/gi, "<\\/style");
}

export function addGoogleFontsAndStyles(
	html: string,
	googleFontsLinks: string,
	baseHref?: string,
	googleFontsCssText?: string
): string {
	const showIconRandomlyScript =
		"function showIconRandomly(icons, containerSelector, numberToShow) {" +
		"    const container = document.querySelector(containerSelector);" +
		"    if (!container) {" +
		'        console.error("Container " + containerSelector + " not found");' +
		"        return;" +
		"    }" +
		"    const zones = Array.from(container.children);" +
		"    if (zones.length === 0) {" +
		'        console.error("No child zones found in " + containerSelector);' +
		"        return;" +
		"    }" +
		"    const count = Math.min(numberToShow, zones.length, icons.length);" +
		"    const shuffledZones = zones.sort(() => 0.5 - Math.random()).slice(0, count);" +
		"    const shuffledIcons = icons.sort(() => 0.5 - Math.random()).slice(0, count);" +
		'    zones.forEach(zone => zone.innerHTML = "");' +
		"    for (let i = 0; i < count; i++) {" +
		"        const icon = shuffledIcons[i];" +
		'        const iconElement = document.createElement("i");' +
		"        iconElement.className = icon.class;" +
		"        const offsetX = Math.random() * 80;" +
		"        const offsetY = Math.random() * 80;" +
		"        const rotation = Math.random() * 60 - 30;" +
		"        const size = (Math.random() * 1.5 + 2).toFixed(2);" +
		"        const opacity = (Math.random() * 0.15 + 0.05).toFixed(2);" +
		'        iconElement.style.position = "absolute";' +
		'        iconElement.style.left = offsetX + "%";' +
		'        iconElement.style.top = offsetY + "%";' +
		'        iconElement.style.transform = "rotate(" + rotation + "deg)";' +
		'        iconElement.style.transformOrigin = "center center";' +
		'        iconElement.style.fontSize = size + "em";' +
		"        iconElement.style.opacity = opacity;" +
		"        const zone = shuffledZones[i];" +
		"        zone.appendChild(iconElement);" +
		"    }" +
		"}";

	// Use multiple methods to ensure Google Fonts load in srcdoc iframe:
	// 1. Link tag in head (primary method)
	// 2. @import in style tag (fallback that sometimes works better in iframes)
	const googleFontsLink = googleFontsLinks
		? `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" crossorigin="anonymous" href="${googleFontsLinks.replace(
				/"/g,
				"&quot;"
		  )}"><style>@import url("${googleFontsLinks.replace(
				/"/g,
				"&quot;"
		  )}");</style>`
		: "";

	const googleFontsInlineStyle = googleFontsCssText
		? `<style data-google-fonts="inline">${escapeInlineStyleTagContent(googleFontsCssText)}</style>`
		: "";

	// Allow templates to use relative URLs (ex: ../assets/fonts/..., images, css)
	// With srcdoc, the default base URL is "about:srcdoc", so relative paths break without a <base>.
	const baseTag = baseHref ? `<base href="${escapeHtmlAttribute(baseHref)}">` : "";

	// No additional font loading script needed - the link tag should work
	// Fonts will load with font-display: swap from Google Fonts API
	const fontLoadScript = "";

	return (
		"<!DOCTYPE html>" +
		"<html>" +
		"<head>" +
		'<meta charset="UTF-8">' +
		baseTag +
		'<meta http-equiv="Content-Security-Policy" content="font-src * data: https:;">' +
		googleFontsLink +
		googleFontsInlineStyle +
		'<link rel="stylesheet" href="/assets/icons/phosphor-duotone.css">' +
		'<link rel="stylesheet" href="/assets/icons/fontawesome.css">' +
		"<style>.icon{display:inline-block;color:rgba(255,255,255,0.1);}</style>" +
		fontLoadScript +
		"<script>" +
		showIconRandomlyScript +
		"</script>" +
		"</head>" +
		"<body>" +
		html +
		"</body>" +
		"</html>"
	);
}
