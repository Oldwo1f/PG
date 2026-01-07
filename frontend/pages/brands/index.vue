<template>
	<div class="container mx-auto px-4 py-8">
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-3xl font-bold">Marques</h1>
			<button
				@click="showCreateForm = true"
				class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
				:disabled="brandStore.createLoading || brandStore.updateLoading"
			>
				<i class="ph-duotone ph-plus-circle"></i> Nouvelle marque
			</button>
		</div>

		<!-- Message d'erreur -->
		<div
			v-if="brandStore.error"
			class="text-center py-4 mb-4 bg-red-100 text-red-700 rounded-lg"
		>
			<p>{{ brandStore.error }}</p>
		</div>

		<!-- État de chargement initial -->
		<div
			v-if="brandStore.fetchLoading && brandStore.brands.length === 0"
			class="text-center py-8"
		>
			<p class="text-gray-600">Chargement...</p>
		</div>

		<!-- État vide - Aucune marque -->
		<div
			v-else-if="
				!brandStore.fetchLoading && brandStore.brands.length === 0
			"
			class="text-center py-12"
		>
			<div class="max-w-md mx-auto">
				<div class="mb-6">
					<i
						class="ph-duotone ph-buildings text-6xl text-gray-300"
					></i>
				</div>
				<h3 class="text-xl font-semibold text-gray-900 mb-2">
					Aucune marque créée
				</h3>
				<p class="text-gray-600 mb-6">
					Commencez par créer votre première marque pour personnaliser
					vos images générées.
				</p>
				<button
					@click="showCreateForm = true"
					class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
					:disabled="
						brandStore.createLoading || brandStore.updateLoading
					"
				>
					<i class="ph-duotone ph-plus-circle mr-2"></i>
					Créer ma première marque
				</button>
			</div>
		</div>

		<!-- Liste des marques -->
		<div
			v-else
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
		>
			<div
				v-for="brand in brandStore.brands"
				:key="brand.id"
				class="bg-white rounded-lg shadow-md p-6"
			>
				<div class="flex justify-between items-start mb-4">
					<div>
						<h2 class="text-xl font-semibold">{{ brand.name }}</h2>
						<label
							class="text-sm font-medium text-gray-700 font-bold mb-2.5 block"
							>Typographie</label
						>
						<div class="text-gray-600 space-y-1">
							<p>Titre: {{ brand.titleFont }}</p>
							<p>Texte: {{ brand.textFont }}</p>
							<p>Tertiaire: {{ brand.tertiaryFont }}</p>
						</div>
					</div>
					<div class="flex space-x-2">
						<button
							@click="editBrand(brand)"
							class="text-blue-600 hover:text-blue-800"
							:disabled="
								brandStore.createLoading ||
								brandStore.updateLoading ||
								brandStore.deleteLoading
							"
						>
							<i class="ph-duotone ph-pencil"></i>
						</button>
						<button
							@click="deleteBrand(brand.id || '')"
							class="text-red-600 hover:text-red-800"
							:disabled="
								brandStore.createLoading ||
								brandStore.updateLoading ||
								brandStore.deleteLoading
							"
						>
							<i class="ph-duotone ph-trash"></i>
						</button>
					</div>
				</div>
				<div class="space-y-2">
					<label
						class="text-sm font-medium text-gray-700 font-bold mb-2.5 block"
						>Couleur</label
					>
					<div class="flex items-center space-x-2">
						<div
							class="w-6 h-6 rounded-full"
							:style="{ backgroundColor: brand.primaryColor }"
						></div>
						<span class="text-sm text-gray-600">{{
							brand.primaryColor
						}}</span>
					</div>
					<div class="flex items-center space-x-2">
						<div
							class="w-6 h-6 rounded-full"
							:style="{ backgroundColor: brand.secondaryColor }"
						></div>
						<span class="text-sm text-gray-600">{{
							brand.secondaryColor
						}}</span>
					</div>
					<div class="flex items-center space-x-2">
						<div
							class="w-6 h-6 rounded-full"
							:style="{ backgroundColor: brand.tertiaryColor }"
						></div>
						<span class="text-sm text-gray-600">{{
							brand.tertiaryColor
						}}</span>
					</div>
					<label
						class="text-sm font-medium text-gray-700 font-bold mb-2.5 block"
						>Couleur de texte</label
					>
					<div class="flex items-center space-x-2">
						<div
							class="w-6 h-6 rounded-full"
							:style="{ backgroundColor: brand.textColor }"
						></div>
						<span class="text-sm text-gray-600">{{
							brand.textColor
						}}</span>
					</div>
					<div class="flex items-center space-x-2">
						<div
							class="w-6 h-6 rounded-full"
							:style="{ backgroundColor: brand.textColor2 }"
						></div>
						<span class="text-sm text-gray-600">{{
							brand.textColor2
						}}</span>
					</div>
				</div>
				<div class="mt-4">
					<label
						class="text-sm font-medium text-gray-700 font-bold mb-2.5 block"
						>Logo</label
					>
					<img
						:src="resolveBackendImageUrl(brand.logoUrl)"
						:alt="brand.name"
						class="h-12 object-contain"
					/>
				</div>
				<div class="mt-4 space-y-2">
					<div>
						<label
							class="text-sm font-medium text-gray-700 font-bold mb-2.5 block"
							>Icônes</label
						>
						<p class="text-gray-600">
							{{ brand.icons.length }} icône(s)
						</p>
					</div>
					<div>
						<label
							class="text-sm font-medium text-gray-700 font-bold mb-2.5 block"
							>Images</label
						>
						<p class="text-gray-600">
							{{
								brand.imageGroups
									? brand.imageGroups.reduce(
											(acc: number, group: any) =>
												acc +
												(group.images_url
													? group.images_url.length
													: 0),
											0
									  )
									: 0
							}}
							image(s)
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Modal de création/édition -->
		<div
			v-if="showCreateForm || editingBrand"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
		>
			<div
				class="bg-white rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
			>
				<div class="flex justify-between items-center mb-6">
					<h2 class="text-2xl font-bold">
						{{
							editingBrand
								? "Modifier la marque"
								: "Nouvelle marque"
						}}
					</h2>
					<button
						@click="closeForm"
						class="text-gray-500 hover:text-gray-700"
						:disabled="
							brandStore.createLoading || brandStore.updateLoading
						"
					>
						×
					</button>
				</div>
				<BrandForm
					:brand="editingBrand || undefined"
					:is-editing="!!editingBrand"
					@submit="handleSubmit"
					@cancel="closeForm"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Brand } from "~/types/brand";
