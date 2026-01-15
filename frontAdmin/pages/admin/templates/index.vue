<template>
	<AuthGuard require-auth require-admin>
		<div class="space-y-6">
			<!-- Header -->
			<div class="admin-card">
				<div class="flex items-start justify-between gap-4">
					<div>
						<h2 class="text-2xl font-bold text-gray-900 mb-2">
							Gestion des templates (galerie)
						</h2>
						<p class="text-gray-600">
							Éditez ou supprimez les templates présents dans la galerie du
							frontend.
						</p>
					</div>
					<button
						@click="refresh"
						class="admin-button-secondary"
						:disabled="templatesStore.loading"
					>
						Actualiser
					</button>
				</div>
			</div>

			<!-- Filters -->
			<div class="admin-card">
				<div class="flex flex-col md:flex-row gap-4">
					<div class="flex-1">
						<label class="block text-sm font-medium text-gray-700 mb-1">
							Rechercher
						</label>
						<input
							v-model="searchQuery"
							type="text"
							class="admin-input"
							placeholder="Nom, catégorie..."
						/>
					</div>
					<div class="w-full md:w-56">
						<label class="block text-sm font-medium text-gray-700 mb-1">
							Catégorie
						</label>
						<select v-model="categoryFilter" class="admin-input">
							<option value="">Toutes</option>
							<option
								v-for="cat in categories"
								:key="cat"
								:value="cat"
							>
								{{ cat }}
							</option>
						</select>
					</div>
					<div class="w-full md:w-56">
						<label class="block text-sm font-medium text-gray-700 mb-1">
							Statut
						</label>
						<select v-model="statusFilter" class="admin-input">
							<option value="">Tous</option>
							<option value="active">Actifs</option>
							<option value="inactive">Inactifs</option>
						</select>
					</div>
				</div>

				<!-- Error -->
				<div
					v-if="templatesStore.error"
					class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700"
				>
					{{ templatesStore.error }}
				</div>
			</div>

			<!-- Loading -->
			<div v-if="templatesStore.loading" class="admin-card">
				<p class="text-gray-600">Chargement des templates...</p>
			</div>

			<!-- Grid -->
			<div v-else class="admin-card">
				<div
					v-if="filteredTemplates.length === 0"
					class="text-center py-12"
				>
					<h3 class="text-sm font-medium text-gray-900">
						Aucun template trouvé
					</h3>
					<p class="mt-1 text-sm text-gray-500">
						{{ emptyStateMessage }}
					</p>
				</div>

				<div
					v-else
					class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
				>
					<div
						v-for="template in filteredTemplates"
						:key="template.id"
						class="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
					>
						<!-- Preview -->
						<div
							class="bg-gray-100 aspect-[4/3] flex items-center justify-center overflow-hidden"
						>
							<img
								v-if="template.previewImage"
								:src="getPreviewUrl(template.previewImage)"
								:alt="template.name"
								class="w-full h-full object-cover"
								loading="lazy"
							/>
							<div v-else class="text-gray-400 text-sm">
								Aucune preview
							</div>
						</div>

						<!-- Info -->
						<div class="p-4 space-y-2">
							<div class="flex items-start justify-between gap-2">
								<h3 class="text-sm font-semibold text-gray-900 break-words">
									{{ template.name }}
								</h3>
								<span
									:class="{
										'px-2 py-0.5 text-xs font-medium rounded-full shrink-0': true,
										'bg-green-100 text-green-800': template.isActive,
										'bg-gray-100 text-gray-700': !template.isActive,
									}"
								>
									{{ template.isActive ? "Actif" : "Inactif" }}
								</span>
							</div>

							<div class="text-xs text-gray-600">
								<span class="font-medium">Dimensions:</span>
								{{ template.layout?.width }}×{{ template.layout?.height }}
							</div>

							<div v-if="template.category" class="text-xs text-gray-600">
								<span class="font-medium">Catégorie:</span>
								{{ template.category }}
							</div>
						</div>

						<!-- Actions -->
						<div class="px-4 pb-4 flex items-center justify-between">
							<button
								@click="openEdit(template)"
								class="text-primary-600 hover:text-primary-900 text-sm font-medium"
							>
								Modifier
							</button>
							<button
								@click="handleDelete(template)"
								class="text-red-600 hover:text-red-900 text-sm font-medium"
								:disabled="templatesStore.loading"
							>
								Supprimer
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<TemplateModal
			:is-open="isEditModalOpen"
			:template="editingTemplate"
			@close="closeEdit"
			@save="saveEdit"
		/>
	</AuthGuard>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useTemplatesStore } from "~/stores/templates";
import type { Template, UpdateTemplateInput } from "~/types/template";
import TemplateModal from "~/components/TemplateModal.vue";

definePageMeta({
	layout: "default",
	auth: true,
	admin: true,
});

const templatesStore = useTemplatesStore();
const config = useRuntimeConfig();

const searchQuery = ref("");
const categoryFilter = ref("");
const statusFilter = ref<"" | "active" | "inactive">("");

const isEditModalOpen = ref(false);
const editingTemplate = ref<Template | null>(null);

const categories = computed(() => {
	const set = new Set(
		templatesStore.templates.map((t) => t.category).filter(Boolean) as string[]
	);
	return Array.from(set).sort((a, b) => a.localeCompare(b));
});

const filteredTemplates = computed(() => {
	let list = templatesStore.templates;

	if (searchQuery.value) {
		const q = searchQuery.value.toLowerCase();
		list = list.filter(
			(t) =>
				t.name?.toLowerCase().includes(q) ||
				(t.category || "").toLowerCase().includes(q)
		);
	}

	if (categoryFilter.value) {
		list = list.filter((t) => t.category === categoryFilter.value);
	}

	if (statusFilter.value === "active") {
		list = list.filter((t) => !!t.isActive);
	} else if (statusFilter.value === "inactive") {
		list = list.filter((t) => !t.isActive);
	}

	return list;
});

const emptyStateMessage = computed(() => {
	if (searchQuery.value || categoryFilter.value || statusFilter.value) {
		return "Aucun template ne correspond à vos critères.";
	}
	return "Aucun template d'exemple n'est disponible.";
});

function normalizeNoTrailingSlash(url: string): string {
	return url.endsWith("/") ? url.slice(0, -1) : url;
}

const apiBase = computed(() =>
	normalizeNoTrailingSlash((config.public.apiBase as string) || "/api")
);

function getPreviewUrl(filename: string): string {
	return `${apiBase.value}/templates/preview/${filename}`;
}

const refresh = async () => {
	await templatesStore.fetchExampleTemplates();
};

const openEdit = (template: Template) => {
	editingTemplate.value = template;
	isEditModalOpen.value = true;
};

const closeEdit = () => {
	isEditModalOpen.value = false;
	editingTemplate.value = null;
};

const saveEdit = async (data: UpdateTemplateInput) => {
	if (!editingTemplate.value) return;
	try {
		await templatesStore.updateTemplate(editingTemplate.value.id, data);
		closeEdit();
	} catch (e) {
		// store error already set
		console.error("Erreur update template:", e);
	}
};

const handleDelete = async (template: Template) => {
	if (
		confirm(`Êtes-vous sûr de vouloir supprimer le template "${template.name}" ?`)
	) {
		try {
			await templatesStore.deleteTemplate(template.id);
		} catch (e) {
			console.error("Erreur suppression template:", e);
		}
	}
};

onMounted(async () => {
	await templatesStore.fetchExampleTemplates();
});
</script>

