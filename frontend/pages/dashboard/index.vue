<template>
	<div class="min-h-screen bg-gray-50">
		<!-- Header -->
		<header class="bg-white shadow">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between items-center py-6">
					<div class="flex items-center">
						<h1 class="text-2xl font-bold text-gray-900">
							Tableau de bord
						</h1>
					</div>
					<div class="flex items-center space-x-4">
						<div class="relative">
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
								<span class="text-gray-700">{{
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
					</div>
				</div>
			</div>
		</header>

		<!-- Main content -->
		<main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
			<!-- Welcome section -->
			<div class="px-4 py-6 sm:px-0">
				<div class="bg-white overflow-hidden shadow rounded-lg">
					<div class="px-4 py-5 sm:p-6">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<i
									class="ph-duotone ph-wave h-8 w-8 text-blue-600"
								></i>
							</div>
							<div class="ml-4">
								<h3
									class="text-lg leading-6 font-medium text-gray-900"
								>
									Bonjour, {{ userName }} !
								</h3>
								<p class="mt-1 text-sm text-gray-500">
									Bienvenue sur votre tableau de bord Perfect
									Generations
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Stats cards -->
			<div class="px-4 py-6 sm:px-0">
				<div
					class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
				>
					<div class="bg-white overflow-hidden shadow rounded-lg">
						<div class="p-5">
							<div class="flex items-center">
								<div class="flex-shrink-0">
									<i
										class="ph-duotone ph-image h-6 w-6 text-blue-600"
									></i>
								</div>
								<div class="ml-5 w-0 flex-1">
									<dl>
										<dt
											class="text-sm font-medium text-gray-500 truncate"
										>
											Images uploadées
										</dt>
										<dd
											class="text-lg font-medium text-gray-900"
										>
											{{ stats.imagesUploaded || 0 }}
										</dd>
									</dl>
								</div>
							</div>
						</div>
					</div>

					<div class="bg-white overflow-hidden shadow rounded-lg">
						<div class="p-5">
							<div class="flex items-center">
								<div class="flex-shrink-0">
									<i
										class="ph-duotone ph-palette h-6 w-6 text-green-600"
									></i>
								</div>
								<div class="ml-5 w-0 flex-1">
									<dl>
										<dt
											class="text-sm font-medium text-gray-500 truncate"
										>
											Marques créées
										</dt>
										<dd
											class="text-lg font-medium text-gray-900"
										>
											{{ stats.brandsCreated || 0 }}
										</dd>
									</dl>
								</div>
							</div>
						</div>
					</div>

					<div class="bg-white overflow-hidden shadow rounded-lg">
						<div class="p-5">
							<div class="flex items-center">
								<div class="flex-shrink-0">
									<i
										class="ph-duotone ph-file-text h-6 w-6 text-yellow-600"
									></i>
								</div>
								<div class="ml-5 w-0 flex-1">
									<dl>
										<dt
											class="text-sm font-medium text-gray-500 truncate"
										>
											Templates utilisés
										</dt>
										<dd
											class="text-lg font-medium text-gray-900"
										>
											{{ stats.templatesUsed || 0 }}
										</dd>
									</dl>
								</div>
							</div>
						</div>
					</div>

					<div class="bg-white overflow-hidden shadow rounded-lg">
						<div class="p-5">
							<div class="flex items-center">
								<div class="flex-shrink-0">
									<i
										class="ph-duotone ph-clock h-6 w-6 text-purple-600"
									></i>
								</div>
								<div class="ml-5 w-0 flex-1">
									<dl>
										<dt
											class="text-sm font-medium text-gray-500 truncate"
										>
											Membre depuis
										</dt>
										<dd
											class="text-lg font-medium text-gray-900"
										>
											{{ memberSince }}
										</dd>
									</dl>
								</div>
							</div>
						</div>
					</div>

					<div class="bg-white overflow-hidden shadow rounded-lg">
						<div class="p-5">
							<div class="flex items-center">
								<div class="flex-shrink-0">
									<i
										class="ph-duotone ph-hard-drive h-6 w-6 text-indigo-600"
									></i>
								</div>
								<div class="ml-5 w-0 flex-1">
									<dl>
										<dt
											class="text-sm font-medium text-gray-500 truncate"
										>
											Espace de stockage
										</dt>
										<dd
											class="text-lg font-medium text-gray-900"
										>
											{{ storageInfo.availableFormatted }}
										</dd>
										<dd class="text-sm text-gray-500">
											{{ storageInfo.planName }} •
											{{ storageInfo.usedFormatted }}
											utilisés
										</dd>
									</dl>
								</div>
							</div>
							<!-- Progress bar -->
							<div class="mt-3">
								<div
									class="w-full bg-gray-200 rounded-full h-2"
								>
									<div
										class="h-2 rounded-full transition-all duration-300"
										:class="{
											'bg-green-500':
												storageInfo.usagePercentage <
												70,
											'bg-yellow-500':
												storageInfo.usagePercentage >=
													70 &&
												storageInfo.usagePercentage <
													90,
											'bg-red-500':
												storageInfo.usagePercentage >=
												90,
										}"
										:style="{
											width: `${Math.min(
												storageInfo.usagePercentage,
												100
											)}%`,
										}"
									></div>
								</div>
							</div>
						</div>
					</div>

					<div class="bg-white overflow-hidden shadow rounded-lg">
						<div class="p-5">
							<div class="flex items-center">
								<div class="flex-shrink-0">
									<i
										class="ph-duotone ph-chart-line h-6 w-6 text-orange-600"
									></i>
								</div>
								<div class="ml-5 w-0 flex-1">
									<dl>
										<dt
											class="text-sm font-medium text-gray-500 truncate"
										>
											Images générées
										</dt>
										<dd
											class="text-lg font-medium text-gray-900"
										>
											{{
												stats.imageUsageInfo
													?.imagesGenerated || 0
											}}/{{
												stats.imageUsageInfo
													?.isUnlimited
													? "∞"
													: stats.imageUsageInfo
															?.imageLimitMonthly ||
													  0
											}}
										</dd>
										<dd class="text-sm text-gray-500">
											Ce mois-ci •
											{{
												stats.imageUsageInfo
													?.planName || "Free"
											}}
										</dd>
									</dl>
								</div>
							</div>
							<!-- Progress bar -->
							<div class="mt-3">
								<div
									class="w-full bg-gray-200 rounded-full h-2"
								>
									<div
										class="h-2 rounded-full transition-all duration-300"
										:class="{
											'bg-green-500':
												(stats.imageUsageInfo
													?.usagePercentage || 0) <
												70,
											'bg-yellow-500':
												(stats.imageUsageInfo
													?.usagePercentage || 0) >=
													70 &&
												(stats.imageUsageInfo
													?.usagePercentage || 0) <
													90,
											'bg-red-500':
												(stats.imageUsageInfo
													?.usagePercentage || 0) >=
												90,
										}"
										:style="{
											width: `${Math.min(
												stats.imageUsageInfo
													?.usagePercentage || 0,
												100
											)}%`,
										}"
									></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Quick actions -->
			<div class="px-4 py-6 sm:px-0">
				<h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
					Actions rapides
				</h3>
				<div
					class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
				>
					<NuxtLink
						to="/studio"
						class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-md transition-shadow"
					>
						<div>
							<span
								class="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white"
							>
								<i class="ph-duotone ph-magic-wand h-6 w-6"></i>
							</span>
						</div>
						<div class="mt-8">
							<h3 class="text-lg font-medium">
								<span
									class="absolute inset-0"
									aria-hidden="true"
								></span>
								Générer une image
							</h3>
							<p class="mt-2 text-sm text-gray-500">
								Créez des images personnalisées avec nos
								templates
							</p>
						</div>
						<span
							class="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
							aria-hidden="true"
						>
							<i class="ph-duotone ph-arrow-right h-6 w-6"></i>
						</span>
					</NuxtLink>

					<NuxtLink
						to="/brands"
						class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-md transition-shadow"
					>
						<div>
							<span
								class="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white"
							>
								<i class="ph-duotone ph-palette h-6 w-6"></i>
							</span>
						</div>
						<div class="mt-8">
							<h3 class="text-lg font-medium">
								<span
									class="absolute inset-0"
									aria-hidden="true"
								></span>
								Gérer mes marques
							</h3>
							<p class="mt-2 text-sm text-gray-500">
								Créez et personnalisez vos marques
							</p>
						</div>
						<span
							class="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
							aria-hidden="true"
						>
							<i class="ph-duotone ph-arrow-right h-6 w-6"></i>
						</span>
					</NuxtLink>

					<NuxtLink
						to="/templates"
						class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-md transition-shadow"
					>
						<div>
							<span
								class="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 ring-4 ring-white"
							>
								<i class="ph-duotone ph-file-text h-6 w-6"></i>
							</span>
						</div>
						<div class="mt-8">
							<h3 class="text-lg font-medium">
								<span
									class="absolute inset-0"
									aria-hidden="true"
								></span>
								Explorer les templates
							</h3>
							<p class="mt-2 text-sm text-gray-500">
								Découvrez nos templates disponibles
							</p>
						</div>
						<span
							class="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
							aria-hidden="true"
						>
							<i class="ph-duotone ph-arrow-right h-6 w-6"></i>
						</span>
					</NuxtLink>

					<button
						type="button"
						@click="
							isPlanModalOpen = true;
							selectedPlanId = '';
						"
						class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-md transition-shadow text-left"
					>
						<div>
							<span
								class="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white"
							>
								<i
									class="ph-duotone ph-credit-card h-6 w-6"
								></i>
							</span>
						</div>
						<div class="mt-8">
							<h3 class="text-lg font-medium">
								<span
									class="absolute inset-0"
									aria-hidden="true"
								></span>
								Changer de plan
							</h3>
							<p class="mt-2 text-sm text-gray-500">
								Gérez votre abonnement et vos limites
							</p>
						</div>
						<span
							class="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
							aria-hidden="true"
						>
							<i class="ph-duotone ph-arrow-right h-6 w-6"></i>
						</span>
					</button>
				</div>
			</div>

			<!-- Recent activity -->
			<div class="px-4 py-6 sm:px-0">
				<h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
					Activité récente
				</h3>
				<div class="bg-white shadow overflow-hidden sm:rounded-md">
					<ul class="divide-y divide-gray-200">
						<li
							v-if="recentActivity.length === 0"
							class="px-6 py-4 text-center text-gray-500"
						>
							Aucune activité récente
						</li>
						<li
							v-for="activity in recentActivity"
							:key="activity.id"
							class="px-6 py-4"
						>
							<div class="flex items-center justify-between">
								<div class="flex items-center">
									<div class="flex-shrink-0">
										<i
											:class="`ph-duotone ${activity.icon} h-5 w-5 text-gray-400`"
										></i>
									</div>
									<div class="ml-4">
										<p
											class="text-sm font-medium text-gray-900"
										>
											{{ activity.title }}
										</p>
										<p class="text-sm text-gray-500">
											{{ activity.description }}
										</p>
									</div>
								</div>
								<div class="text-sm text-gray-500">
									{{ formatDate(activity.createdAt) }}
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</main>

		<!-- Plan Change Modal -->
		<div
			v-if="isPlanModalOpen"
			class="fixed inset-0 bg-black/40 z-50 flex items-start justify-center overflow-y-auto"
			@click="closePlanModal"
		>
			<div
				class="bg-white rounded-lg shadow-xl w-full max-w-2xl mt-24 p-6"
				@click.stop
			>
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-xl font-semibold text-gray-900">
						Choisir un plan
					</h2>
					<button
						class="text-gray-400 hover:text-gray-600"
						@click="closePlanModal"
					>
						<i class="ph-duotone ph-x text-xl"></i>
					</button>
				</div>

				<div
					v-if="plansError"
					class="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm"
				>
					{{ plansError }}
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div
						v-for="plan in plans"
						:key="plan.id"
						:class="[
							'border rounded-lg p-4 cursor-pointer transition-all',
							selectedPlanId === plan.id
								? 'border-indigo-500 bg-indigo-50'
								: 'border-gray-200 hover:border-gray-300',
						]"
						@click="selectedPlanId = plan.id"
					>
						<div class="flex items-center justify-between mb-1">
							<h4 class="text-base font-semibold text-gray-900">
								{{ plan.name }}
							</h4>
							<div
								v-if="selectedPlanId === plan.id"
								class="w-4 h-4 bg-indigo-600 rounded-full"
							></div>
						</div>
						<p class="text-xl font-bold text-gray-900 mb-1">
							{{ formatPrice(plan.priceMonthly)
							}}<span class="text-sm font-normal text-gray-500"
								>/mois</span
							>
						</p>
						<ul class="text-sm text-gray-600 space-y-1">
							<li>{{ plan.imageLimitMonthly }} images/mois</li>
							<li>
								{{
									formatStorage(plan.storageLimitBytes)
								}}
								stockage
							</li>
							<li>{{ plan.templateLimit }} templates</li>
							<li>{{ plan.brandLimit }} marques</li>
							<li>{{ plan.teamMemberLimit }} membres</li>
						</ul>
					</div>
				</div>

				<div class="flex justify-end gap-3 mt-6">
					<button
						class="px-4 py-2 text-sm rounded border"
						@click="closePlanModal"
						:disabled="changingPlan"
					>
						Annuler
					</button>
					<button
						class="px-4 py-2 text-sm rounded bg-indigo-600 text-white disabled:opacity-50"
						:disabled="changingPlan || !selectedPlanId"
						@click="handleChangeMyPlan"
					>
						<span v-if="changingPlan">Changement...</span>
						<span v-else>Changer le plan</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/composables/useAuth";