import BrandForm from "~/components/brand/BrandForm.vue";
import { useBrandStore } from "~/stores/brand";
import { resolveBackendImageUrl } from "~/utils/api";

const brandStore = useBrandStore();
const showCreateForm = ref(false);
const editingBrand = ref<Brand | null>(null);

onMounted(async () => {
	await brandStore.fetchBrands();
});

const editBrand = (brand: Brand) => {
	editingBrand.value = { ...brand };
};

const deleteBrand = async (id: string) => {
	if (confirm("Êtes-vous sûr de vouloir supprimer cette marque ?")) {
		try {
			await brandStore.deleteBrand(id);
		} catch (error) {
			console.error("Erreur lors de la suppression:", error);
		}
	}
};

const handleSubmit = async (brand: Brand) => {
	try {
		if (editingBrand.value) {
			const { id, ...brandData } = brand;
			await brandStore.updateBrand(editingBrand.value.id!, brandData);
		} else {
			const { id, ...brandData } = brand;
			await brandStore.createBrand(brandData);
		}
	} catch (error) {
		console.error("Erreur lors de la sauvegarde:", error);
	} finally {
		// Toujours fermer la modale, même en cas d'erreur
		closeForm();
	}
};

const closeForm = () => {
	showCreateForm.value = false;
	editingBrand.value = null;
};
</script>
