<template>
	<div
		v-if="modelValue"
		class="fixed inset-0 z-50 flex items-center justify-center"
	>
		<div class="fixed inset-0 bg-black/50" @click="onCancel"></div>
		<div class="icon-modal relative z-10">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-bold">Sélectionner des icônes</h2>
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
					placeholder="Rechercher une icône..."
					class="w-full rounded-lg border border-gray-300 p-2"
				/>
			</div>
			<div class="icon-grid">
				<div
					v-for="icon in filteredIcons"
					:key="icon.name"
					class="icon-card"
					:class="{ 'border-primary': isSelected(icon) }"
					@click="toggleSelect(icon)"
				>
					<i :class="icon.class" />
				</div>
			</div>
			<div class="mt-4 flex justify-end gap-2">
				<button
					class="rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200"
					@click="onCancel"
				>
					Annuler
				</button>
				<button
					class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-600/90"
					@click="validate"
				>
					Valider
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Icon } from "~/types/brand";
import icons from "~/assets/phosphor-icons.json";

const props = defineProps<{
	modelValue: boolean;
	selectedIcons: Icon[];
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: boolean): void;
	(e: "update:selectedIcons", value: Icon[]): void;
}>();

const search = ref("");
const selected = ref<Icon[]>(props.selectedIcons || []);

const filteredIcons = computed(() => {
	if (!search.value) return icons;
	return icons.filter((icon) =>
		icon.name.toLowerCase().includes(search.value.toLowerCase())
	);
});

const isSelected = (icon: Icon) => {
	return selected.value.some((i) => i.name === icon.name);
};

const toggleSelect = (icon: Icon) => {
	const index = selected.value.findIndex((i) => i.name === icon.name);
	if (index === -1) {
		selected.value.push(icon);
	} else {
		selected.value.splice(index, 1);
	}
};

const validate = () => {
	emit("update:selectedIcons", selected.value);
	emit("update:modelValue", false);
};

const onCancel = () => {
	selected.value = props.selectedIcons || [];
	emit("update:modelValue", false);
};

watch(
	() => props.modelValue,
	(newVal) => {
		if (newVal) {
			selected.value = [...(props.selectedIcons || [])];
		}
	}
);
</script>

<style scoped>
.icon-modal {
	width: 900px;
	height: 600px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	background: white;
	border-radius: 16px;
	padding: 32px;
}
.icon-grid {
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	gap: 24px;
	min-height: 160px;
	max-height: 100%;
	overflow-y: auto;
	margin-top: 16px;
	margin-bottom: 16px;
}
.icon-card {
	width: 100px;
	height: 100px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 12px;
	border: 1px solid #e5e7eb;
	background: #f9fafb;
	cursor: pointer;
	transition: border 0.2s, background 0.2s;
}
.icon-card:hover,
.icon-card.border-primary {
	border: 2px solid #2563eb;
	background: #e0e7ff;
}
.icon-card i {
	font-size: 60px;
}
</style>
