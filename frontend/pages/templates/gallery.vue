<template>
	<div class="min-h-screen bg-gray-50">
		<!-- Header -->
		<div class="bg-white shadow">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between items-center py-6">
					<div>
						<h1 class="text-3xl font-bold text-gray-900">
							Galerie des Templates
						</h1>
						<p class="mt-2 text-gray-600">
							Découvrez notre collection de templates d'exemple et
							créez vos propres visuels
						</p>
					</div>
					<div class="flex space-x-3">
						<NuxtLink
							to="/templates"
							class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
							v-if="isAuthenticated"
						>
							<i class="ph-duotone ph-folder-plus mr-2"></i>
							Mes Templates
						</NuxtLink>
						<NuxtLink
							to="/studio"
							class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
						>
							<i class="ph-duotone ph-palette mr-2"></i>
							Créer un Template
						</NuxtLink>
					</div>
				</div>
			</div>
		</div>

		<!-- Filtres -->
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<div class="flex flex-wrap gap-4 items-center">
				<div class="flex-1 min-w-64">
					<label class="block text-sm font-medium text-gray-700 mb-1">
						Catégorie
					</label>
					<select
						v-model="selectedCategory"
						@change="filterTemplates"
						class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					>
						<option value="">Toutes les catégories</option>
						<option
							v-for="category in availableCategories"
							:key="category"
							:value="category"
						>
							{{ category }}
						</option>
					</select>
				</div>

				<div class="flex items-end">
					<button
						@click="clearFilters"
						class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
					>
						Effacer les filtres
					</button>
				</div>
			</div>
		</div>

		<!-- Loading state -->
		<div
			v-if="loading"
			class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
		>
			<div class="text-center">
				<div
					class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
				></div>
				<p class="mt-4 text-gray-600">Chargement des templates...</p>
			</div>
		</div>

		<!-- Grille des templates -->
		<div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
			<div v-if="templates.length === 0" class="text-center py-12">
				<i class="ph-duotone ph-image text-6xl text-gray-300 mb-4"></i>
				<h3 class="text-lg font-medium text-gray-900 mb-2">
					Aucun template trouvé
				</h3>
				<p class="text-gray-600">
					Aucun template ne correspond à vos critères de recherche.
				</p>
			</div>

			<div
				v-else
				class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
			>
				<div
					v-for="template in templates"
					:key="template.id"
					class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
				>
					<!-- Image de preview -->
					<div class="relative aspect-video bg-gray-100">
						<img
							v-if="template.previewImage"
							:src="getApiUrl(`/templates/preview/${template.previewImage}`)"
							:alt="template.name"
							class="w-full h-full object-cover"
							@error="handleImageError"
						/>
						<div
							v-else
							class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100"
						>
							<i
								class="ph-duotone ph-image text-4xl text-gray-400"
							></i>
						</div>

						<!-- Badge catégorie -->
						<div class="absolute top-2 left-2">
							<span
								class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
								:class="
									getCategoryBadgeClass(template.category)
								"
							>
								{{ template.category || "Sans catégorie" }}
							</span>
						</div>

						<!-- Badge exemple -->
						<div
							v-if="!template.userId"
							class="absolute top-2 right-2"
						>
							<span
								class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
							>
								<i class="ph-duotone ph-star mr-1"></i>
								Exemple
							</span>
						</div>
					</div>

					<!-- Informations du template -->
					<div class="p-4">
						<h3
							class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2"
						>
							{{ template.name }}
						</h3>

						<p class="text-sm text-gray-600 mb-3 line-clamp-2">
							{{ template.description }}
						</p>

						<!-- Métadonnées -->
						<div
							class="flex items-center justify-between text-sm text-gray-500 mb-4"
						>
							<div class="flex items-center">
								<i class="ph-duotone ph-ruler mr-1"></i>
								<span
									>{{ template.layout.width }}×{{
										template.layout.height
									}}</span
								>
							</div>
							<div class="flex items-center">
								<i class="ph-duotone ph-variable mr-1"></i>
								<span
									>{{
										getVariablesCount(template)
									}}
									variables</span
								>
							</div>
						</div>

						<!-- Actions -->
						<div class="flex space-x-2">
							<button
								@click="previewTemplate(template)"
								class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
							>
								<i class="ph-duotone ph-eye mr-1"></i>
								Aperçu
							</button>

							<button
								@click="useTemplate(template)"
								class="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
							>
								<i class="ph-duotone ph-palette mr-1"></i>
								Utiliser
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Modal d'aperçu -->
		<div
			v-if="showPreviewModal"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
			@click="closePreviewModal"
		>
			<div
				class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
				@click.stop
			>
				<div class="flex justify-between items-center p-4 border-b">
					<h3 class="text-lg font-semibold text-gray-900">
						{{ selectedTemplate?.name }}
					</h3>
					<button
						@click="closePreviewModal"
						class="text-gray-400 hover:text-gray-600"
					>
						<i class="ph-duotone ph-x text-xl"></i>
					</button>
				</div>

				<div class="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
					<div v-if="selectedTemplate" class="space-y-4">
						<!-- Image de preview -->
						<div class="text-center">
							<img
								v-if="selectedTemplate.previewImage"
								:src="getApiUrl(`/templates/preview/${selectedTemplate.previewImage}`)"
								:alt="selectedTemplate.name"
								class="max-w-full h-auto rounded-lg shadow-lg"
								@error="handleImageError"
							/>
						</div>

						<!-- Informations détaillées -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<h4 class="font-medium text-gray-900 mb-2">
									Description
								</h4>
								<p class="text-gray-600">
									{{ selectedTemplate.description }}
								</p>
							</div>

							<div>
								<h4 class="font-medium text-gray-900 mb-2">
									Détails techniques
								</h4>
								<div class="space-y-1 text-sm text-gray-600">
									<div>
										Dimensions:
										{{ selectedTemplate.layout.width }}×{{
											selectedTemplate.layout.height
										}}
									</div>
									<div>
										Variables:
										{{
											getVariablesCount(selectedTemplate)
										}}
									</div>
									<div>
										Catégorie:
										{{
											selectedTemplate.category ||
											"Sans catégorie"
										}}
									</div>
								</div>
							</div>
						</div>

						<!-- Variables -->
						<div v-if="getVariablesCount(selectedTemplate) > 0">
							<h4 class="font-medium text-gray-900 mb-2">
								Variables disponibles
							</h4>
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
								<div
									v-for="(
										variable, key
									) in selectedTemplate.variables"
									:key="key"
									class="bg-gray-50 p-2 rounded text-sm"
								>
									<span class="font-medium text-gray-700"
										>{{ key }}:</span
									>
									<span class="text-gray-600 ml-1">{{
										variable.value
									}}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="flex justify-end p-4 border-t bg-gray-50">
					<button
						@click="useTemplate(selectedTemplate)"
						class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium"
					>
						<i class="ph-duotone ph-palette mr-2"></i>
						Utiliser ce template
					</button>
				</div>
			</div>
		</div>

		<!-- Modal de création de template personnalisé -->
		<div
			v-if="showCreateModal"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
			@click="closeCreateModal"
		>
			<div
				class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden"
				@click.stop
			>
				<div class="flex justify-between items-center p-6 border-b">
					<h3 class="text-xl font-semibold text-gray-900">
						Créer un template personnalisé
					</h3>
					<button
						@click="closeCreateModal"
						class="text-gray-400 hover:text-gray-600"
					>
						<i class="ph-duotone ph-x text-xl"></i>
					</button>
				</div>

				<div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
					<div class="space-y-6">
						<!-- Informations du template source -->
						<div class="bg-blue-50 p-4 rounded-lg">
							<h4 class="font-medium text-blue-900 mb-2">
								Template source
							</h4>
							<div class="text-sm text-blue-700">
								<p>
									<strong>Nom:</strong>
									{{ selectedTemplate?.name }}
								</p>
								<p>
									<strong>Catégorie:</strong>
									{{
										selectedTemplate?.category ||
										"Sans catégorie"
									}}
								</p>
								<p>
									<strong>Dimensions:</strong>
									{{ selectedTemplate?.layout.width }}×{{
										selectedTemplate?.layout.height
									}}
								</p>
							</div>
						</div>

						<!-- Formulaire de création -->
						<div class="space-y-4">
							<div>
								<label
									class="block text-sm font-medium text-gray-700 mb-1"
								>
									Nom du template *
								</label>
								<input
									v-model="newTemplate.name"
									type="text"
									class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									placeholder="Mon template personnalisé"
									required
								/>
							</div>

							<div>
								<label
									class="block text-sm font-medium text-gray-700 mb-1"
								>
									Description
								</label>
								<textarea
									v-model="newTemplate.description"
									rows="3"
									class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									placeholder="Description de votre template..."
								></textarea>
							</div>

							<div class="grid grid-cols-2 gap-4">
								<div>
									<label
										class="block text-sm font-medium text-gray-700 mb-1"
									>
										Largeur (px) *
									</label>
									<input
										v-model.number="
											newTemplate.layout.width
										"
										type="number"
										min="100"
										max="4000"
										class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										required
									/>
								</div>

								<div>
									<label
										class="block text-sm font-medium text-gray-700 mb-1"
									>
										Hauteur (px) *
									</label>
									<input
										v-model.number="
											newTemplate.layout.height
										"
										type="number"
										min="100"
										max="4000"
										class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										required
									/>
								</div>
							</div>

							<div>
								<label
									class="block text-sm font-medium text-gray-700 mb-1"
								>
									Catégorie
								</label>
								<select
									v-model="newTemplate.category"
									class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								>
									<option value="">Aucune catégorie</option>
									<option
										v-for="category in TEMPLATE_CATEGORIES"
										:key="category"
										:value="category"
									>
										{{ category }}
									</option>
								</select>
							</div>
						</div>
					</div>
				</div>

				<div class="flex justify-end gap-3 p-6 border-t bg-gray-50">
					<button
						@click="closeCreateModal"
						class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md font-medium transition-colors"
					>
						Annuler
					</button>
					<button
						@click="createCustomTemplate"
						:disabled="
							creating ||
							!newTemplate.name ||
							!newTemplate.layout.width ||
							!newTemplate.layout.height
						"
						class="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md font-medium transition-colors flex items-center"
					>
						<i
							v-if="creating"
							class="ph-duotone ph-spinner animate-spin mr-2"
						></i>
						<i v-else class="ph-duotone ph-plus mr-2"></i>
						{{ creating ? "Création..." : "Créer le template" }}
					</button>
				</div>
			</div>
		</div>

		<!-- Notification de succès -->
		<div
			v-if="showSuccessNotification"
			class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center"
		>
			<i class="ph-duotone ph-check-circle mr-2"></i>
			{{ successMessage }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import type { Template } from "~/types/template";
import { TEMPLATE_CATEGORIES } from "~/constants/categories";
import { useTemplateStore } from "~/stores/template";
import { getApiUrl } from "~/utils/api";

// État
const templates = ref<Template[]>([]);
const loading = ref(false);
const selectedCategory = ref("");
const showPreviewModal = ref(false);
const selectedTemplate = ref<Template | null>(null);
const showCreateModal = ref(false);
const creating = ref(false);
const showSuccessNotification = ref(false);
const successMessage = ref("");

// Formulaire de création de template
const newTemplate = ref({
	name: "",
	description: "",
	category: "" as any,
	layout: {
		width: 800,
		height: 600,
		elements: [] as any[],
	},
	tags: [] as string[],
	isActive: true,
	variables: {} as Record<string, any>,
});

// Computed
const isAuthenticated = computed(() => {
	const authStore = useAuthStore();
	return authStore.isAuthenticated;
});

const availableCategories = computed(() => {
	const usedCategories = new Set(
		templates.value.map((t) => t.category).filter(Boolean)
	);
	return TEMPLATE_CATEGORIES.filter((category) =>
		usedCategories.has(category)
	);
});

// Méthodes
const fetchTemplates = async () => {
	loading.value = true;
	try {
		const url = selectedCategory.value
			? `${getApiUrl("/templates/examples")}?category=${selectedCategory.value}`
			: getApiUrl("/templates/examples");
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error("Erreur lors du chargement des templates");
		}
		templates.value = await response.json();
	} catch (error) {
		console.error("Erreur:", error);
		// Gérer l'erreur (afficher un message, etc.)
	} finally {
		loading.value = false;
	}
};

