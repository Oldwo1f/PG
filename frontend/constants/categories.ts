export const TEMPLATE_CATEGORIES = [
	"Citations",
	"Promotions",
	"Informations",
	"Témoignages",
	"Questions",
	"Sondages",
	"Concours",
	"Histoires",
	"Événements",
	"Collaborations",
	"Mèmes",
	"Articles de blog",
	"Produits",
	"Offres d'emploi",
	"Live",
	"Podcast",
	"Utilisateur du mois",
] as const;

export type TemplateCategory =
	| (typeof TEMPLATE_CATEGORIES)[number]
	| ""
	| undefined;
