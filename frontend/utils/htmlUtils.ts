export function addGoogleFontsAndStyles(
	html: string,
	googleFontsLinks: string
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

	// Use link tag for Google Fonts - place it early in head for proper loading
	const googleFontsLink = googleFontsLinks
		? `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="${googleFontsLinks.replace(
				/"/g,
				"&quot;"
		  )}">`
		: "";

	// Fix font-family declarations: add quotes around font names with spaces
	// This handles cases where templates use {{titleFont}} directly instead of {{fontFamily titleFont}}
	// Example: font-family: Playfair Display, sans-serif; -> font-family: "Playfair Display", sans-serif;
	let processedHtml = html.replace(
		/font-family:\s*([^;{}]+)/g,
		(match, fontList) => {
			// Split by comma to handle font stacks (e.g., "Playfair Display, serif, sans-serif")
			const fonts = fontList.split(",").map((f: string) => f.trim());
			const fixedFonts = fonts.map((font: string) => {
				// Skip if already quoted, is a CSS variable, or contains Handlebars syntax
				if (
					font.startsWith('"') ||
					font.startsWith("'") ||
					font.startsWith("var(") ||
					font.includes("{{")
				) {
					return font;
				}
				// Common fallback fonts that shouldn't be quoted
				const commonFallbacks = [
					"sans-serif",
					"serif",
					"monospace",
					"cursive",
					"fantasy",
				];
				const isFallback = commonFallbacks.includes(font.toLowerCase());

				// Add quotes if font name contains spaces and is not a fallback
				if (!isFallback && font.includes(" ")) {
					return `"${font}"`;
				}
				return font;
			});
			return `font-family: ${fixedFonts.join(", ")}`;
		}
	);

	// Script to wait for fonts to load - simplified approach
	// Don't hide content initially, fonts will load with font-display: swap
	// This prevents blocking and allows graceful fallback
	const fontLoadScript = "";

	return (
		"<!DOCTYPE html>" +
		"<html>" +
		"<head>" +
		'<meta charset="UTF-8">' +
		'<meta http-equiv="Content-Security-Policy" content="font-src * data: https:;">' +
		googleFontsLink +
		'<link rel="stylesheet" href="/assets/icons/phosphor-duotone.css">' +
		'<link rel="stylesheet" href="/assets/icons/fontawesome.css">' +
		"<style>.icon{display:inline-block;color:rgba(255,255,255,0.1);}</style>" +
		fontLoadScript +
		"<script>" +
		showIconRandomlyScript +
		"</script>" +
		"</head>" +
		"<body>" +
		processedHtml +
		"</body>" +
		"</html>"
	);
}
