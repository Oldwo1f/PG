<template>
	<div
		class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
	>
		<div class="sm:mx-auto sm:w-full sm:max-w-md">
			<div class="text-center">
				<h2 class="text-3xl font-extrabold text-gray-900">
					Administration
				</h2>
				<p class="mt-2 text-sm text-gray-600">
					Perfect Generations - Interface d'administration
				</p>
			</div>
		</div>

		<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
			<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
				<form class="space-y-6" @submit.prevent="handleLogin">
					<div>
						<label
							for="email"
							class="block text-sm font-medium text-gray-700"
						>
							Adresse email
						</label>
						<div class="mt-1">
							<input
								id="email"
								v-model="credentials.email"
								name="email"
								type="email"
								autocomplete="email"
								required
								class="admin-input"
								placeholder="admin@example.com"
							/>
						</div>
					</div>

					<div>
						<label
							for="password"
							class="block text-sm font-medium text-gray-700"
						>
							Mot de passe
						</label>
						<div class="mt-1">
							<input
								id="password"
								v-model="credentials.password"
								name="password"
								type="password"
								autocomplete="current-password"
								required
								class="admin-input"
								placeholder="••••••••"
							/>
						</div>
					</div>

					<div
						v-if="authStore.error"
						class="text-red-600 text-sm bg-red-50 p-3 rounded-md"
					>
						{{ authStore.error }}
					</div>

					<div>
						<button
							type="submit"
							:disabled="authStore.loading"
							class="admin-button-primary w-full"
						>
							<span
								v-if="authStore.loading"
								class="flex items-center justify-center"
							>
								<svg
									class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Connexion...
							</span>
							<span v-else> Se connecter </span>
						</button>
					</div>
				</form>

				<div class="mt-6">
					<div class="relative">
						<div
							class="absolute inset-0 flex items-center"
							aria-hidden="true"
						>
							<div class="w-full border-t border-gray-300" />
						</div>
						<div class="relative flex justify-center text-sm">
							<span class="px-2 bg-white text-gray-500">
								Accès sécurisé
							</span>
						</div>
					</div>

					<div class="mt-6 text-center">
						<p class="text-sm text-gray-600">
							Cette interface est réservée aux administrateurs
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useAuthStore } from "~/composables/useAuth";

definePageMeta({
	layout: "default",
	auth: false,
});

const authStore = useAuthStore();
const route = useRoute();

const credentials = reactive({
	email: "",
	password: "",
});

const handleLogin = async () => {
	try {
		await authStore.login(credentials);
		if (authStore.isAuthenticated) {
			// Rediriger vers la page demandée ou le dashboard
			const redirect = route.query.redirect as string;
			await navigateTo(redirect || "/admin");
		}
	} catch (error) {
		// Error is already set in the store, no need to handle it here
		console.error("Admin login failed:", error);
	}
};

// Redirection automatique si déjà connecté
onMounted(() => {
	if (authStore.isAuthenticated) {
		navigateTo("/admin");
	}
});
</script>
