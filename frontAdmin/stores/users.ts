import { defineStore } from "pinia";
import { useApi } from "~/composables/useApi";

export interface Plan {
	id: string;
	name: string;
	priceMonthly: number;
	imageLimitMonthly: number;
	storageLimitBytes: number;
	templateLimit: number;
	brandLimit: number;
	teamMemberLimit: number;
	integrationsIncluded: boolean;
}

export interface Subscription {
	id: string;
	planId: string;
	status: "active" | "cancelled" | "past_due" | "incomplete";
	stripeSubscriptionId?: string;
	currentPeriodEnd?: string;
	createdAt: string;
	plan: Plan;
}

export interface UsageStorage {
	bytesUsed: number;
}

export interface UsageMonthly {
	id: string;
	monthYear: string;
	imagesGenerated: number;
	imagesUploaded: number;
}

export interface User {
	id: string;
	email: string;
	firstName?: string;
	lastName?: string;
	role: "user" | "admin";
	status: "active" | "inactive" | "suspended" | "pending_verification";
	createdAt: string;
	updatedAt: string;
	lastLoginAt?: string;
	imagesGeneratedThisMonth: number; // Calculé à partir de monthlyUsage du mois courant
	subscription?: Subscription;
	storageUsage?: UsageStorage;
	monthlyUsage: UsageMonthly[];
	// Computed properties
	fullName?: string;
	isSubscriptionActive?: boolean;
	monthlyImageLimit?: number;
	canGenerateImage?: boolean;
	storageUsedMB: number;
	storageLimitMB: number;
	storageUsagePercentage: number;
	templatesCount: number;
	brandsCount: number;
}

export interface CreateUserData {
	email: string;
	password: string;
	firstName?: string;
	lastName?: string;
	role?: "user" | "admin";
}

export interface UpdateUserData {
	id: string;
	email?: string;
	firstName?: string;
	lastName?: string;
	role?: "user" | "admin";
	status?: "active" | "inactive" | "suspended" | "pending_verification";
}

// Store pour les plans
export const usePlansStore = defineStore("plans", {
	state: () => ({
		plans: [] as Plan[],
		loading: false,
		error: null as string | null,
	}),

	actions: {
		async fetchPlans() {
			this.loading = true;
			this.error = null;

			try {
				const { apiFetch } = useApi();
				const response = (await apiFetch("/plans")) as Plan[];
				this.plans = response;
			} catch (error: any) {
				this.error =
					error.data?.message ||
					"Erreur lors du chargement des plans";
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

export const useUsersStore = defineStore("users", {
	state: () => ({
		users: [] as User[],
		loading: false,
		error: null as string | null,
	}),

	getters: {
		getUserById: (state) => (id: string) => {
			return state.users.find((user) => user.id === id);
		},

		getActiveUsers: (state) => {
			return state.users.filter((user) => user.status === "active");
		},

		getAdmins: (state) => {
			return state.users.filter((user) => user.role === "admin");
		},
	},

	actions: {
		async fetchUsers() {
			this.loading = true;
			this.error = null;

			try {
				const { apiFetch } = useApi();
				const response = (await apiFetch("/admin/users")) as User[];
				this.users = response;
			} catch (error: any) {
				this.error =
					error.data?.message ||
					"Erreur lors du chargement des utilisateurs";
				throw error;
			} finally {
				this.loading = false;
			}
		},

		async createUser(userData: CreateUserData) {
			this.loading = true;
			this.error = null;

			try {
				const { apiFetch } = useApi();
				const response = (await apiFetch("/admin/users", {
					method: "POST",
					body: userData,
				})) as User;
				this.users.push(response);
				return response;
			} catch (error: any) {
				this.error =
					error.data?.message ||
					"Erreur lors de la création de l'utilisateur";
				throw error;
			} finally {
				this.loading = false;
			}
		},

		async updateUser(userData: UpdateUserData) {
			this.loading = true;
			this.error = null;

			try {
				const { apiFetch } = useApi();
				// Extract id and exclude it from the body
				const { id, ...updateData } = userData;
				const response = (await apiFetch(`/admin/users/${id}`, {
					method: "PUT",
					body: updateData,
				})) as User;

				const index = this.users.findIndex((user) => user.id === id);
				if (index !== -1) {
					this.users[index] = response;
				}

				return response;
			} catch (error: any) {
				this.error =
					error.data?.message ||
					"Erreur lors de la mise à jour de l'utilisateur";
				throw error;
			} finally {
				this.loading = false;
			}
		},

		async updateUserStatus(
			userId: string,
			status: "active" | "inactive" | "suspended" | "pending_verification"
		) {
			this.loading = true;
			this.error = null;

			try {
				const { apiFetch } = useApi();
				const response = (await apiFetch(
					`/admin/users/${userId}/status`,
					{
						method: "PATCH",
						body: { status },
					}
				)) as User;

				const index = this.users.findIndex(
					(user) => user.id === userId
				);
				if (index !== -1) {
					this.users[index] = response;
				}

				return response;
			} catch (error: any) {
				this.error =
					error.data?.message ||
					"Erreur lors de la mise à jour du statut";
				throw error;
			} finally {
				this.loading = false;
			}
		},

		async deleteUser(userId: string) {
			this.loading = true;
			this.error = null;

			try {
				const { apiFetch } = useApi();
				await apiFetch(`/admin/users/${userId}`, {
					method: "DELETE",
				});

				const index = this.users.findIndex(
					(user) => user.id === userId
				);
				if (index !== -1) {
					this.users.splice(index, 1);
				}
			} catch (error: any) {
				this.error =
					error.data?.message ||
					"Erreur lors de la suppression de l'utilisateur";
				throw error;
			} finally {
				this.loading = false;
			}
		},

		async changeUserPlan(userId: string, planId: string) {
			this.loading = true;
			this.error = null;

			try {
				const { apiFetch } = useApi();
				const response = (await apiFetch(
					`/admin/users/${userId}/plan`,
					{
						method: "PATCH",
						body: { planId },
					}
				)) as User;

				const index = this.users.findIndex(
					(user) => user.id === userId
				);
				if (index !== -1) {
					this.users[index] = response;
				}

				return response;
			} catch (error: any) {
				this.error =
					error.data?.message || "Erreur lors du changement de plan";
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
