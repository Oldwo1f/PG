import { defineStore } from "pinia";
import type { Template } from "~/types/template";
import { useAuthStore } from "~/composables/useAuth";
import { getApiUrl } from "~/utils/api";

interface TemplateState {
	templates: Template[];
	loading: boolean;
	error: string | null;
}

export const useTemplateStore = defineStore("template", {
	state: (): TemplateState => ({
		templates: [],
		loading: false,
		error: null,
	}),

	getters: {
		getTemplateById: (state: TemplateState) => (id: string) => {
			return state.templates.find((template) => template.id === id);
		},
		getTemplatesByCategory:
			(state: TemplateState) => (category: string) => {
				return state.templates.filter(
					(template) => template.category === category
				);
			},
		getTemplatesCount: (state: TemplateState) => state.templates.length,
	},

	actions: {
		// Récupérer tous les templates
		async fetchTemplates(category?: string) {
			this.loading = true;
			this.error = null;
			try {
				const authStore = useAuthStore();
				if (!authStore.isAuthenticated) {
					throw new Error(
						"Vous devez être connecté pour accéder aux templates"
					);
				}

				const headers = authStore.getAuthHeaders;

				const url = category
					? `${getApiUrl("/templates")}?category=${category}`
					: getApiUrl("/templates");
				const response = await fetch(url, {
					headers: {
						...headers,
						"Content-Type": "application/json",
					},
				});
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				this.templates = data;
			} catch (error) {
				this.error =
					error instanceof Error
						? error.message
						: "Une erreur est survenue";
			} finally {
				this.loading = false;
			}
		},

		// Récupérer le contenu HTML d'un template
		async getTemplateContent(id: string): Promise<string> {
			this.loading = true;
			this.error = null;
			try {
				const authStore = useAuthStore();
				if (!authStore.isAuthenticated) {
					throw new Error(
						"Vous devez être connecté pour accéder aux templates"
					);
				}

				const headers = authStore.getAuthHeaders;

				const response = await fetch(
					getApiUrl(`/templates/${id}/content`),
					{
						headers: {
							...headers,
							"Content-Type": "application/json",
						},
					}
				);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return await response.text();
			} catch (error) {
				this.error =
					error instanceof Error
						? error.message
						: "Une erreur est survenue";
				throw error;
			} finally {
				this.loading = false;
			}
		},

		// Créer un nouveau template
		async createTemplate(
			template: Omit<
				Template,
				"id" | "userId" | "createdAt" | "updatedAt"
			>
		) {
			this.loading = true;
			this.error = null;
			try {
				const authStore = useAuthStore();
				if (!authStore.isAuthenticated) {
					throw new Error(
						"Vous devez être connecté pour créer un template"
					);
				}
				const headers = authStore.getAuthHeaders;
				const response = await fetch(getApiUrl("/templates"), {
					method: "POST",
					headers: {
						...headers,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(template),
				});

				if (!response.ok) {
					if (response.status === 403) {
						const data = await response.json();
						this.error =
							data.message ||
							"Limite de templates atteinte pour votre plan. Passez à l'offre supérieure pour créer plus de templates.";
						throw new Error(
							this.error ||
								"Limite de templates atteinte pour votre plan. Passez à l'offre supérieure pour créer plus de templates."
						);
					}
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const newTemplate = await response.json();
				this.templates.push(newTemplate);
				return newTemplate;
			} catch (error) {
				this.error =
					error instanceof Error
						? error.message
						: "Une erreur est survenue";
				throw error;
			} finally {
				this.loading = false;
			}
		},

		// Mettre à jour un template
		async updateTemplate(
			id: string,
			template: Omit<
				Partial<Template>,
				"id" | "userId" | "createdAt" | "updatedAt" | "brandVariables"
			>
		) {
			this.loading = true;
			this.error = null;
			try {
				const authStore = useAuthStore();
				if (!authStore.isAuthenticated) {
					throw new Error(
						"Vous devez être connecté pour modifier un template"
					);
				}
				const headers = authStore.getAuthHeaders;
				const response = await fetch(getApiUrl(`/templates/${id}`), {
					method: "PATCH",
					headers: {
						...headers,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(template),
				});
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const updatedTemplate = await response.json();
				const index = this.templates.findIndex((t) => t.id === id);
				if (index !== -1) {
					this.templates[index] = updatedTemplate;
				}
				return updatedTemplate;
			} catch (error) {
				this.error =
					error instanceof Error
						? error.message
						: "Une erreur est survenue";
				throw error;
			} finally {
				this.loading = false;
			}
		},

		// Supprimer un template
		async deleteTemplate(id: string): Promise<void> {
			this.loading = true;
			this.error = null;
			try {
				const authStore = useAuthStore();
				if (!authStore.isAuthenticated) {
					throw new Error(
						"Vous devez être connecté pour supprimer un template"
					);
				}
				const headers = authStore.getAuthHeaders;
				const response = await fetch(getApiUrl(`/templates/${id}`), {
					method: "DELETE",
					headers,
				});
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const index = this.templates.findIndex((t) => t.id === id);
				if (index !== -1) {
					this.templates.splice(index, 1);
				}
			} catch (error) {
				this.error =
					error instanceof Error
						? error.message
						: "Une erreur est survenue";
				throw error;
			} finally {
				this.loading = false;
			}
		},

		// Dupliquer un template
		async duplicateTemplate(id: string) {
			this.loading = true;
			this.error = null;
			try {
				const authStore = useAuthStore();
				if (!authStore.isAuthenticated) {
					throw new Error(
						"Vous devez être connecté pour dupliquer un template"
					);
				}
				const headers = authStore.getAuthHeaders;
				const response = await fetch(
					getApiUrl(`/templates/${id}/duplicate`),
					{
						method: "POST",
						headers: {
							...headers,
							"Content-Type": "application/json",
						},
					}
				);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const duplicatedTemplate = await response.json();
				this.templates.push(duplicatedTemplate);
				return duplicatedTemplate;
			} catch (error) {
				this.error =
					error instanceof Error
						? error.message
						: "Une erreur est survenue";
				throw error;
			} finally {
				this.loading = false;
			}
		},
	},
});
