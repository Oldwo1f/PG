<template>
	<div
		v-if="modelValue"
		class="fixed inset-0 z-50 flex items-center justify-center"
	>
		<div class="fixed inset-0 bg-black/50" @click="onCancel"></div>
		<div class="relative z-10 w-full max-w-4xl rounded-lg bg-white p-6">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-bold">Sélectionner des images</h2>
				<button
					class="rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
					@click="onCancel"
				>
					<i class="ph-duotone ph-x h-6 w-6"></i>
				</button>
			</div>
			<div class="mb-4">
				<input
					v-model="search"
					type="text"
					placeholder="Rechercher une image..."
					class="w-full rounded-lg border border-gray-300 p-2"
				/>
			</div>
			<div
				class="grid max-h-[60vh] grid-cols-3 gap-4 overflow-y-auto p-4"
			>
				<div
					v-for="image in filteredImages"
					:key="image.name"
					class="flex cursor-pointer flex-col items-center rounded-lg border p-2 hover:bg-gray-100"
					:class="{ 'border-primary': isSelected(image) }"
					@click="toggleSelect(image)"
				>
					<img
						:src="resolveBackendImageUrl(image.url)"
						:alt="image.name"
						class="h-32 w-32 object-cover"
					/>
					<span class="mt-2 text-sm">{{ image.name }}</span>
				</div>
			</div>
			<div class="mt-4 flex justify-end gap-2">
				<button
					class="rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200"
					@click="onCancel"
				>
					Annuler
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Background } from "~/types/brand";
import { resolveBackendImageUrl } from "~/utils/api";

const props = defineProps<{
	modelValue: boolean;
	selectedImages: Background[];
	images: Background[];
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: boolean): void;
	(e: "update:selectedImages", value: Background[]): void;
}>();

const search = ref("");
const selected = ref<Background[]>(props.selectedImages || []);

watch(
	() => props.selectedImages,
	(val) => {
		selected.value = val || [];
	}
);

const filteredImages = computed(() => {
	if (!search.value) return props.images;
	return props.images.filter((image) =>
		image.name.toLowerCase().includes(search.value.toLowerCase())
	);
});

const isSelected = (image: Background) => {
	return selected.value.some((i) => i.name === image.name);
};

const toggleSelect = (image: Background) => {
	// Extraire le nom sans extension
	const nameWithoutExt = image.name.replace(/\.[^/.]+$/, "");
	emit("update:selectedImages", [{ ...image, name: nameWithoutExt }]);
	emit("update:modelValue", false);
};

const onCancel = () => {
	selected.value = props.selectedImages || [];
	emit("update:modelValue", false);
};
</script>

<style>
/* Add your styles here */
</style>
