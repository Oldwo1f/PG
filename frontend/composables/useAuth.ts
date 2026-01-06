import { defineStore } from "pinia";
import type { User } from "~/types/user";
import type { LoginCredentials } from "~/types/auth";

const API_URL = "http://localhost:3001/api";

interface AuthState {
	user: User | null;
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
	},

	actions: {
		setUser(newUser: User | null) {
			this.user = newUser;
			this.isAuthenticated = !!newUser;
			if (process.client && newUser) {
				localStorage.setItem("user", JSON.stringify(newUser));
			}
		},

		async login(credentials: LoginCredentials) {
			this.loading = true;
			this.error = null;
			try {
				const response = await fetch(`${API_URL}/auth/login`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(credentials),
				});
				const data = await response.json();
				if (!response.ok) {
					throw new Error(data.message || "La connexion a échoué");
				}
				this.token = data.access_token;
				this.user = data.user;
				this.isAuthenticated = true;

				if (process.client) {
					localStorage.setItem("authToken", data.access_token);
					localStorage.setItem("user", JSON.stringify(data.user));
				}
			} catch (error: any) {
				this.error = error.message;
				this.isAuthenticated = false;
				// Rethrow to be caught in component
				throw error;
			} finally {
				this.loading = false;
			}
		},

		async register(payload: any) {
			this.loading = true;
			this.error = null;
			try {
				const response = await fetch(`${API_URL}/auth/register`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
				const data = await response.json();
				if (!response.ok) {
					throw new Error(data.message || "L'inscription a échoué");
				}
				this.token = data.access_token;
				this.user = data.user;
				this.isAuthenticated = true;

				if (process.client) {
					localStorage.setItem("authToken", data.access_token);
					localStorage.setItem("user", JSON.stringify(data.user));
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
			if (process.client) {
				localStorage.removeItem("authToken");
				localStorage.removeItem("user");
			}
			navigateTo("/auth/login");
		},

		initializeAuth() {
			if (process.client) {
				const token = localStorage.getItem("authToken");
				const user = localStorage.getItem("user");
				if (token && user) {
					this.token = token;
					this.user = JSON.parse(user);
					this.isAuthenticated = true;
				}
			}
		},
	},
});
