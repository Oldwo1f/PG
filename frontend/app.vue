<template>
	<div>
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "~/composables/useAuth";

const authStore = useAuthStore();

onMounted(() => {
	// Initialize auth state from localStorage
	authStore.initializeAuth();
});
</script>

<style>
html {
	font-family: "Inter", system-ui, -apple-system, sans-serif;
}
</style>
