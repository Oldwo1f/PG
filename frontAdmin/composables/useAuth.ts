import { defineStore } from "pinia";
import type { AdminUser } from "~/types/auth";
import type { LoginCredentials } from "~/types/auth";

interface AuthState {
	user: AdminUser | null;
	token: string | null;
	isAuthenticated: boolean;
	loading: boolean;
	error: string | null;
}

export const useAuthStore = defineStore("auth", {
	state: (): AuthState => ({
		user: null,
		token: null,
		isAuthenticated: false,
		loading: false,
		error: null,
	}),

	getters: {
		getAuthHeaders: (state): { [key: string]: string } => {
			if (state.token) {
				return { Authorization: `Bearer ${state.token}` };
			}
			return {};
		},
		isAdmin: (state): boolean => {
			return (
				state.user?.role === "admin" ||
				state.user?.role === "super_admin"
			);
		},
	},

	actions: {
		setUser(newUser: AdminUser | null) {
			this.user = newUser;
			this.isAuthenticated = !!newUser;
			if (import.meta.client && newUser) {
				localStorage.setItem("adminUser", JSON.stringify(newUser));
			}
		},

		async login(credentials: LoginCredentials) {
			this.loading = true;
			this.error = null;
			try {
				const config = useRuntimeConfig();
				const apiBase = (config.public.apiBase || "").replace(/\/$/, "");

				const response = await fetch(`${apiBase}/auth/admin/login`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(credentials),
				});
				const data = await response.json();
				if (!response.ok) {
					throw new Error(
						data.message || "La connexion administrateur a échoué"
					);
				}

				// Vérifier que l'utilisateur a les droits admin
				if (
					data.user.role !== "admin" &&
					data.user.role !== "super_admin"
				) {
					throw new Error(
						"Accès refusé. Droits administrateur requis."
					);
				}

				this.token = data.access_token;
				this.user = data.user;
				this.isAuthenticated = true;

				if (import.meta.client) {
					localStorage.setItem("adminToken", data.access_token);
					localStorage.setItem(
						"adminUser",
						JSON.stringify(data.user)
					);
				}
			} catch (error: any) {
				this.error = error.message;
				this.isAuthenticated = false;
				throw error;
			} finally {
				this.loading = false;
			}
		},

		logout() {
			this.user = null;
			this.token = null;
			this.isAuthenticated = false;
			if (import.meta.client) {
				localStorage.removeItem("adminToken");
				localStorage.removeItem("adminUser");
			}
			navigateTo("/");
		},

		initializeAuth() {
			if (import.meta.client) {
				const token = localStorage.getItem("adminToken");
				const user = localStorage.getItem("adminUser");
				if (token && user) {
					const userData = JSON.parse(user);
					// Vérifier que l'utilisateur a toujours les droits admin
					if (
						userData.role === "admin" ||
						userData.role === "super_admin"
					) {
						this.token = token;
						this.user = userData;
						this.isAuthenticated = true;
					} else {
						// Nettoyer les données si l'utilisateur n'a plus les droits
						this.logout();
					}
				}
			}
		},
	},
});
