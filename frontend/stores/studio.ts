import { defineStore } from "pinia";
import type { Template } from "~/types/template";
import type { Brand } from "~/types/brand";

interface TemplateVariable {
	type: "text" | "textarea";
	value: string;
}

interface StudioState {
	selectedTemplate: Template | null;
	selectedBrand: Brand | null;
	templateVariables: Record<string, TemplateVariable>;
	htmlContent: string;
	dimensions: { width: number; height: number };
	editorWidth: number;
}

export const useStudioStore = defineStore("studio", {
	state: (): StudioState => ({
		selectedTemplate: null,
		selectedBrand: null,
		templateVariables: {},
		htmlContent: "",
		dimensions: { width: 1200, height: 630 },
		editorWidth: 600,
	}),

	actions: {
		// Sauvegarder l'état dans le localStorage
		saveToLocalStorage() {
			if (process.client) {
				const stateToSave = {
					selectedTemplateId: this.selectedTemplate?.id,
					selectedBrandId: this.selectedBrand?.id,
					templateVariables: this.templateVariables,
					htmlContent: this.htmlContent,
					dimensions: this.dimensions,
					editorWidth: this.editorWidth,
				};
				localStorage.setItem(
					"studio-state",
					JSON.stringify(stateToSave)
				);
			}
		},

		// Charger l'état depuis le localStorage
		loadFromLocalStorage() {
			if (process.client) {
				const savedState = localStorage.getItem("studio-state");
				if (savedState) {
					try {
						const parsedState = JSON.parse(savedState);
						this.templateVariables =
							parsedState.templateVariables || {};
						this.htmlContent = parsedState.htmlContent || "";
						this.dimensions = parsedState.dimensions || {
							width: 1200,
							height: 630,
						};
						this.editorWidth = parsedState.editorWidth || 600;

						// Retourner les IDs pour permettre la récupération des objets complets
						return {
							templateId: parsedState.selectedTemplateId,
							brandId: parsedState.selectedBrandId,
						};
					} catch (error) {
						console.error(
							"Erreur lors du chargement de l'état du studio:",
							error
						);
					}
				}
			}
			return { templateId: null, brandId: null };
		},

		// Définir le template sélectionné
		setSelectedTemplate(template: Template | null) {
			this.selectedTemplate = template;
			this.saveToLocalStorage();
		},

		// Définir la marque sélectionnée
		setSelectedBrand(brand: Brand | null) {
			this.selectedBrand = brand;
			this.saveToLocalStorage();
		},

		// Mettre à jour les variables du template
		updateTemplateVariables(variables: Record<string, TemplateVariable>) {
			this.templateVariables = variables;
			this.saveToLocalStorage();
		},

		// Mettre à jour le contenu HTML
		setHtmlContent(content: string) {
			this.htmlContent = content;
			this.saveToLocalStorage();
		},

		// Mettre à jour les dimensions
		setDimensions(dimensions: { width: number; height: number }) {
			this.dimensions = dimensions;
			this.saveToLocalStorage();
		},

		// Mettre à jour la largeur de l'éditeur
		setEditorWidth(width: number) {
			this.editorWidth = width;
			this.saveToLocalStorage();
		},

		// Réinitialiser l'état
		reset() {
			this.selectedTemplate = null;
			this.selectedBrand = null;
			this.templateVariables = {};
			this.htmlContent = "";
			this.dimensions = { width: 1200, height: 630 };
			this.editorWidth = 600;
			if (process.client) {
				localStorage.removeItem("studio-state");
			}
		},
	},
});