const filterTemplates = () => {
	fetchTemplates();
};

const clearFilters = () => {
	selectedCategory.value = "";
	fetchTemplates();
};

const getCategoryBadgeClass = (category: string | undefined) => {
	if (!category) return "bg-gray-100 text-gray-800";

	const categoryColors: Record<string, string> = {
		Citations: "bg-blue-100 text-blue-800",
		Promotions: "bg-green-100 text-green-800",
		Informations: "bg-purple-100 text-purple-800",
		Témoignages: "bg-yellow-100 text-yellow-800",
		Questions: "bg-red-100 text-red-800",
		Sondages: "bg-indigo-100 text-indigo-800",
		Concours: "bg-pink-100 text-pink-800",
		Histoires: "bg-orange-100 text-orange-800",
		Événements: "bg-teal-100 text-teal-800",
		Collaborations: "bg-cyan-100 text-cyan-800",
		Mèmes: "bg-lime-100 text-lime-800",
		"Articles de blog": "bg-amber-100 text-amber-800",
		Produits: "bg-emerald-100 text-emerald-800",
		"Offres d'emploi": "bg-slate-100 text-slate-800",
		Live: "bg-rose-100 text-rose-800",
		Podcast: "bg-violet-100 text-violet-800",
		"Utilisateur du mois": "bg-fuchsia-100 text-fuchsia-800",
	};

	return categoryColors[category] || "bg-gray-100 text-gray-800";
};

