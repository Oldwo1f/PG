<template>
	<div v-if="isAuthorized">
		<slot />
	</div>
	<div
		v-else
		class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
	>
		<div class="sm:mx-auto sm:w-full sm:max-w-md">
			<div class="text-center">
				<h2 class="text-2xl font-bold text-gray-900 mb-4">
					Accès refusé
				</h2>
				<p class="text-gray-600 mb-6">
					Vous devez être connecté en tant qu'administrateur pour
					accéder à cette page.
				</p>
				<NuxtLink to="/" class="admin-button-primary">
					Se connecter
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "~/composables/useAuth";

const props = defineProps<{
	requireAuth?: boolean;
	requireAdmin?: boolean;
}>();

const authStore = useAuthStore();

const isAuthorized = computed(() => {
	if (props.requireAuth && !authStore.isAuthenticated) {
		return false;
	}

	if (props.requireAdmin && !authStore.isAdmin) {
		return false;
	}

	return true;
});

// Redirection automatique si non autorisé
watch(
	isAuthorized,
	(authorized) => {
		if (!authorized) {
			navigateTo("/");
		}
	},
	{ immediate: true }
);
</script>
