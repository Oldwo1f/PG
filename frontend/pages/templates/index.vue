<template>
	<div class="container mx-auto px-4 py-8">
		<div class="flex justify-between items-center mb-6">
			<h1 class="text-2xl font-bold">Gestion des Templates</h1>
			<div class="flex items-center gap-3">
				<NuxtLink
					to="/templates/gallery"
					class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center"
				>
					<i class="ph-duotone ph-images mr-2"></i>
					Galerie
				</NuxtLink>
				<button
					@click="openCreateModal"
					class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
				>
					<span class="mr-2">+</span>
					Nouveau Template
				</button>
			</div>
		</div>

		<!-- Message d'erreur -->
		<div
			v-if="templateStore.error"
			class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
		>
			<div class="flex items-center">
				<svg
					class="w-5 h-5 text-red-400 mr-2"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
						clip-rule="evenodd"
					/>
				</svg>
				<span class="text-red-800">{{ templateStore.error }}</span>
			</div>
		</div>

		<!-- Filtres -->
		<div class="mb-6 flex space-x-4">
			<div class="flex-1">
				<label class="block text-sm font-medium text-gray-700 mb-1"
					>Catégorie</label
				>
				<select
					v-model="selectedCategory"
					class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					@change="filterTemplates"
				>
					<option value="">Toutes les catégories</option>
					<option
						v-for="category in categories"
						:key="category"
						:value="category"
					>
						{{ category }}
					</option>
				</select>
			</div>
		</div>

		<!-- Loading state -->
		<div
			v-if="templateStore.loading"
			class="text-center py-10 text-gray-500"
		>
			Chargement...
		</div>

		<!-- Tableau des templates -->
		<div v-else class="bg-white rounded-lg shadow overflow-hidden">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Nom
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Description
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Catégorie
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Dimensions
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					<tr v-for="template in templates" :key="template.id">
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm font-medium text-gray-900">
								{{ template.name }}
							</div>
						</td>
						<td class="px-6 py-4">
							<div class="text-sm text-gray-500">
								{{ template.description }}
							</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-900">
								{{ template.category }}
							</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-900">
								{{ template.layout.width }}x{{
									template.layout.height
								}}
							</div>
						</td>
						<td
							class="px-6 py-4 whitespace-nowrap text-sm font-medium"
						>
							<button
								@click="editTemplate(template)"
								class="text-indigo-600 hover:text-indigo-900 mr-4"
							>
								Modifier
							</button>
							<button
								@click="deleteTemplate(template.id)"
								class="text-red-600 hover:text-red-900"
							>
								Supprimer
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Modal de création/édition -->
		<div
			v-if="showModal"
			class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
		>
			<div
				class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
			>
				<div class="mt-3">
					<h3
						class="text-lg font-medium leading-6 text-gray-900 mb-4"
					>
						{{
							isEditing
								? "Modifier le template"
								: "Nouveau template"
						}}
					</h3>
					<form @submit.prevent="handleSubmit">
						<div class="mb-4">
							<label
								class="block text-gray-700 text-sm font-bold mb-2"
								for="name"
							>
								Nom
							</label>
							<input
								id="name"
								v-model="form.name"
								type="text"
								class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								required
							/>
						</div>
						<div class="mb-4">
							<label
								class="block text-gray-700 text-sm font-bold mb-2"
								for="description"
							>
								Description
							</label>
							<textarea
								id="description"
								v-model="form.description"
								class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								rows="3"
							></textarea>
						</div>
						<div class="mb-4">
							<label
								class="block text-gray-700 text-sm font-bold mb-2"
								for="category"
							>
								Catégorie
							</label>
							<select
								id="category"
								v-model="form.category"
								class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
						<div class="grid grid-cols-2 gap-4 mb-4">
							<div>
								<label
									class="block text-gray-700 text-sm font-bold mb-2"
									for="width"
								>
									Largeur
								</label>
								<input
									id="width"
									v-model.number="form.layout!.width"
									type="number"
									class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									required
								/>
							</div>
							<div>
								<label
									class="block text-gray-700 text-sm font-bold mb-2"
									for="height"
								>
									Hauteur
								</label>
								<input
									id="height"
									v-model.number="form.layout!.height"
									type="number"
									class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									required
								/>
							</div>
						</div>
						<div class="flex justify-end">
							<button
								type="button"
								@click="closeModal"
								class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
							>
								Annuler
							</button>
							<button
								type="submit"
								:disabled="templateStore.loading"
								class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
							>
								{{
									templateStore.loading
										? "En cours..."
										: isEditing
										? "Mettre à jour"
										: "Créer"
								}}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import type { Template } from "~/types/template";
import { TEMPLATE_CATEGORIES } from "~/constants/categories";

const templateStore = useTemplateStore();

const templates = computed(() => templateStore.templates);
const selectedCategory = ref("");
const categories = computed(() => {
	const usedCategories = new Set(templates.value.map((t) => t.category));
	return TEMPLATE_CATEGORIES.filter((category) =>
		usedCategories.has(category)
	);
});

const showModal = ref(false);
const isEditing = ref(false);
const form = ref<Partial<Template>>({
	name: "",
	description: "",
	category: "",
	isActive: true,
	layout: {
		width: 800,
		height: 600,
		elements: [],
	},
	tags: [],
	variables: {},
});

onMounted(async () => {
	await templateStore.fetchTemplates();
});

const filterTemplates = async () => {
	await templateStore.fetchTemplates(selectedCategory.value);
};

const openCreateModal = () => {
	// Reset error when opening modal
	templateStore.error = null;
	isEditing.value = false;
	form.value = {
		name: "",
		description: "",
		category: "",
		isActive: true,
		layout: {
			width: 800,
			height: 600,
			elements: [],
		},
		tags: [],
		variables: {},
	};
	showModal.value = true;
};

const editTemplate = (template: Template) => {
	// Reset error when editing
	templateStore.error = null;
	isEditing.value = true;
	form.value = { ...template };
	showModal.value = true;
};

const closeModal = () => {
	showModal.value = false;
	form.value = {
		name: "",
		description: "",
		category: "",
		isActive: true,
		layout: {
			width: 800,
			height: 600,
			elements: [],
		},
		tags: [],
		variables: {},
	};
};

const handleSubmit = async () => {
	try {
		if (isEditing.value && form.value.id) {
			// Exclure les propriétés qui ne devraient pas être modifiées
			const {
				id,
				userId,
				createdAt,
				updatedAt,
				brandVariables,
				...updateData
			} = form.value;
			await templateStore.updateTemplate(id, updateData);
		} else {
			// Type spécifique pour la création, excluant les propriétés non acceptées par le backend
			const newTemplate = {
				name: form.value.name || "",
				description: form.value.description || "",
				category: (form.value.category as any) || "",
				isActive: form.value.isActive || true,
				layout: form.value.layout || {
					width: 800,
					height: 600,
					elements: [],
				},
				tags: form.value.tags || [],
				variables: form.value.variables || {},
			};
			await templateStore.createTemplate(newTemplate);
		}
	} catch (error) {
		// Error is already handled in the store and displayed
		console.error("Erreur lors de la sauvegarde:", error);
	} finally {
		// Toujours fermer la modal pour que l'utilisateur puisse voir le message d'erreur sur la page parente
		closeModal();
	}
};

const deleteTemplate = async (id: string | undefined) => {
	if (id && confirm("Êtes-vous sûr de vouloir supprimer ce template ?")) {
		try {
			await templateStore.deleteTemplate(id);
		} catch (error) {
			console.error("Erreur lors de la suppression:", error);
		}
	}
};
</script>
