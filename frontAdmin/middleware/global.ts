import { useAuthStore } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware((to, from) => {
	// Ne s'exécuter que côté client
	if (process.server) return;

	const authStore = useAuthStore();

	// Initialiser l'authentification
	authStore.initializeAuth();
});