import { useApi } from "~/composables/useApi";
import { useStorage } from "~/composables/useStorage";

definePageMeta({
	auth: true,
});

const authStore = useAuthStore();
const { user, isAuthenticated } = storeToRefs(authStore);
const { apiFetch } = useApi();
const { formatStorageInfo } = useStorage();

// Types
interface Activity {
	id: number;
	title: string;
	description: string;
	icon: string;
	createdAt: string;
}

interface StorageInfo {
	planName: string;
	storageLimitBytes: number;
	bytesUsed: number;
	bytesAvailable: number;
	usagePercentage: number;
	isUnlimited: boolean;
}

interface ImageUsageInfo {
	planName: string;
	imagesGenerated: number;
	imageLimitMonthly: number;
	usagePercentage: number;
	isUnlimited: boolean;
}

interface FormattedStorageInfo {
	availableFormatted: string;
	planName: string;
	usedFormatted: string;
	usagePercentage: number;
}

interface Stats {
	imagesUploaded: number;
	brandsCreated: number;
	templatesUsed: number;
	imagesGenerated: number;
	storageInfo: StorageInfo;
	imageUsageInfo: ImageUsageInfo;
}

// UI state
const showUserMenu = ref(false);
const isPlanModalOpen = ref(false);
const changingPlan = ref(false);
const plans = ref<any[]>([]);
const plansError = ref<string>("");
const selectedPlanId = ref<string>("");
const stats = ref<Stats>({
	imagesUploaded: 0,
	brandsCreated: 0,
	templatesUsed: 0,
	imagesGenerated: 0,
	storageInfo: {
		planName: "",
		storageLimitBytes: 0,
		bytesUsed: 0,
		bytesAvailable: 0,
		usagePercentage: 0,
		isUnlimited: false,
	},
	imageUsageInfo: {
		planName: "",
		imagesGenerated: 0,
		imageLimitMonthly: 0,
		usagePercentage: 0,
		isUnlimited: false,
	},
});
const recentActivity = ref<Activity[]>([]);
const storageInfo = ref<FormattedStorageInfo>({
	availableFormatted: "",
	planName: "",
	usedFormatted: "",
	usagePercentage: 0,
});

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

