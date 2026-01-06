<template>
	<div id="app">
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/composables/useAuth";

// Configuration globale de l'application
const authStore = useAuthStore();

// Initialiser l'authentification au chargement de l'application
onMounted(() => {
	authStore.initializeAuth();
});

// Vérifier l'authentification à chaque changement de route
watch(
	() => useRoute().path,
	(newPath) => {
		if (process.client) {
			// Vérifier si on essaie d'accéder à une page protégée sans être connecté
			const route = useRoute();
			if (route.meta.auth && !authStore.isAuthenticated) {
				navigateTo(`/?redirect=${encodeURIComponent(route.fullPath)}`);
			}
			if (route.meta.admin && !authStore.isAdmin) {
				navigateTo(`/?redirect=${encodeURIComponent(route.fullPath)}`);
			}
		}
	}
);
</script>

<style>
html,
body {
	font-family: "Inter", sans-serif;
	margin: 0;
	padding: 0;
}

#app {
	min-height: 100vh;
}
</style>
