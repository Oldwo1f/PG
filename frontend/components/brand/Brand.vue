<template>
	<div class="space-y-6">
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700"
					>Nom</label
				>
				<input
					v-model="brand.name"
					type="text"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700"
					>Logo URL</label
				>
				<input
					v-model="brand.logoUrl"
					type="text"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
				/>
			</div>
		</div>

		<div class="grid grid-cols-5 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700"
					>Couleur primaire</label
				>
				<input
					v-model="brand.primaryColor"
					type="color"
					class="mt-1 block h-10 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700"
					>Couleur secondaire</label
				>
				<input
					v-model="brand.secondaryColor"
					type="color"
					class="mt-1 block h-10 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700"
					>Couleur tertiaire</label
				>
				<input
					v-model="brand.tertiaryColor"
					type="color"
					class="mt-1 block h-10 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700"
					>TextColor</label
				>
				<input
					v-model="brand.textColor"
					type="color"
					class="mt-1 block h-10 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700"
					>TextColor2</label
				>
				<input
					v-model="brand.textColor2"
					type="color"
					class="mt-1 block h-10 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
				/>
			</div>
		</div>

		<div class="grid grid-cols-3 gap-4">
			<div>
				<label class="block text-sm font-medium text-gray-700"
					>Police des titres</label
				>
				<input
					v-model="brand.titleFont"
					type="text"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700"
					>Police du texte</label
				>
				<input
					v-model="brand.textFont"
					type="text"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700"
					>Police tertiaire</label
				>
				<input
					v-model="brand.tertiaryFont"
					type="text"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
				/>
			</div>
		</div>

		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700"
					>Images</label
				>
				<div class="mt-2 flex flex-wrap gap-2">
					<div
						v-for="image in brand.backgrounds"
						:key="image.name"
						class="relative group"
					>
						<img
							:src="image.url"
							:alt="image.name"
							class="h-20 w-20 rounded-lg object-cover"
						/>
						<button
							@click="removeImage(image)"
							class="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white opacity-0 group-hover:opacity-100"
						>
							<i class="ph-duotone ph-x h-4 w-4"></i>
						</button>
					</div>
					<button
						@click="showImageSelector = true"
						class="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-primary"
					>
						<i class="ph-duotone ph-plus h-6 w-6 text-gray-400"></i>
					</button>
				</div>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700"
					>Icônes</label
				>
				<div class="mt-2 flex flex-wrap gap-2">
					<div
						v-for="icon in brand.icons"
						:key="icon.name"
						class="relative group"
					>
						<div
							class="flex h-10 w-10 items-center justify-center rounded-lg border bg-gray-50"
						>
							<i :class="`ph-duotone ${icon.class} h-6 w-6`"></i>
						</div>
						<button
							@click="removeIcon(icon)"
							class="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white opacity-0 group-hover:opacity-100"
						>
							<i class="ph-duotone ph-x h-4 w-4"></i>
						</button>
					</div>
					<button
						@click="showIconSelector = true"
						class="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-primary"
					>
						<i class="ph-duotone ph-plus h-6 w-6 text-gray-400"></i>
					</button>
				</div>
			</div>
		</div>

		<BrandIconSelectorModal
			v-model="showIconSelector"
			:selected-icons="brand.icons"
			@update:selected-icons="updateIcons"
		/>

		<BrandImageSelectorModal
			v-model="showImageSelector"
			:selected-images="brand.backgrounds"
			@update:selected-images="updateImages"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Brand, Background, Icon } from "~/types/brand";

const props = defineProps<{
	modelValue: Brand;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: Brand): void;
}>();

const brand = ref<Brand>(props.modelValue);

const showIconSelector = ref(false);
const showImageSelector = ref(false);

const updateBrand = (updates: Partial<Brand>) => {
	brand.value = { ...brand.value, ...updates };
	emit("update:modelValue", brand.value);
};

const updateIcons = (icons: Icon[]) => {
	updateBrand({ icons });
};

const updateImages = (backgrounds: Background[]) => {
	updateBrand({ backgrounds });
};

const removeIcon = (icon: Icon) => {
	const icons = brand.value.icons.filter((i) => i.name !== icon.name);
	updateBrand({ icons });
};

const removeImage = (image: Background) => {
	const backgrounds = brand.value.backgrounds.filter(
		(i) => i.name !== image.name
	);
	updateBrand({ backgrounds });
};
</script>

<style>
/* No changes to style section */
</style>
