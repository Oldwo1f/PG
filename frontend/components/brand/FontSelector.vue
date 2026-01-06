<template>
	<div class="font-selector">
		<div class="relative">
			<input
				type="text"
				v-model="searchQuery"
				:placeholder="placeholder"
				class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
				@focus="showDropdown = true"
				@input="handleSearch"
				@blur="handleBlur"
			/>
			<div class="absolute inset-y-0 right-0 flex items-center pr-3">
				<i class="ph-duotone ph-caret-down text-gray-400"></i>
			</div>
		</div>

		<!-- Dropdown avec aperçu -->
		<div
			v-if="showDropdown"
			class="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto"
			@mousedown.prevent
		>
			<!-- Liste des polices -->
			<div>
				<div
					v-for="font in filteredFonts"
					:key="font.family"
					class="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
					@click="selectFont(font)"
					@mousedown.prevent
					:class="{
						'bg-blue-50 border-blue-200':
							modelValue === font.family,
					}"
				>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<div
								class="font-medium text-sm"
								:style="{
									fontFamily: `'${font.family}', sans-serif`,
								}"
							>
								{{ font.family }}
							</div>
							<div class="text-xs text-gray-500 mt-1">
								{{ font.category }} •
								{{ font.variants.length }} variantes
							</div>
						</div>
						<div class="ml-3">
							<div
								class="text-lg font-bold"
								:style="{
									fontFamily: `'${font.family}', sans-serif`,
								}"
							>
								Aa
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Aucun résultat -->
			<div
				v-if="filteredFonts.length === 0"
				class="p-4 text-center text-gray-500"
			>
				Aucune police trouvée
			</div>
		</div>

		<!-- Aperçu de la police sélectionnée -->
		<div v-if="modelValue" class="mt-2 p-2 bg-gray-50 rounded-md">
			<div
				class="text-sm mt-1"
				:style="{ fontFamily: `'${modelValue}', sans-serif` }"
			>
				The quick brown fox jumps over the lazy dog
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { googleFontsService, type GoogleFont } from "~/services/googleFonts";

const props = defineProps<{
	modelValue: string;
	placeholder?: string;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: string): void;
}>();

const searchQuery = ref(props.modelValue);
const showDropdown = ref(false);
const fonts = ref<GoogleFont[]>([]);
const filteredFonts = ref<GoogleFont[]>([]);

// Fonction utilitaire pour charger dynamiquement une police Google Fonts
function loadGoogleFont(family: string) {
	if (!family) return;
	const id = `gf-link-${family.replace(/\s+/g, "-").toLowerCase()}`;
	if (document.getElementById(id)) return; // déjà chargée
	const link = document.createElement("link");
	link.id = id;
	link.rel = "stylesheet";
	link.href = `https://fonts.googleapis.com/css?family=${encodeURIComponent(
		family
	)}:400,500,600,700&display=swap`;
	document.head.appendChild(link);
}

// Charger la police sélectionnée à chaque changement
watch(
	() => props.modelValue,
	(newValue) => {
		searchQuery.value = newValue;
		if (newValue) loadGoogleFont(newValue);
	}
);

// Charger les polices visibles dans la liste lors de la recherche
watch(filteredFonts, (fonts) => {
	// Charger les 10 premières polices visibles (optimisation)
	fonts.slice(0, 10).forEach((font) => loadGoogleFont(font.family));
});

// Charger les polices au montage
onMounted(async () => {
	await loadFonts();
	nextTick(() => {
		if (props.modelValue) loadGoogleFont(props.modelValue);
	});
});

const loadFonts = async () => {
	try {
		fonts.value = await googleFontsService.fetchFonts();
		filteredFonts.value = fonts.value; // Afficher toutes les polices
	} catch (error) {
		console.error("Erreur lors du chargement des polices:", error);
	}
};

const handleSearch = () => {
	// Recherche locale dans les polices déjà chargées
	if (!searchQuery.value) {
		filteredFonts.value = fonts.value; // Afficher toutes les polices
		return;
	}

	const query = searchQuery.value.toLowerCase();
	filteredFonts.value = fonts.value.filter(
		(font) =>
			font.family.toLowerCase().includes(query) ||
			font.category.toLowerCase().includes(query)
	);
};

const selectFont = (font: GoogleFont) => {
	searchQuery.value = font.family;
	emit("update:modelValue", font.family);
	showDropdown.value = false;
};

const handleBlur = () => {
	// Délai pour permettre le clic sur une option
	setTimeout(() => {
		showDropdown.value = false;
	}, 200);
};
</script>

<style scoped>
.font-selector {
	position: relative;
}
</style>
