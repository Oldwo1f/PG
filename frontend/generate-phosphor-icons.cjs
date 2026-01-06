// Script pour générer la liste des icônes Phosphor (famille 'duotone') au format JSON pour la modal
const fs = require("fs");
const path = require("path");
const icons = require("@iconify-json/ph/icons.json").icons;

// Filtrer pour ne garder que les icônes de la famille 'duotone' et exclure 'bold'
const duotoneIcons = Object.keys(icons).filter(
	(name) => name.includes("-duotone") && !name.includes("-bold")
);

const result = duotoneIcons.map((name) => ({
	name: `ph-${name}`,
	class: `ph-duotone ph-${name.replace("-duotone", "")}`,
}));

const outputPath = path.join(process.cwd(), "assets/phosphor-icons.json");
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

console.log(
	"phosphor-icons.json generated with",
	result.length,
	"icons at",
	outputPath
);
