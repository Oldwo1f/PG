# Icons

Place ici les fichiers de polices d'icônes (ex : .woff, .ttf) ou les SVG à utiliser dans les templates.

Pour ajouter une nouvelle police d'icônes :

-   Place le fichier dans ce dossier.
-   Référence la police dans le CSS du template via @font-face ou via un CDN si usage web.

Pour ajouter des SVG :

-   Place les fichiers SVG ici et référence-les dans le template si besoin.

Exemple d'intégration d'une police d'icônes :

```css
@font-face {
	font-family: "Phosphor";
	src: url("../assets/icons/phosphor.woff2") format("woff2");
	font-weight: normal;
	font-style: normal;
}
```
