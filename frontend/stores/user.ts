import { defineStore } from "pinia";
import type { User } from "~/types/user"; // Assuming you have a user type
import { useAuthStore } from "~/composables/useAuth";

const API_URL = "http://localhost:3001/api";

interface ProfileState {
	loading: boolean;
	error: string | null;
	message: string | null;
}

export const useUserStore = defineStore("profile", {
	state: (): ProfileState => ({
		loading: false,
		error: null,
		message: null,
	}),

	actions: {
		clearState() {
			this.error = null;
			this.message = null;
		},

		async updateProfile(payload: Partial<User>) {
			this.loading = true;
			this.clearState();
			try {
				const authStore = useAuthStore();
				const headers = authStore.getAuthHeaders;

				const response = await fetch(`${API_URL}/users/me`, {
					method: "PATCH",
					headers: {
						...headers,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message || "Failed to update profile");
				}

				// Update the user state in the useAuth composable
				authStore.setUser({ ...authStore.user, ...data });

				this.message = "Profil mis à jour avec succès.";
				return { success: true };
			} catch (err: any) {
				this.error = err.message;
				return { success: false, error: err.message };
			} finally {
				this.loading = false;
			}
		},

		async changePassword(currentPassword: string, newPassword: string) {
			this.loading = true;
			this.clearState();
			try {
				const authStore = useAuthStore();
				const headers = authStore.getAuthHeaders;

				const response = await fetch(`${API_URL}/users/me/password`, {
					method: "POST",
					headers: {
						...headers,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ currentPassword, newPassword }),
				});

				if (response.status === 204) {
					this.message = "Mot de passe changé avec succès.";
					return { success: true };
				}

				if (!response.ok) {
					const data = await response.json();
					throw new Error(
						data.message ||
							"La modification du mot de passe a échoué"
					);
				}

				// Fallback for unexpected success responses with a body
				this.message = "Mot de passe changé avec succès.";
				return { success: true };
			} catch (err: any) {
				this.error = err.message;
				return { success: false, error: err.message };
			} finally {
				this.loading = false;
			}
		},

		async deleteAccount() {
			this.loading = true;
			this.clearState();
			try {
				const authStore = useAuthStore();
				const headers = authStore.getAuthHeaders;

				const response = await fetch(`${API_URL}/users/me`, {
					method: "DELETE",
					headers: {
						...headers,
					},
				});

				if (!response.ok) {
					const data = await response.json();
					throw new Error(data.message || "Failed to delete account");
				}

				this.message = "Compte supprimé avec succès.";
				authStore.logout();
				return { success: true };
			} catch (err: any) {
				this.error = err.message;
				return { success: false, error: err.message };
			} finally {
				this.loading = false;
			}
		},
	},
});