const getVariablesCount = (template: Template) => {
	return template.variables ? Object.keys(template.variables).length : 0;
};

const previewTemplate = (template: Template) => {
	selectedTemplate.value = template;
	showPreviewModal.value = true;
};

const closePreviewModal = () => {
	showPreviewModal.value = false;
	selectedTemplate.value = null;
};

const useTemplate = (template: Template | null) => {
	if (!template) return;

	// Vérifier si l'utilisateur est connecté
	if (!isAuthenticated.value) {
		// Rediriger vers la page de connexion
		navigateTo("/auth/login");
		return;
	}

	// Pré-remplir le formulaire avec les données du template
	newTemplate.value = {
		name: `${template.name} - Copie`,
		description: template.description,
		category: template.category || ("" as any),
		layout: {
			width: template.layout.width,
			height: template.layout.height,
			elements: template.layout.elements || ([] as any[]),
		},
		tags: template.tags || ([] as string[]),
		isActive: true,
		variables: template.variables || ({} as Record<string, any>),
	};

	selectedTemplate.value = template;
	showCreateModal.value = true;
};

const closeCreateModal = () => {
	showCreateModal.value = false;
	selectedTemplate.value = null;
	// Réinitialiser le formulaire
	newTemplate.value = {
		name: "",
		description: "",
		category: "" as any,
		layout: {
			width: 800,
			height: 600,
			elements: [] as any[],
		},
		tags: [] as string[],
		isActive: true,
		variables: {} as Record<string, any>,
	};
};

