import { useAuthStore } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware((to, from) => {
	// Ne s'exécuter que côté client
	if (process.server) return;

	const authStore = useAuthStore();

	// Vérifier l'authentification pour les pages protégées
	if (to.meta.auth && !authStore.isAuthenticated) {
		return navigateTo(`/?redirect=${encodeURIComponent(to.fullPath)}`, {
			replace: true,
		});
	}

	// Vérifier les droits admin pour les pages d'administration
	if (to.meta.admin && !authStore.isAdmin) {
		return navigateTo(`/?redirect=${encodeURIComponent(to.fullPath)}`, {
			replace: true,
		});
	}

	// Rediriger les utilisateurs connectés depuis la page de login
	if (to.path === "/" && authStore.isAuthenticated) {
		return navigateTo("/admin", {
			replace: true,
		});
	}
});
