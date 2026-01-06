# Fonts

Place ici les fichiers de polices (ex : .woff, .ttf) à utiliser dans les templates.

Pour ajouter une nouvelle font :

-   Place le fichier dans ce dossier.
-   Référence la font dans le CSS du template via @font-face ou via Google Fonts si usage web.

Exemple d'intégration dans un template :

```css
@font-face {
	font-family: "Montserrat";
	src: url("../assets/fonts/Montserrat-Regular.woff2") format("woff2");
	font-weight: normal;
	font-style: normal;
}
```
