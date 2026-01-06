<template>
	<nav class="bg-white shadow">
		<div class="container mx-auto px-4">
			<div class="flex justify-between items-center h-16">
				<!-- Logo -->
				<div class="flex items-center">
					<NuxtLink to="/" class="text-2xl font-bold text-blue-600">
						Perfect Generations
					</NuxtLink>
				</div>

				<!-- Navigation Links -->
				<div class="hidden md:flex space-x-8">
					<NuxtLink
						to="/studio"
						class="text-gray-600 hover:text-gray-900 flex items-center transition-colors"
					>
						<i class="ph-duotone ph-play mr-2"></i>
						Studio
					</NuxtLink>
					<NuxtLink
						to="/images"
						class="text-gray-600 hover:text-gray-900 flex items-center transition-colors"
					>
						<i class="ph-duotone ph-image mr-2"></i>
						Images
					</NuxtLink>
					<NuxtLink
						to="/brands"
						class="text-gray-600 hover:text-gray-900 flex items-center transition-colors"
					>
						<i class="ph-duotone ph-palette mr-2"></i>
						Marques
					</NuxtLink>
					<NuxtLink
						to="/templates"
						class="text-gray-600 hover:text-gray-900 flex items-center transition-colors"
					>
						<i class="ph-duotone ph-file-text mr-2"></i>
						Templates
					</NuxtLink>
					<NuxtLink
						to="/templates/gallery"
						class="text-gray-600 hover:text-gray-900 flex items-center transition-colors"
					>
						<i class="ph-duotone ph-images mr-2"></i>
						Galerie
					</NuxtLink>
					<NuxtLink
						to="/pricing"
						class="text-gray-600 hover:text-gray-900 flex items-center transition-colors"
					>
						<i class="ph-duotone ph-currency-eur mr-2"></i>
						Tarifs
					</NuxtLink>
				</div>

				<!-- Auth Section -->
				<div class="flex items-center space-x-4">
					<!-- User Menu (when authenticated) -->
					<div v-if="isAuthenticated" class="relative user-menu">
						<button
							@click="showUserMenu = !showUserMenu"
							class="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							<div
								class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center"
							>
								<span class="text-white font-medium">
									{{ userInitials }}
								</span>
							</div>
							<span class="text-gray-700 hidden sm:block">{{
								userName
							}}</span>
							<i class="ph-duotone ph-caret-down h-4 w-4"></i>
						</button>

						<!-- User dropdown menu -->
						<div
							v-if="showUserMenu"
							class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
						>
							<NuxtLink
								to="/dashboard"
								class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								Tableau de bord
							</NuxtLink>
							<NuxtLink
								to="/dashboard/profile"
								class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								Mon profil
							</NuxtLink>
							<NuxtLink
								to="/dashboard/settings"
								class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								Paramètres
							</NuxtLink>
							<div class="border-t border-gray-100"></div>
							<button
								@click="handleLogout"
								class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								Déconnexion
							</button>
						</div>
					</div>

					<!-- Auth Buttons (when not authenticated) -->
					<div v-else class="flex items-center space-x-4">
						<NuxtLink
							to="/auth/login"
							class="text-gray-600 hover:text-gray-900 transition-colors"
						>
							Connexion
						</NuxtLink>
						<NuxtLink
							to="/auth/register"
							class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
						>
							S'inscrire
						</NuxtLink>
					</div>

					<!-- Mobile menu button -->
					<button
						@click="showMobileMenu = !showMobileMenu"
						class="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 mobile-menu"
					>
						<i class="ph-duotone ph-list h-6 w-6"></i>
					</button>
				</div>
			</div>

			<!-- Mobile menu -->
			<div v-if="showMobileMenu" class="md:hidden mobile-menu">
				<div
					class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200"
				>
					<NuxtLink
						to="/studio"
						class="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
					>
						<i class="ph-duotone ph-play mr-2"></i>
						Studio
					</NuxtLink>
					<NuxtLink
						to="/images"
						class="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
					>
						<i class="ph-duotone ph-image mr-2"></i>
						Images
					</NuxtLink>
					<NuxtLink
						to="/brands"
						class="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
					>
						<i class="ph-duotone ph-palette mr-2"></i>
						Marques
					</NuxtLink>
					<NuxtLink
						to="/templates"
						class="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
					>
						<i class="ph-duotone ph-file-text mr-2"></i>
						Templates
					</NuxtLink>
					<NuxtLink
						to="/templates/gallery"
						class="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
					>
						<i class="ph-duotone ph-images mr-2"></i>
						Galerie
					</NuxtLink>
					<NuxtLink
						to="/pricing"
						class="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
					>
						<i class="ph-duotone ph-currency-eur mr-2"></i>
						Tarifs
					</NuxtLink>

					<!-- Mobile auth links -->
					<div
						v-if="!isAuthenticated"
						class="pt-4 border-t border-gray-200"
					>
						<NuxtLink
							to="/auth/login"
							class="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
						>
							Connexion
						</NuxtLink>
						<NuxtLink
							to="/auth/register"
							class="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
						>
							S'inscrire
						</NuxtLink>
					</div>
				</div>
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "~/composables/useAuth";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { user, isAuthenticated } = storeToRefs(authStore);

// UI state
const showUserMenu = ref(false);
const showMobileMenu = ref(false);

// Computed properties
const userInitials = computed(() => {
	if (!user.value) return "";
	const firstName = user.value.firstName || "";
	const lastName = user.value.lastName || "";
	return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
});

const userName = computed(() => {
	if (!user.value) return "";
	const firstName = user.value.firstName || "";
	const lastName = user.value.lastName || "";
	if (firstName || lastName) {
		return `${firstName} ${lastName}`.trim();
	}
	return user.value.email;
});

// Methods
const handleLogout = () => {
	authStore.logout();
	showUserMenu.value = false;
};

// Close menus when clicking outside
onMounted(() => {
	const handleClickOutside = (event: Event) => {
		const target = event.target as Element;
		if (!target.closest(".user-menu") && !target.closest(".mobile-menu")) {
			showUserMenu.value = false;
			showMobileMenu.value = false;
		}
	};

	document.addEventListener("click", handleClickOutside);

	onUnmounted(() => {
		document.removeEventListener("click", handleClickOutside);
	});
});
</script>
