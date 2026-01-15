import { defineStore } from "pinia";
import { useApi } from "~/composables/useApi";
import type { Template, UpdateTemplateInput } from "~/types/template";

export const useTemplatesStore = defineStore("templates", {
	state: () => ({
		templates: [] as Template[],
		loading: false,
		error: null as string | null,
	}),

	getters: {
		getTemplateById: (state) => (id: string) =>
			state.templates.find((t) => t.id === id),
	},

	actions: {
		async fetchExampleTemplates(category?: string) {
			this.loading = true;
			this.error = null;

			try {
				const { apiFetch } = useApi();
				const url = category
					? `/templates/examples?category=${encodeURIComponent(
							category
					  )}`
					: "/templates/examples";
				const response = (await apiFetch(url)) as Template[];
				this.templates = response;
			} catch (error: any) {
				this.error =
					error.data?.message ||
					"Erreur lors du chargement des templates";
				throw error;
			} finally {
				this.loading = false;
			}
		},

		async updateTemplate(id: string, data: UpdateTemplateInput) {
			this.loading = true;
			this.error = null;

			try {
				const { apiFetch } = useApi();
				const response = (await apiFetch(`/templates/${id}`, {
					method: "PATCH",
					body: data,
				})) as Template;

				const index = this.templates.findIndex((t) => t.id === id);
				if (index !== -1) {
					this.templates[index] = response;
				}

				return response;
			} catch (error: any) {
				this.error =
					error.data?.message ||
					"Erreur lors de la mise à jour du template";
				throw error;
			} finally {
				this.loading = false;
			}
		},

		async deleteTemplate(id: string) {
			this.loading = true;
			this.error = null;

			try {
				const { apiFetch } = useApi();
				await apiFetch(`/templates/${id}`, { method: "DELETE" });
				const index = this.templates.findIndex((t) => t.id === id);
				if (index !== -1) {
					this.templates.splice(index, 1);
				}
			} catch (error: any) {
				this.error =
					error.data?.message ||
					"Erreur lors de la suppression du template";
				throw error;
			} finally {
				this.loading = false;
			}
		},

		clearError() {
			this.error = null;
		},
	},
});