const memberSince = computed(() => {
	if (!user.value?.createdAt) return "N/A";
	const date = new Date(user.value.createdAt);
	return date.toLocaleDateString("fr-FR", {
		year: "numeric",
		month: "long",
	});
});

// Methods
const handleLogout = () => {
	authStore.logout();
};

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	});
};

const fetchStats = async () => {
	if (!authStore.isAuthenticated) return;
	try {
		const data = await apiFetch<Stats>("/dashboard/stats", {
			headers: authStore.getAuthHeaders,
		});
		stats.value = data;
		// Format storage info for display
		if (data.storageInfo) {
			storageInfo.value = formatStorageInfo(data.storageInfo);
		}
	} catch (error) {
		console.error("Error fetching stats:", error);
	}
};

const formatPrice = (price: number): string =>
	new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "EUR",
	}).format(price);

const formatStorage = (bytes: number): string => {
	const mb = bytes / (1024 * 1024);
	return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(0)} MB`;
};

const closePlanModal = () => {
	isPlanModalOpen.value = false;
	plansError.value = "";
};

const fetchPlans = async () => {
	try {
		plans.value = await apiFetch("/plans");
	} catch (e: any) {
		plansError.value =
			e?.data?.message || "Erreur lors du chargement des plans";
	}
};

const handleChangeMyPlan = async () => {
	if (!selectedPlanId.value) return;
	changingPlan.value = true;
	plansError.value = "";
	try {
		await apiFetch("/users/me/plan", {
			method: "PATCH",
			body: { planId: selectedPlanId.value },
			headers: authStore.getAuthHeaders,
		});
		await fetchStats();
		const me = await apiFetch("/users/me", {
			headers: authStore.getAuthHeaders,
		});
		authStore.setUser(me as any);
		isPlanModalOpen.value = false;
	} catch (e: any) {
		plansError.value =
			e?.data?.message || "Erreur lors du changement de plan";
	} finally {
		changingPlan.value = false;
	}
};

onMounted(() => {
	const handleClickOutside = (event: Event) => {
		const target = event.target as Element;
		if (!target.closest(".user-menu")) {
			showUserMenu.value = false;
		}
	};
	document.addEventListener("click", handleClickOutside);

	if (authStore.isAuthenticated) {
		fetchStats();
		fetchPlans();
	}

	onUnmounted(() => {
		document.removeEventListener("click", handleClickOutside);
	});
});
</script>
