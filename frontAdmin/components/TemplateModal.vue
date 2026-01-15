<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
		@click="handleBackdrop"
	>
		<div
			class="relative top-10 mx-auto p-6 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white"
			@click.stop
		>
			<!-- Header -->
			<div class="flex items-center justify-between mb-4">
				<div>
					<h3 class="text-lg font-medium text-gray-900">
						Modifier le template
					</h3>
					<p class="text-sm text-gray-500" v-if="template?.id">
						ID: {{ template.id }}
					</p>
				</div>
				<button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
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

			<!-- Form -->
			<form @submit.prevent="handleSubmit" class="space-y-6">
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div class="space-y-4">
						<!-- Name -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Nom *
							</label>
							<input v-model="form.name" type="text" required class="admin-input" />
						</div>

						<!-- Description -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Description
							</label>
							<textarea
								v-model="form.description"
								rows="3"
								class="admin-input"
								placeholder="Description du template..."
							/>
						</div>

						<!-- Category -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Catégorie
							</label>
							<input
								v-model="form.category"
								type="text"
								class="admin-input"
								placeholder="ex: social, promo, ..."
							/>
						</div>

						<!-- Dimensions -->
						<div class="grid grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">
									Largeur (px) *
								</label>
								<input
									v-model.number="form.width"
									type="number"
									min="1"
									required
									class="admin-input"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">
									Hauteur (px) *
								</label>
								<input
									v-model.number="form.height"
									type="number"
									min="1"
									required
									class="admin-input"
								/>
							</div>
						</div>

						<!-- Tags -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Tags (séparés par des virgules)
							</label>
							<input
								v-model="form.tags"
								type="text"
								class="admin-input"
								placeholder="ex: promo, été, instagram"
							/>
						</div>

						<!-- Active -->
						<div class="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
							<div>
								<p class="text-sm font-medium text-gray-700">Actif</p>
								<p class="text-xs text-gray-500">
									Un template inactif ne devrait pas apparaître dans la galerie.
								</p>
							</div>
							<label class="inline-flex items-center cursor-pointer">
								<input v-model="form.isActive" type="checkbox" class="sr-only peer" />
								<div
									class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary-600 relative transition-colors"
								>
									<div
										class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"
									/>
								</div>
							</label>
						</div>

						<!-- Preview image filename -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Preview image (filename)
							</label>
							<input v-model="form.previewImage" type="text" class="admin-input" />
							<p class="text-xs text-gray-500 mt-1">
								Doit correspondre à un fichier servi par `/templates/preview/:filename`.
							</p>
						</div>
					</div>

					<div class="space-y-4">
						<!-- Variables -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Variables (JSON)
							</label>
							<textarea
								v-model="form.variablesJson"
								rows="8"
								class="admin-input font-mono text-xs"
								placeholder='{"title":{"value":"...","type":"text"}}'
							/>
						</div>

						<!-- HTML -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								HTML (optionnel)
							</label>
							<textarea
								v-model="form.html"
								rows="10"
								class="admin-input font-mono text-xs"
								placeholder="<!doctype html>..."
							/>
						</div>
					</div>
				</div>

				<!-- Error -->
				<div v-if="error" class="text-red-600 text-sm">
					{{ error }}
				</div>

				<!-- Actions -->
				<div class="flex justify-end space-x-3 pt-2">
					<button
						type="button"
						@click="$emit('close')"
						class="admin-button-secondary"
						:disabled="loading"
					>
						Annuler
					</button>
					<button type="submit" class="admin-button-primary" :disabled="loading">
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
							Enregistrement...
						</span>
						<span v-else>Enregistrer</span>
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { Template, UpdateTemplateInput } from "~/types/template";

interface Props {
	isOpen: boolean;
	template: Template | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	close: [];
	save: [data: UpdateTemplateInput];
}>();

const loading = ref(false);
const error = ref("");

const form = reactive({
	name: "",
	description: "",
	category: "",
	width: 1080,
	height: 1080,
	tags: "",
	isActive: true,
	previewImage: "",
	variablesJson: "",
	html: "",
});

function normalizeTags(input: string): string[] {
	return input
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean);
}

function safeStringify(obj: unknown): string {
	try {
		return JSON.stringify(obj ?? {}, null, 2);
	} catch {
		return "";
	}
}

function handleBackdrop() {
	emit("close");
}

watch(
	() => [props.isOpen, props.template] as const,
	([isOpen, template]) => {
		if (!isOpen) return;
		error.value = "";

		form.name = template?.name || "";
		form.description = template?.description || "";
		form.category = template?.category || "";
		form.width = template?.layout?.width || 1080;
		form.height = template?.layout?.height || 1080;
		form.tags = (template?.tags || []).join(", ");
		form.isActive = template?.isActive ?? true;
		form.previewImage = template?.previewImage || "";
		form.variablesJson = safeStringify(template?.variables || {});
		form.html = template?.html || "";
	},
	{ immediate: true }
);

const handleSubmit = async () => {
	error.value = "";
	loading.value = true;

	try {
		if (!form.name.trim()) {
			error.value = "Le nom du template est requis";
			return;
		}
		if (!form.width || form.width <= 0 || !form.height || form.height <= 0) {
			error.value = "Les dimensions doivent être > 0";
			return;
		}

		let variables: any = undefined;
		const trimmedVars = form.variablesJson.trim();
		if (trimmedVars) {
			try {
				variables = JSON.parse(trimmedVars);
			} catch {
				error.value = "Le JSON des variables est invalide";
				return;
			}
		}

		const layoutElements = props.template?.layout?.elements || [];

		const payload: UpdateTemplateInput = {
			name: form.name.trim(),
			description: form.description?.trim() || undefined,
			category: form.category?.trim() || undefined,
			layout: {
				width: Number(form.width),
				height: Number(form.height),
				elements: layoutElements,
			},
			tags: normalizeTags(form.tags),
			isActive: !!form.isActive,
			previewImage: form.previewImage?.trim() || undefined,
			variables,
			html: form.html || undefined,
		};

		emit("save", payload);
	} finally {
		loading.value = false;
	}
};
</script>

