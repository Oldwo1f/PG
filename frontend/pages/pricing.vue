<template>
	<div class="min-h-screen bg-gray-50 py-12">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Header -->
			<div class="text-center mb-12">
				<h1 class="text-4xl font-bold text-gray-900 mb-4">
					Choisissez votre plan
				</h1>
				<p class="text-xl text-gray-600 max-w-3xl mx-auto">
					Des plans flexibles pour tous vos besoins. Commencez
					gratuitement et évoluez selon vos besoins.
				</p>
			</div>

			<!-- Loading state -->
			<div v-if="loading" class="text-center py-12">
				<div
					class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-gray-600"
				>
					<svg
						class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600"
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
					Chargement des plans...
				</div>
			</div>

			<!-- Pricing cards -->
			<div
				v-else
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
			>
				<div
					v-for="plan in plans"
					:key="plan.id"
					class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
					:class="{
						'ring-2 ring-blue-500': plan.id === 'pro',
						'transform scale-105': plan.id === 'pro',
					}"
				>
					<!-- Plan header -->
					<div class="px-6 py-8 text-center">
						<h3 class="text-2xl font-bold text-gray-900 mb-2">
							{{ plan.name }}
						</h3>
						<div class="mb-6">
							<span class="text-4xl font-bold text-gray-900">{{
								formatPrice(plan.priceMonthly)
							}}</span>
							<span class="text-gray-600">/mois</span>
						</div>

						<!-- Popular badge -->
						<div v-if="plan.id === 'pro'" class="mb-4">
							<span
								class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
							>
								<i class="ph-duotone ph-star mr-1"></i>
								Le plus populaire
							</span>
						</div>
					</div>

					<!-- Plan features -->
					<div class="px-6 pb-8">
						<ul class="space-y-4 mb-8">
							<li class="flex items-start">
								<i
									class="ph-duotone ph-check-circle text-green-500 mt-1 mr-3"
								></i>
								<span class="text-gray-700">
									<strong>{{
										formatNumber(plan.imageLimitMonthly)
									}}</strong>
									images par mois
								</span>
							</li>
							<li class="flex items-start">
								<i
									class="ph-duotone ph-check-circle text-green-500 mt-1 mr-3"
								></i>
								<span class="text-gray-700">
									<strong>{{
										formatStorage(plan.storageLimitBytes)
									}}</strong>
									de stockage
								</span>
							</li>
							<li class="flex items-start">
								<i
									class="ph-duotone ph-check-circle text-green-500 mt-1 mr-3"
								></i>
								<span class="text-gray-700">
									<strong>{{ plan.templateLimit }}</strong>
									templates
								</span>
							</li>
							<li class="flex items-start">
								<i
									class="ph-duotone ph-check-circle text-green-500 mt-1 mr-3"
								></i>
								<span class="text-gray-700">
									<strong>{{ plan.brandLimit }}</strong>
									marques
								</span>
							</li>
							<li class="flex items-start">
								<i
									class="ph-duotone ph-check-circle text-green-500 mt-1 mr-3"
								></i>
								<span class="text-gray-700">
									<strong>{{ plan.teamMemberLimit }}</strong>
									membres d'équipe
								</span>
							</li>
							<li
								v-if="plan.integrationsIncluded"
								class="flex items-start"
							>
								<i
									class="ph-duotone ph-check-circle text-green-500 mt-1 mr-3"
								></i>
								<span class="text-gray-700"
									>Intégrations incluses</span
								>
							</li>
						</ul>

						<!-- CTA Button -->
						<button
							class="w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200"
							:class="{
								'bg-blue-600 text-white hover:bg-blue-700':
									plan.id === 'pro',
								'bg-gray-100 text-gray-900 hover:bg-gray-200':
									plan.id !== 'pro',
							}"
							@click="selectPlan(plan)"
						>
							{{
								plan.id === "free"
									? "Commencer gratuitement"
									: "Choisir ce plan"
							}}
						</button>
					</div>
				</div>
			</div>

			<!-- FAQ Section -->
			<div class="mt-16">
				<h2 class="text-3xl font-bold text-gray-900 text-center mb-8">
					Questions fréquentes
				</h2>
				<div class="max-w-3xl mx-auto space-y-6">
					<div class="bg-white rounded-lg p-6 shadow-sm">
						<h3 class="text-lg font-semibold text-gray-900 mb-2">
							Puis-je changer de plan à tout moment ?
						</h3>
						<p class="text-gray-600">
							Oui, vous pouvez changer de plan à tout moment. Les
							changements prennent effet immédiatement.
						</p>
					</div>
					<div class="bg-white rounded-lg p-6 shadow-sm">
						<h3 class="text-lg font-semibold text-gray-900 mb-2">
							Y a-t-il des frais cachés ?
						</h3>
						<p class="text-gray-600">
							Non, tous nos prix sont transparents. Vous ne payez
							que ce qui est affiché.
						</p>
					</div>
					<div class="bg-white rounded-lg p-6 shadow-sm">
						<h3 class="text-lg font-semibold text-gray-900 mb-2">
							Puis-je annuler à tout moment ?
						</h3>
						<p class="text-gray-600">
							Oui, vous pouvez annuler votre abonnement à tout
							moment sans frais supplémentaires.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Plan {
	id: string;
	name: string;
	priceMonthly: number;
	imageLimitMonthly: number;
	storageLimitBytes: number;
	templateLimit: number;
	brandLimit: number;
	teamMemberLimit: number;
	integrationsIncluded: boolean;
}

const { apiFetch } = useApi();

const plans = ref<Plan[]>([]);
const loading = ref(true);

// Format price in euros
const formatPrice = (price: number): string => {
	if (price === 0) return "Gratuit";
	return `${price.toFixed(2)}€`;
};

// Format storage in human readable format
const formatStorage = (bytes: number): string => {
	if (bytes === -1) return "Illimité";
	const gb = bytes / (1024 * 1024 * 1024);
	const mb = bytes / (1024 * 1024);

	// Use MB for values less than 1 GB, otherwise use GB
	if (gb < 1) {
		return `${Math.round(mb)} MB`;
	} else {
		return `${gb.toFixed(1)} GB`;
	}
};

// Format numbers with thousands separator
const formatNumber = (num: number): string => {
	if (num === -1) return "Illimité";
	return num.toLocaleString("fr-FR");
};

// Fetch plans from API
const fetchPlans = async () => {
	try {
		loading.value = true;
		const response = await apiFetch<Plan[]>("/plans");
		plans.value = response;
	} catch (error) {
		console.error("Error fetching plans:", error);
	} finally {
		loading.value = false;
	}
};

// Handle plan selection
const selectPlan = (plan: Plan) => {
	if (plan.id === "free") {
		// Redirect to registration
		navigateTo("/auth/register");
	} else {
		// TODO: Implement payment flow
		console.log("Selected plan:", plan);
		alert(
			`Plan ${plan.name} sélectionné. Intégration de paiement à implémenter.`
		);
	}
};

onMounted(() => {
	fetchPlans();
});
</script>
