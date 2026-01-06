<template>
	<nav class="bg-white shadow-sm border-b border-gray-200">
		<div class="w-full px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<!-- Logo et titre -->
				<div class="flex items-center">
					<NuxtLink to="/" class="flex items-center">
						<h1 class="text-xl font-semibold text-gray-900">
							Perfect Generations - Administration
						</h1>
					</NuxtLink>
				</div>

				<!-- Navigation links -->
				<div
					v-if="authStore.isAuthenticated"
					class="hidden md:flex items-center space-x-8"
				>
					<NuxtLink
						to="/admin"
						class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
						:class="{ 'bg-gray-100': $route.path === '/admin' }"
					>
						Dashboard
					</NuxtLink>
					<NuxtLink
						to="/admin/users"
						class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
						:class="{
							'bg-gray-100':
								$route.path.startsWith('/admin/users'),
						}"
					>
						Utilisateurs
					</NuxtLink>
					<NuxtLink
						to="/admin/templates"
						class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
						:class="{
							'bg-gray-100':
								$route.path.startsWith('/admin/templates'),
						}"
					>
						Templates
					</NuxtLink>
					<NuxtLink
						to="/admin/brands"
						class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
						:class="{
							'bg-gray-100':
								$route.path.startsWith('/admin/brands'),
						}"
					>
						Marques
					</NuxtLink>
				</div>

				<!-- User menu -->
				<div class="flex items-center space-x-4">
					<div
						v-if="authStore.isAuthenticated"
						class="flex items-center space-x-3"
					>
						<div class="flex items-center space-x-2">
							<div
								class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center"
							>
								<span
									class="text-primary-600 font-semibold text-sm"
								>
									{{
										authStore.user?.firstName?.charAt(0) ||
										authStore.user?.email?.charAt(0) ||
										"A"
									}}
								</span>
							</div>
							<span class="text-sm text-gray-700 hidden sm:block">
								{{
									authStore.user?.firstName ||
									authStore.user?.email
								}}
							</span>
						</div>
						<button
							@click="authStore.logout()"
							class="admin-button-secondary text-sm"
						>
							Déconnexion
						</button>
					</div>
					<div v-else class="flex items-center space-x-3">
						<NuxtLink to="/" class="admin-button-primary text-sm">
							Se connecter
						</NuxtLink>
					</div>
				</div>
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/composables/useAuth";

const authStore = useAuthStore();
</script>
