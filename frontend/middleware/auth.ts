import { useAuthStore } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware((to, from) => {
	if (process.server) return;

	const authStore = useAuthStore();
	// On server, this is handled by app.vue's onMounted
	// On client, this is called on each navigation
	if (!authStore.isAuthenticated) {
		authStore.initializeAuth();
	}

	if (to.meta.auth && !authStore.isAuthenticated) {
		return navigateTo("/auth/login", {
			replace: true,
			query: {
				redirect: to.fullPath,
			},
		});
	}
});
