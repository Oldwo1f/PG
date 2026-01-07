<template>
	<div class="container mx-auto py-10">
		<div class="flex items-center justify-between mb-8">
			<h1 class="text-2xl font-bold">Bibliothèque d'images</h1>
			<label
				class="inline-block cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
			>
				<input
					type="file"
					class="hidden"
					@change="onFileChange"
					accept="image/*"
					multiple
				/>
				Ajouter une image
			</label>
		</div>

		<!-- Dropzone -->
		<div class="mb-8">
			<div
				class="relative border-2 border-dashed rounded-lg p-6 text-center transition"
				:class="
					isDragging
						? 'border-blue-500 bg-blue-50'
						: 'border-gray-300 bg-white'
				"
				@dragover.prevent="onDragOver"
				@dragleave.prevent="onDragLeave"
				@drop.prevent="onDrop"
			>
				<p class="mb-3 text-gray-600">
					Glissez-déposez des images ici, ou
				</p>
				<label
					class="inline-block cursor-pointer bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-sm"
				>
					<input
						type="file"
						class="hidden"
						@change="onFileChange"
						accept="image/*"
						multiple
					/>
					Cliquer pour sélectionner
				</label>
			</div>
		</div>

		<!-- Message d'erreur -->
		<div
			v-if="error"
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
				<span class="text-red-800">{{ error }}</span>
			</div>
		</div>

		<div v-if="loading" class="text-center py-10 text-gray-500">
			Chargement...
		</div>
		<div
			v-else-if="images.length === 0"
			class="text-center py-20 text-gray-400"
		>
			Aucune image pour le moment.<br />Ajoutez-en avec le bouton
			ci-dessus.
		</div>
		<div
			v-else
			class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
		>
			<div
				v-for="img in images"
				:key="img.id"
				class="relative rounded-lg overflow-hidden border bg-white shadow hover:shadow-lg transition"
			>
				<button
					class="absolute top-2 right-2 bg-white/80 hover:bg-red-100 text-red-600 rounded-full p-1 z-10"
					@click="deleteImage(img.id)"
					title="Supprimer"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
				<img
					:src="API_BASE_URL + img.url"
					:alt="img.originalName"
					class="w-full h-40 object-cover"
				/>
				<div class="p-2 text-xs text-gray-500 truncate">
					{{ img.originalName }}
				</div>
				<div class="p-2 border-t bg-gray-50">
					<div class="flex items-center justify-between gap-2">
						<a
							class="text-xs text-blue-600 hover:underline truncate"
							:href="getImageUrl(img)"
							target="_blank"
							rel="noopener noreferrer"
							:title="getImageUrl(img)"
						>
							{{ getImageUrl(img) }}
						</a>
						<button
							@click="copyUrl(getImageUrl(img), img.id)"
							class="inline-flex items-center text-[11px] px-2 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
							:title="
								copied === img.id ? 'Copié!' : 'Copier l\'URL'
							"
						>
							<svg
								v-if="copied === img.id"
								xmlns="http://www.w3.org/2000/svg"
								class="h-3.5 w-3.5 mr-1 text-green-600"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
							<svg
								v-else
								xmlns="http://www.w3.org/2000/svg"
								class="h-3.5 w-3.5 mr-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 16h8M8 12h8m-6 8h6a2 2 0 002-2V8a2 2 0 00-2-2h-6l-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h2"
								/>
							</svg>
							{{ copied === img.id ? "Copié" : "Copier" }}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/composables/useAuth";
import { useApi } from "~/composables/useApi";

interface Image {
	id: number;
	filename: string;
	originalName: string;
	url: string;
	createdAt: string;
}

const images = ref<Image[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const isDragging = ref(false);

import { getApiBaseUrl } from "~/utils/api";
const authStore = useAuthStore();
const { apiFetch } = useApi();
const API_BASE_URL = getApiBaseUrl().replace("/api", "");

const fetchImages = async () => {
	try {
		const headers = authStore.getAuthHeaders;
		const data = await apiFetch<Image[]>("/images", { headers });
		images.value = data as Image[];
	} catch (err: any) {
		error.value =
			err.data?.message ||
			"Une erreur est survenue lors de la récupération des images.";
	} finally {
		loading.value = false;
	}
};

async function uploadSingleFile(file: File) {
	const formData = new FormData();
	formData.append("file", file);

	const headers = authStore.getAuthHeaders;
	await apiFetch("/images/upload", {
		method: "POST",
		body: formData,
		headers,
	});
}

async function uploadFiles(files: FileList | File[]) {
	const validFiles: File[] = Array.from(files).filter(
		(f) => f && f.type?.startsWith("image/")
	);
	if (validFiles.length === 0) return;

	error.value = null;
	loading.value = true;
	try {
		for (const file of validFiles) {
			try {
				await uploadSingleFile(file);
			} catch (err: any) {
				// Set a user-friendly error but continue uploading remaining files
				if (err?.status === 403) {
					error.value =
						"Limite de stockage atteinte. Passez à un plan supérieur pour plus d'espace.";
					break; // stop on quota exceeded
				} else if (err?.status === 413) {
					error.value =
						"Fichier trop volumineux: " + (file.name || "");
				} else if (err?.status === 400) {
					error.value =
						"Format de fichier non supporté: " + (file.name || "");
				} else {
					error.value =
						"Erreur lors de l'upload de certaines images.";
				}
			}
		}
		await fetchImages();
	} finally {
		loading.value = false;
	}
}

async function onFileChange(e: Event) {
	const files = (e.target as HTMLInputElement).files;
	if (!files || files.length === 0) return;
	await uploadFiles(files);
	// Reset le champ file
	(e.target as HTMLInputElement).value = "";
}

function onDragOver() {
	isDragging.value = true;
}

function onDragLeave() {
	isDragging.value = false;
}

async function onDrop(e: DragEvent) {
	isDragging.value = false;
	if (!e.dataTransfer) return;
	const files = e.dataTransfer.files;
	if (!files || files.length === 0) return;
	await uploadFiles(files);
}

async function deleteImage(id: number) {
	loading.value = true;
	error.value = null;
	try {
		const headers = authStore.getAuthHeaders;
		await apiFetch(`/images/${id}`, {
			method: "DELETE",
			headers,
		});
		await fetchImages();
	} catch (err) {
		error.value = "Erreur lors de la suppression de l'image";
		console.error("Erreur deleteImage:", err);
	} finally {
		loading.value = false;
	}
}

onMounted(fetchImages);

function getImageUrl(img: Image): string {
	return `${API_BASE_URL}${img.url}`;
}

const copied = ref<number | null>(null);
async function copyUrl(url: string, id: number) {
	try {
		await navigator.clipboard.writeText(url);
		copied.value = id;
		setTimeout(() => {
			if (copied.value === id) copied.value = null;
		}, 1500);
	} catch (e) {
		console.error("Clipboard error", e);
	}
}
</script>
