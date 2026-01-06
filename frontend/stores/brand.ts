import { defineStore } from "pinia";
import type { Brand } from "~/types/brand";
import { useAuthStore } from "~/composables/useAuth";

const API_URL = "http://localhost:3001/api";

interface BrandState {
	brands: Brand[];
	fetchLoading: boolean;
	createLoading: boolean;
	updateLoading: boolean;
	deleteLoading: boolean;
	error: string | null;
}

export const useBrandStore = defineStore("brand", {
	state: (): BrandState => ({
		brands: [],
		fetchLoading: false,
		createLoading: false,
		updateLoading: false,
		deleteLoading: false,
		error: null,
	}),

	getters: {
		getBrandById: (state: BrandState) => (id: string) => {
			return state.brands.find((brand: Brand) => brand.id === id);
		},
		getBrandsCount: (state: BrandState) => state.brands.length,
		// Getter pour l'état de chargement global (pour la compatibilité)
		loading: (state: BrandState) =>
			state.fetchLoading ||
			state.createLoading ||
			state.updateLoading ||
			state.deleteLoading,
	},

	actions: {
		// Récupérer toutes les marques
		async fetchBrands() {
			this.fetchLoading = true;
			this.error = null;
			try {
				const authStore = useAuthStore();

				if (!authStore.isAuthenticated) {
					throw new Error(
						"Vous devez être connecté pour accéder aux marques"
					);
				}

				const headers = authStore.getAuthHeaders;

				const response = await fetch(`${API_URL}/brands`, {
					headers: {
						...headers,
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				this.brands = data;
			} catch (error) {
				this.error =
					error instanceof Error
						? error.message
						: "Une erreur est survenue";
			} finally {
				this.fetchLoading = false;
			}
		},

		// Créer une nouvelle marque
		async createBrand(brand: Omit<Brand, "id">): Promise<Brand> {
			this.createLoading = true;
			this.error = null;
			try {
				const authStore = useAuthStore();

				if (!authStore.isAuthenticated) {
					throw new Error(
						"Vous devez être connecté pour créer une marque"
					);
				}

				const headers = authStore.getAuthHeaders;

				const response = await fetch(`${API_URL}/brands`, {
					method: "POST",
					headers: {
						...headers,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(brand),
				});

				if (!response.ok) {
					if (response.status === 403) {
						const data = await response.json();
						this.error =
							data.message ||
							"Limite de marques atteinte pour votre plan. Passez à l'offre supérieure pour créer plus de marques.";
						throw new Error(
							this.error ||
								"Limite de marques atteinte pour votre plan. Passez à l'offre supérieure pour créer plus de marques."
						);
					}
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const newBrand = await response.json();
				this.brands.push(newBrand);
				return newBrand;
			} catch (error) {
				this.error =
					error instanceof Error
						? error.message
						: "Une erreur est survenue";
				throw error;
			} finally {
				this.createLoading = false;
			}
		},

		// Mettre à jour une marque
		async updateBrand(
			id: string,
			brand: Omit<Partial<Brand>, "id">
		): Promise<Brand> {
			this.updateLoading = true;
			this.error = null;
			try {
				const authStore = useAuthStore();

				if (!authStore.isAuthenticated) {
					throw new Error(
						"Vous devez être connecté pour modifier une marque"
					);
				}

				const headers = authStore.getAuthHeaders;

				const response = await fetch(`${API_URL}/brands/${id}`, {
					method: "PATCH",
					headers: {
						...headers,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(brand),
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const updatedBrand = await response.json();
				const index = this.brands.findIndex((b: Brand) => b.id === id);
				if (index !== -1) {
					this.brands[index] = updatedBrand;
				}
				return updatedBrand;
			} catch (error) {
				this.error =
					error instanceof Error
						? error.message
						: "Une erreur est survenue";
				throw error;
			} finally {
				this.updateLoading = false;
			}
		},

		// Supprimer une marque
		async deleteBrand(id: string): Promise<void> {
			this.deleteLoading = true;
			this.error = null;
			try {
				const authStore = useAuthStore();

				if (!authStore.isAuthenticated) {
					throw new Error(
						"Vous devez être connecté pour supprimer une marque"
					);
				}

				const headers = authStore.getAuthHeaders;

				const response = await fetch(`${API_URL}/brands/${id}`, {
					method: "DELETE",
					headers,
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const index = this.brands.findIndex((b: Brand) => b.id === id);
				if (index !== -1) {
					this.brands.splice(index, 1);
				}
			} catch (error) {
				this.error =
					error instanceof Error
						? error.message
						: "Une erreur est survenue";
				throw error;
			} finally {
				this.deleteLoading = false;
			}
		},
	},
});