const createCustomTemplate = async () => {
	if (!selectedTemplate.value || !isAuthenticated.value) return;

	creating.value = true;
	try {
		const templateStore = useTemplateStore();

		// Récupérer le contenu HTML du template source
		const htmlContent = await templateStore.getTemplateContent(
			selectedTemplate.value.id
		);

		// Créer le nouveau template avec le contenu HTML
		const templateData = {
			...newTemplate.value,
			html: htmlContent,
		};

		await templateStore.createTemplate(templateData);

		// Afficher la notification de succès
		successMessage.value = `Template "${newTemplate.value.name}" créé avec succès !`;
		showSuccessNotification.value = true;

		// Fermer la modal
		closeCreateModal();

		// Masquer la notification après 3 secondes
		setTimeout(() => {
			showSuccessNotification.value = false;
		}, 3000);
	} catch (error) {
		console.error("Erreur lors de la création du template:", error);
		// Afficher une notification d'erreur
		successMessage.value =
			error instanceof Error
				? error.message
				: "Erreur lors de la création du template";
		showSuccessNotification.value = true;

		// Masquer la notification après 5 secondes
		setTimeout(() => {
			showSuccessNotification.value = false;
		}, 5000);
	} finally {
		creating.value = false;
	}
};

const handleImageError = (event: Event) => {
	const img = event.target as HTMLImageElement;
	img.style.display = "none";
	const parent = img.parentElement;
	if (parent) {
		parent.innerHTML =
			'<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100"><i class="ph-duotone ph-image text-4xl text-gray-400"></i></div>';
	}
};

// Lifecycle
onMounted(() => {
	fetchTemplates();
});
</script>

<style scoped>
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
