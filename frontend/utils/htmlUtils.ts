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

	// Script to wait for fonts to load before showing content
	const fontLoadScript = googleFontsLinks
		? `<script>
		(function() {
			// Hide body initially
			document.body.style.visibility = 'hidden';
			// Wait for fonts to load
			if (document.fonts && document.fonts.ready) {
				document.fonts.ready.then(function() {
					// Additional check: verify specific fonts are loaded
					var fontsToCheck = [];
					var fontFamilyMatch = /family=([^:&]+)/g;
					var match;
					while ((match = fontFamilyMatch.exec('${googleFontsLinks}')) !== null) {
						var fontName = decodeURIComponent(match[1]).replace(/\\+/g, ' ');
						fontsToCheck.push('"' + fontName + '"');
					}
					// Check if fonts are available
					var allLoaded = true;
					if (fontsToCheck.length > 0) {
						for (var i = 0; i < fontsToCheck.length; i++) {
							if (!document.fonts.check('12px ' + fontsToCheck[i])) {
								allLoaded = false;
								break;
							}
						}
					}
					// Show body after fonts are ready
					setTimeout(function() {
						document.body.style.visibility = 'visible';
					}, allLoaded ? 0 : 200);
				}).catch(function() {
					// Fallback: show after timeout
					setTimeout(function() {
						document.body.style.visibility = 'visible';
					}, 800);
				});
			} else {
				// Fallback for browsers without Font Loading API
				window.addEventListener('load', function() {
					setTimeout(function() {
						document.body.style.visibility = 'visible';
					}, 800);
				});
			}
		})();
		</script>`
		: "";

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
		"<style>body { visibility: hidden; }</style>" +
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
