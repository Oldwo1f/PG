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

	// Use @import in a style tag - this works better in srcdoc iframes than fetch or link tags
	// @import allows fonts to load properly in iframe contexts
	const googleFontsStyle = googleFontsLinks
		? `<style>@import url("${googleFontsLinks.replace(
				/"/g,
				"&quot;"
		  )}");</style>`
		: "";

	return (
		"<!DOCTYPE html>" +
		"<html>" +
		"<head>" +
		'<meta charset="UTF-8">' +
		'<meta http-equiv="Content-Security-Policy" content="font-src * data: https:;">' +
		googleFontsStyle +
		'<link rel="stylesheet" href="/assets/icons/phosphor-duotone.css">' +
		'<link rel="stylesheet" href="/assets/icons/fontawesome.css">' +
		"<style>.icon{display:inline-block;color:rgba(255,255,255,0.1);}</style>" +
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
