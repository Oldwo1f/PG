<template>
	<div class="space-y-4">
		<!-- Subscription Info -->
		<div v-if="user.subscription" class="admin-card">
			<div class="flex justify-between items-center mb-4">
				<h3 class="text-lg font-semibold text-gray-900">Abonnement</h3>
				<button
					@click="$emit('change-plan')"
					class="admin-button-primary text-sm"
				>
					Changer le plan
				</button>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700"
						>Plan</label
					>
					<div class="mt-1 text-sm text-gray-900">
						{{ user.subscription.plan.name }}
					</div>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700"
						>Prix mensuel</label
					>
					<div class="mt-1 text-sm text-gray-900">
						{{ formatPrice(user.subscription.plan.priceMonthly) }}
					</div>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700"
						>Statut</label
					>
					<div class="mt-1">
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
				<div v-if="user.subscription.currentPeriodEnd">
					<label class="block text-sm font-medium text-gray-700">
						Expire le
					</label>
					<div class="mt-1 text-sm text-gray-900">
						{{ formatDate(user.subscription.currentPeriodEnd) }}
					</div>
				</div>
				<div v-if="user.subscription.stripeSubscriptionId">
					<label class="block text-sm font-medium text-gray-700">
						ID Stripe
					</label>
					<div class="mt-1 text-sm text-gray-500 font-mono">
						{{ user.subscription.stripeSubscriptionId }}
					</div>
				</div>
			</div>
		</div>

		<!-- Usage Limits -->
		<div class="admin-card">
			<h3 class="text-lg font-semibold text-gray-900 mb-4">
				Limites et utilisation
			</h3>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<!-- Images Generated -->
				<div>
					<label class="block text-sm font-medium text-gray-700">
						Images générées ce mois
					</label>
					<div class="mt-1">
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-900">
								{{ user.imagesGeneratedThisMonth }} /
								{{
									monthlyImageLimit === -1
										? "∞"
										: monthlyImageLimit
								}}
							</span>
							<span
								:class="{
									'text-xs font-medium': true,
									'text-green-600': canGenerateImage,
									'text-red-600': !canGenerateImage,
								}"
							>
								{{
									canGenerateImage
										? "Disponible"
										: "Limite atteinte"
								}}
							</span>
						</div>
						<div class="mt-2 bg-gray-200 rounded-full h-2">
							<div
								class="bg-primary-600 h-2 rounded-full transition-all duration-300"
								:class="{
									'bg-red-500': !canGenerateImage,
								}"
								:style="{
									width: `${imageUsagePercentage}%`,
								}"
							></div>
						</div>
					</div>
				</div>

				<!-- Storage Usage -->
				<div v-if="user.storageUsage">
					<label class="block text-sm font-medium text-gray-700">
						Stockage utilisé
					</label>
					<div class="mt-1">
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-900">
								{{ storageUsedMB }} / {{ storageLimitMB }} MB
							</span>
							<span class="text-xs text-gray-500">
								{{ storageUsagePercentage }}%
							</span>
						</div>
						<div class="mt-2 bg-gray-200 rounded-full h-2">
							<div
								class="h-2 rounded-full transition-all duration-300"
								:class="{
									'bg-green-500': storageUsagePercentage < 70,
									'bg-yellow-500':
										storageUsagePercentage >= 70 &&
										storageUsagePercentage < 90,
									'bg-red-500': storageUsagePercentage >= 90,
								}"
								:style="{
									width: `${Math.min(
										storageUsagePercentage,
										100
									)}%`,
								}"
							></div>
						</div>
					</div>
				</div>

				<!-- Templates Usage -->
				<div>
					<label class="block text-sm font-medium text-gray-700">
						Templates utilisés
					</label>
					<div class="mt-1">
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-900">
								{{ user.templatesCount }} /
								{{
									user.subscription?.plan?.templateLimit ===
									-1
										? "∞"
										: user.subscription?.plan
												?.templateLimit || 0
								}}
							</span>
							<span
								:class="{
									'text-xs font-medium': true,
									'text-green-600': canCreateTemplate,
									'text-red-600': !canCreateTemplate,
								}"
							>
								{{
									canCreateTemplate
										? "Disponible"
										: "Limite atteinte"
								}}
							</span>
						</div>
						<div class="mt-2 bg-gray-200 rounded-full h-2">
							<div
								class="bg-primary-600 h-2 rounded-full transition-all duration-300"
								:class="{
									'bg-red-500': !canCreateTemplate,
								}"
								:style="{
									width: `${templateUsagePercentage}%`,
								}"
							></div>
						</div>
					</div>
				</div>

				<!-- Brands Usage -->
				<div>
					<label class="block text-sm font-medium text-gray-700">
						Marques utilisées
					</label>
					<div class="mt-1">
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-900">
								{{ user.brandsCount }} /
								{{
									user.subscription?.plan?.brandLimit === -1
										? "∞"
										: user.subscription?.plan?.brandLimit ||
										  0
								}}
							</span>
							<span
								:class="{
									'text-xs font-medium': true,
									'text-green-600': canCreateBrand,
									'text-red-600': !canCreateBrand,
								}"
							>
								{{
									canCreateBrand
										? "Disponible"
										: "Limite atteinte"
								}}
							</span>
						</div>
						<div class="mt-2 bg-gray-200 rounded-full h-2">
							<div
								class="bg-primary-600 h-2 rounded-full transition-all duration-300"
								:class="{
									'bg-red-500': !canCreateBrand,
								}"
								:style="{
									width: `${brandUsagePercentage}%`,
								}"
							></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- ICI-->
		<!-- Plan Details -->
		<div v-if="user.subscription" class="admin-card">
			<h3 class="text-lg font-semibold text-gray-900 mb-4">
				Détails du plan
			</h3>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700">
						Limite templates
					</label>
					<div class="mt-1 text-sm text-gray-900">
						{{ user.subscription.plan.templateLimit }}
					</div>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700">
						Limite marques
					</label>
					<div class="mt-1 text-sm text-gray-900">
						{{ user.subscription.plan.brandLimit }}
					</div>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700">
						Limite membres équipe
					</label>
					<div class="mt-1 text-sm text-gray-900">
						{{ user.subscription.plan.teamMemberLimit }}
					</div>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700">
						Intégrations incluses
					</label>
					<div class="mt-1">
						<span
							:class="{
								'px-2 py-1 text-xs font-medium rounded-full': true,
								'bg-green-100 text-green-800':
									user.subscription.plan.integrationsIncluded,
								'bg-gray-100 text-gray-800':
									!user.subscription.plan
										.integrationsIncluded,
							}"
						>
							{{
								user.subscription.plan.integrationsIncluded
									? "Oui"
									: "Non"
							}}
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Monthly Usage History -->
		<div
			v-if="user.monthlyUsage && user.monthlyUsage.length > 0"
			class="admin-card"
		>
			<h3 class="text-lg font-semibold text-gray-900 mb-4">
				Historique d'utilisation
			</h3>
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Mois
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Images générées
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Images uploadées
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						<tr v-for="usage in sortedMonthlyUsage" :key="usage.id">
							<td
								class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
							>
								{{ formatMonthYear(usage.monthYear) }}
							</td>
							<td
								class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
							>
								{{ usage.imagesGenerated }}
							</td>
							<td
								class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
							>
								{{ usage.imagesUploaded }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { User } from "~/stores/users";

interface Props {
	user: User;
}

interface Emits {
	(e: "change-plan"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Computed properties
const sortedMonthlyUsage = computed(() => {
	if (!props.user.monthlyUsage) return [];
	return [...props.user.monthlyUsage].sort((a, b) =>
		b.monthYear.localeCompare(a.monthYear)
	);
});

// Get image limit from plan
const monthlyImageLimit = computed(() => {
	return props.user.subscription?.plan?.imageLimitMonthly || 0;
});

// Check if user can generate more images
const canGenerateImage = computed(() => {
	const limit = monthlyImageLimit.value;
	if (limit === -1) return true; // Unlimited
	return props.user.imagesGeneratedThisMonth < limit;
});

// Calculate usage percentage
const imageUsagePercentage = computed(() => {
	const limit = monthlyImageLimit.value;
	if (limit === -1 || limit === 0) return 0;
	return Math.min((props.user.imagesGeneratedThisMonth / limit) * 100, 100);
});

// Template usage
const templateLimit = computed(() => {
	return props.user.subscription?.plan?.templateLimit || 0;
});

const canCreateTemplate = computed(() => {
	const limit = templateLimit.value;
	if (limit === -1) return true; // Unlimited
	return props.user.templatesCount < limit;
});

const templateUsagePercentage = computed(() => {
	const limit = templateLimit.value;
	if (limit === -1 || limit === 0) return 0;
	return Math.min((props.user.templatesCount / limit) * 100, 100);
});

// Brand usage
const brandLimit = computed(() => {
	return props.user.subscription?.plan?.brandLimit || 0;
});

const canCreateBrand = computed(() => {
	const limit = brandLimit.value;
	if (limit === -1) return true; // Unlimited
	return props.user.brandsCount < limit;
});

const brandUsagePercentage = computed(() => {
	const limit = brandLimit.value;
	if (limit === -1 || limit === 0) return 0;
	return Math.min((props.user.brandsCount / limit) * 100, 100);
});

const storageUsagePercentage = computed(
	() => props.user.storageUsagePercentage || 0
);
const storageUsedMB = computed(() => props.user.storageUsedMB || 0);
const storageLimitMB = computed(() => props.user.storageLimitMB || 0);

// Methods
const formatPrice = (price: number): string => {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "EUR",
	}).format(price); // Price is already in euros
};

const formatDate = (dateString: string): string => {
	return new Date(dateString).toLocaleDateString("fr-FR", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

const formatMonthYear = (monthYear: string): string => {
	const [year, month] = monthYear.split("-");
	const date = new Date(parseInt(year), parseInt(month) - 1);
	return date.toLocaleDateString("fr-FR", {
		year: "numeric",
		month: "long",
	});
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
</script>
