<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
		@click="closeModal"
	>
		<div
			class="relative top-20 mx-auto p-6 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white"
			@click.stop
		>
			<!-- Header -->
			<div class="flex justify-between items-center mb-6">
				<h2 class="text-xl font-semibold text-gray-900">
					Changer le plan - {{ user?.fullName || user?.email }}
				</h2>
				<button
					@click="closeModal"
					class="text-gray-400 hover:text-gray-600"
				>
					<svg
						class="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						></path>
					</svg>
				</button>
			</div>

			<!-- Current Plan Info -->
			<div
				v-if="user?.subscription"
				class="mb-6 p-4 bg-gray-50 rounded-lg"
			>
				<h3 class="text-sm font-medium text-gray-700 mb-2">
					Plan actuel
				</h3>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-lg font-semibold text-gray-900">
							{{ user.subscription.plan.name }}
						</p>
						<p class="text-sm text-gray-500">
							{{
								formatPrice(user.subscription.plan.priceMonthly)
							}}
							/ mois
						</p>
					</div>
					<span
						:class="{
							'px-2 py-1 text-xs font-medium rounded-full': true,
							'bg-green-100 text-green-800':
								user.subscription.status === 'active',
							'bg-red-100 text-red-800':
								user.subscription.status === 'cancelled',
							'bg-yellow-100 text-yellow-800':
								user.subscription.status === 'past_due',
							'bg-gray-100 text-gray-800':
								user.subscription.status === 'incomplete',
						}"
					>
						{{ getStatusLabel(user.subscription.status) }}
					</span>
				</div>
			</div>

			<!-- Plan Selection -->
			<div class="mb-6">
				<label class="block text-sm font-medium text-gray-700 mb-3">
					Nouveau plan
				</label>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div
						v-for="plan in plans"
						:key="plan.id"
						:class="{
							'border-2 rounded-lg p-4 cursor-pointer transition-all': true,
							'border-primary-500 bg-primary-50':
								selectedPlanId === plan.id,
							'border-gray-200 hover:border-gray-300':
								selectedPlanId !== plan.id,
						}"
						@click="selectedPlanId = plan.id"
					>
						<div class="flex items-center justify-between mb-2">
							<h4 class="text-lg font-semibold text-gray-900">
								{{ plan.name }}
							</h4>
							<div
								v-if="selectedPlanId === plan.id"
								class="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center"
							>
								<svg
									class="w-3 h-3 text-white"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									></path>
								</svg>
							</div>
						</div>
						<p class="text-2xl font-bold text-gray-900 mb-2">
							{{ formatPrice(plan.priceMonthly) }}
							<span class="text-sm font-normal text-gray-500"
								>/mois</span
							>
						</p>
						<div class="space-y-1 text-sm text-gray-600">
							<p>{{ plan.imageLimitMonthly }} images/mois</p>
							<p>
								{{ formatStorage(plan.storageLimitBytes) }} de
								stockage
							</p>
							<p>{{ plan.templateLimit }} templates</p>
							<p>{{ plan.brandLimit }} marques</p>
							<p>{{ plan.teamMemberLimit }} membres d'équipe</p>
							<p
								v-if="plan.integrationsIncluded"
								class="text-green-600"
							>
								✓ Intégrations incluses
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Warning -->
			<div
				v-if="
					selectedPlanId &&
					selectedPlanId !== user?.subscription?.planId
				"
				class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
			>
				<div class="flex">
					<svg
						class="w-5 h-5 text-yellow-400 mr-2 mt-0.5"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
							clip-rule="evenodd"
						></path>
					</svg>
					<div>
						<h4 class="text-sm font-medium text-yellow-800">
							Changement de plan
						</h4>
						<p class="text-sm text-yellow-700 mt-1">
							Le plan de l'utilisateur sera immédiatement mis à
							jour. Les nouvelles limites s'appliqueront dès
							maintenant.
						</p>
					</div>
				</div>
			</div>

			<!-- Error Message -->
			<div
				v-if="error"
				class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
			>
				<p class="text-sm text-red-700">{{ error }}</p>
			</div>

			<!-- Actions -->
			<div class="flex justify-end space-x-3">
				<button
					@click="closeModal"
					class="admin-button-secondary"
					:disabled="loading"
				>
					Annuler
				</button>
				<button
					@click="handleChangePlan"
					:disabled="
						loading ||
						!selectedPlanId ||
						selectedPlanId === user?.subscription?.planId
					"
					class="admin-button-primary"
				>
					<span v-if="loading" class="flex items-center">
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
						Changement...
					</span>
					<span v-else>Changer le plan</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import type { User, Plan } from "~/stores/users";
import { usePlansStore } from "~/stores/users";

interface Props {
	user: User | null;
	isOpen: boolean;
}

interface Emits {
	(e: "close"): void;
	(e: "plan-changed", user: User): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const plansStore = usePlansStore();
const selectedPlanId = ref<string>("");
const loading = ref(false);
const error = ref<string>("");

// Computed properties
const plans = computed(() => plansStore.plans);

// Methods
const formatPrice = (price: number): string => {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "EUR",
	}).format(price); // Price is already in euros
};

const formatStorage = (bytes: number): string => {
	const mb = bytes / (1024 * 1024);
	if (mb >= 1024) {
		return `${(mb / 1024).toFixed(1)} GB`;
	}
	return `${mb.toFixed(0)} MB`;
};

const getStatusLabel = (status: string): string => {
	const labels = {
		active: "Actif",
		cancelled: "Annulé",
		past_due: "En retard",
		incomplete: "Incomplet",
	};
	return labels[status as keyof typeof labels] || status;
};

const closeModal = () => {
	selectedPlanId.value = "";
	error.value = "";
	emit("close");
};

const handleChangePlan = async () => {
	if (!props.user || !selectedPlanId.value) return;

	loading.value = true;
	error.value = "";

	try {
		const { useUsersStore } = await import("~/stores/users");
		const usersStore = useUsersStore();

		const updatedUser = await usersStore.changeUserPlan(
			props.user.id,
			selectedPlanId.value
		);
		emit("plan-changed", updatedUser);
		closeModal();
	} catch (err: any) {
		error.value = err.message || "Erreur lors du changement de plan";
	} finally {
		loading.value = false;
	}
};

// Load plans when modal opens
watch(
	() => props.isOpen,
	async (isOpen) => {
		if (isOpen && plans.value.length === 0) {
			await plansStore.fetchPlans();
		}
		if (isOpen && props.user) {
			selectedPlanId.value = props.user.subscription?.planId || "";
		}
	}
);

onMounted(async () => {
	if (plans.value.length === 0) {
		await plansStore.fetchPlans();
	}
});
</script>
