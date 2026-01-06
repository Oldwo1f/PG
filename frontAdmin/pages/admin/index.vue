<template>
	<AuthGuard require-auth require-admin>
		<div class="space-y-6">
			<!-- Page Header -->
			<div class="admin-card">
				<h2 class="text-2xl font-bold text-gray-900 mb-2">
					Tableau de bord d'administration
				</h2>
				<p class="text-gray-600">
					Gérez votre application Perfect Generations depuis ce
					panneau d'administration.
				</p>
			</div>

			<!-- Stats Cards -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div class="admin-card">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div
								class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center"
							>
								<span class="text-primary-600 font-semibold"
									>U</span
								>
							</div>
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-500">
								Utilisateurs
							</p>
							<p class="text-2xl font-semibold text-gray-900">
								0
							</p>
						</div>
					</div>
				</div>

				<div class="admin-card">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div
								class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"
							>
								<span class="text-green-600 font-semibold"
									>I</span
								>
							</div>
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-500">
								Images générées
							</p>
							<p class="text-2xl font-semibold text-gray-900">
								0
							</p>
						</div>
					</div>
				</div>

				<div class="admin-card">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div
								class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center"
							>
								<span class="text-yellow-600 font-semibold"
									>T</span
								>
							</div>
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-500">
								Templates
							</p>
							<p class="text-2xl font-semibold text-gray-900">
								0
							</p>
						</div>
					</div>
				</div>

				<div class="admin-card">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div
								class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"
							>
								<span class="text-purple-600 font-semibold"
									>B</span
								>
							</div>
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-500">
								Marques
							</p>
							<p class="text-2xl font-semibold text-gray-900">
								0
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Quick Actions -->
			<div class="admin-card">
				<h3 class="text-lg font-medium text-gray-900 mb-4">
					Actions rapides
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<button class="admin-button-primary">
						Gérer les utilisateurs
					</button>
					<button class="admin-button-secondary">
						Voir les templates
					</button>
					<button class="admin-button-secondary">Statistiques</button>
				</div>
			</div>
		</div>
	</AuthGuard>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/composables/useAuth";

definePageMeta({
	layout: "default",
	auth: true,
	admin: true,
});

const authStore = useAuthStore();

// Vérification supplémentaire de sécurité
onMounted(() => {
	if (!authStore.isAuthenticated) {
		navigateTo("/");
		return;
	}

	if (!authStore.isAdmin) {
		navigateTo("/");
		return;
	}
});
</script>
