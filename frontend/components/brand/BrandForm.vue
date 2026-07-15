<template>
	<div>
		<form @submit.prevent="handleSubmit" class="space-y-6">
			<div class="grid grid-cols-3 gap-6">
				<div class="col-span-1 space-y-4">
					<div>
						<label
							for="name"
							class="block text-sm font-medium text-gray-700"
							>Nom de la marque</label
						>
						<input
							type="text"
							id="name"
							v-model="formData.name"
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label
							for="primaryColor"
							class="block text-sm font-medium text-gray-700"
							>Couleur principale</label
						>
						<div class="mt-1 flex items-center space-x-2">
							<input
								type="color"
								id="primaryColor"
								v-model="formData.primaryColor"
								class="h-8 w-8 rounded-md border border-gray-300"
							/>
							<input
								type="text"
								v-model="formData.primaryColor"
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>

					<div>
						<label
							for="secondaryColor"
							class="block text-sm font-medium text-gray-700"
							>Couleur secondaire</label
						>
						<div class="mt-1 flex items-center space-x-2">
							<input
								type="color"
								id="secondaryColor"
								v-model="formData.secondaryColor"
								class="h-8 w-8 rounded-md border border-gray-300"
							/>
							<input
								type="text"
								v-model="formData.secondaryColor"
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>

					<div>
						<label
							for="tertiaryColor"
							class="block text-sm font-medium text-gray-700"
							>Couleur tertiaire</label
						>
						<div class="mt-1 flex items-center space-x-2">
							<input
								type="color"
								id="tertiaryColor"
								v-model="formData.tertiaryColor"
								class="h-8 w-8 rounded-md border border-gray-300"
							/>
							<input
								type="text"
								v-model="formData.tertiaryColor"
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>

					<div>
						<label
							for="accentColor"
							class="block text-sm font-medium text-gray-700"
							>Couleur d'accent</label
						>
						<div class="mt-1 flex items-center space-x-2">
							<input
								type="color"
								id="accentColor"
								v-model="formData.accentColor"
								class="h-8 w-8 rounded-md border border-gray-300"
							/>
							<input
								type="text"
								v-model="formData.accentColor"
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>

					<!-- TextColor -->
					<div>
						<label
							for="textColor"
							class="block text-sm font-medium text-gray-700"
							>Couleur du texte principale</label
						>
						<div class="mt-1 flex items-center space-x-2">
							<input
								type="color"
								id="textColor"
								v-model="formData.textColor"
								class="h-8 w-8 rounded-md border border-gray-300"
							/>
							<input
								type="text"
								v-model="formData.textColor"
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>

					<!-- TextColor2 -->
					<div>
						<label
							for="textColor2"
							class="block text-sm font-medium text-gray-700"
							>Couleur du texte secondaire</label
						>
						<div class="mt-1 flex items-center space-x-2">
							<input
								type="color"
								id="textColor2"
								v-model="formData.textColor2"
								class="h-8 w-8 rounded-md border border-gray-300"
							/>
							<input
								type="text"
								v-model="formData.textColor2"
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>

					<!-- TextColorDark -->
					<div>
						<label
							for="textColorDark"
							class="block text-sm font-medium text-gray-700"
							>Couleur du texte (sombre)</label
						>
						<div class="mt-1 flex items-center space-x-2">
							<input
								type="color"
								id="textColorDark"
								v-model="formData.textColorDark"
								class="h-8 w-8 rounded-md border border-gray-300"
							/>
							<input
								type="text"
								v-model="formData.textColorDark"
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>

					<!-- TextColor2Dark -->
					<div>
						<label
							for="textColor2Dark"
							class="block text-sm font-medium text-gray-700"
							>Couleur du texte secondaire (sombre)</label
						>
						<div class="mt-1 flex items-center space-x-2">
							<input
								type="color"
								id="textColor2Dark"
								v-model="formData.textColor2Dark"
								class="h-8 w-8 rounded-md border border-gray-300"
							/>
							<input
								type="text"
								v-model="formData.textColor2Dark"
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>

					<div>
						<label
							for="titleFont"
							class="block text-sm font-medium text-gray-700"
							>Police des titres</label
						>
						<FontSelector
							v-model="formData.titleFont"
							placeholder="Sélectionner une police pour les titres"
						/>
					</div>

					<div>
						<label
							for="textFont"
							class="block text-sm font-medium text-gray-700"
							>Police du texte</label
						>
						<FontSelector
							v-model="formData.textFont"
							placeholder="Sélectionner une police pour le texte"
						/>
					</div>

					<div>
						<label
							for="tertiaryFont"
							class="block text-sm font-medium text-gray-700"
							>Police tertiaire</label
						>
						<FontSelector
							v-model="formData.tertiaryFont"
							placeholder="Sélectionner une police tertiaire"
						/>
					</div>

					<div>
						<label
							for="logoUrl"
							class="block text-sm font-medium text-gray-700"
							>URL du logo</label
						>
						<div class="flex items-center gap-2 mt-1">
							<button
								type="button"
								class="flex items-center gap-1 bg-blue-100 text-blue-700 rounded px-2 py-1"
								@click="openLogoLibrarySelector('logoUrl')"
							>
								<i class="ph-duotone ph-folder"></i>
							</button>
							<input
								type="url"
								id="logoUrl"
								v-model="formData.logoUrl"
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>

					<div>
						<label
							for="logoIconUrl"
							class="block text-sm font-medium text-gray-700"
							>URL du logo (icon)</label
						>
						<div class="flex items-center gap-2 mt-1">
							<button
								type="button"
								class="flex items-center gap-1 bg-blue-100 text-blue-700 rounded px-2 py-1"
								@click="openLogoLibrarySelector('logoIconUrl')"
							>
								<i class="ph-duotone ph-folder"></i>
							</button>
							<input
								type="url"
								id="logoIconUrl"
								v-model="formData.logoIconUrl"
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>

					<div>
						<label
							for="logoLineUrl"
							class="block text-sm font-medium text-gray-700"
							>URL du logo (line)</label
						>
						<div class="flex items-center gap-2 mt-1">
							<button
								type="button"
								class="flex items-center gap-1 bg-blue-100 text-blue-700 rounded px-2 py-1"
								@click="openLogoLibrarySelector('logoLineUrl')"
							>
								<i class="ph-duotone ph-folder"></i>
							</button>
							<input
								type="url"
								id="logoLineUrl"
								v-model="formData.logoLineUrl"
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>
				</div>

				<div class="col-span-2 space-y-4">
					<div>
						<label
							class="block text-sm font-medium text-gray-700 mb-2"
							>Icônes</label
						>
						<button
							type="button"
							class="mb-2 px-4 py-2 bg-blue-500 text-white rounded"
							@click="showIconSelector = true"
						>
							Sélectionner des icônes
						</button>
						<div class="mt-2 flex flex-wrap gap-2">
							<div
								v-for="icon in formData.icons"
								:key="icon.name"
								class="relative group"
							>
								<div
									class="flex h-10 w-10 items-center justify-center rounded-lg border bg-gray-50"
								>
									<i :class="icon.class"></i>
								</div>
								<button
									type="button"
									@click="removeIcon(icon)"
									class="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white opacity-0 group-hover:opacity-100"
								>
									<i class="ph-duotone ph-x h-4 w-4"></i>
								</button>
							</div>
						</div>
					</div>

					<div>
						<label
							class="block text-sm font-medium text-gray-700 mb-2"
							>Groupes d'images</label
						>
						<div
							v-for="(group, groupIdx) in formData.imageGroups"
							:key="groupIdx"
							class="mb-6 border rounded-lg p-4 bg-gray-50"
						>
							<div class="flex items-center mb-2 gap-2">
								<input
									v-model="
										formData.imageGroups[groupIdx].groupName
									"
									:readonly="group.locked"
									:disabled="group.locked"
									placeholder="Nom du groupe (ex: backgrounds)"
									class="border rounded px-2 py-1 flex-1"
									@blur="onGroupNameBlur(groupIdx)"
								/>
								<button
									v-if="!group.locked"
									type="button"
									class="text-red-600 hover:underline"
									@click="removeImageGroup(groupIdx)"
								>
									<i class="ph-duotone ph-trash text-lg"></i>
								</button>
							</div>
							<p
								v-if="groupNameErrorIdx === groupIdx"
								class="text-sm text-red-600 mb-2"
							>
								Les noms « background » et « foreground » sont
								réservés.
							</p>
							<div
								v-for="(img, imgIdx) in group.images_url"
								:key="imgIdx"
								class="flex items-center gap-2 mb-2"
							>
								<button
									type="button"
									class="flex items-center gap-1 bg-blue-100 text-blue-700 rounded px-2 py-1"
									@click="openImageLibrary(groupIdx, imgIdx)"
								>
									<i class="ph-duotone ph-folder"></i>
								</button>
								<input
									v-model="
										formData.imageGroups[groupIdx]
											.images_url[imgIdx].name
									"
									placeholder="Nom de l'image"
									class="border rounded px-2 py-1 w-1/3"
								/>
								<input
									v-model="
										formData.imageGroups[groupIdx]
											.images_url[imgIdx].url
									"
									placeholder="URL de l'image"
									class="border rounded px-2 py-1 flex-1"
								/>

								<button
									type="button"
									class="text-red-600 hover:text-red-800 p-1"
									@click="
										removeImageFromGroup(groupIdx, imgIdx)
									"
								>
									<i class="ph-duotone ph-trash text-lg"></i>
								</button>
							</div>
							<button
								type="button"
								class="mt-2 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
								@click="addImageToGroup(groupIdx)"
							>
								Ajouter une image
							</button>
						</div>
						<button
							type="button"
							class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
							@click="addImageGroup"
						>
							Ajouter un groupe
						</button>
					</div>
				</div>
			</div>

			<div class="flex justify-end space-x-4">
				<button
					type="button"
					@click="$emit('cancel')"
					class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
				>
					Annuler
				</button>
				<button
					type="submit"
					class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
				>
					{{ isEditing ? "Mettre à jour" : "Créer" }}
				</button>
			</div>
		</form>

		<!-- Modales -->
		<BrandIconSelectorModal
			v-model="showIconSelector"
			:selected-icons="formData.icons"
			@update:selected-icons="updateIcons"
		/>

		<BrandImageSelectorModal
			v-if="showGroupImageSelector"
			v-model="showGroupImageSelector"
			:selected-images="[]"
			@update:selected-images="onGroupImageSelected"
			@update:modelValue="onGroupImageSelectorCancel"
			:images="groupImageSelectorImages"
		/>

		<BrandImageSelectorModal
			v-if="showLogoLibrarySelector"
			v-model="showLogoLibrarySelector"
			:selected-images="[]"
			@update:selected-images="onLogoImageSelected"
			@update:modelValue="onLogoLibrarySelectorCancel"
			:images="logoLibraryImages"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Brand, Icon, ImageGroup } from "~/types/brand";
import FontSelector from "./FontSelector.vue";
import { useApi } from "~/composables/useApi";
import { useAuthStore } from "~/composables/useAuth";
import { resolveBackendImageUrl } from "~/utils/api";

type FormImageGroup = ImageGroup & { locked?: boolean };

const props = defineProps<{
	brand?: Brand;
	isEditing?: boolean;
}>();

const emit = defineEmits<{
	(e: "submit", brand: Brand): void;
	(e: "cancel"): void;
}>();

const showIconSelector = ref(false);
const showGroupImageSelector = ref(false);
const showLogoLibrarySelector = ref(false);
const logoLibraryTargetField = ref<
	"logoUrl" | "logoIconUrl" | "logoLineUrl"
>("logoUrl");
const groupImageSelectorTarget = ref<{
	groupIdx: number;
	imgIdx: number;
} | null>(null);
const groupImageSelectorImages = ref<{ name: string; url: string }[]>([]);
const logoLibraryImages = ref<{ name: string; url: string }[]>([]);
const groupNameErrorIdx = ref<number | null>(null);

const REQUIRED_GROUP_NAMES = ["background", "foreground"] as const;

const REQUIRED_GROUPS: FormImageGroup[] = REQUIRED_GROUP_NAMES.map(
	(groupName) => ({
		groupName,
		images_url: [],
		locked: true,
	})
);

function isReservedGroupName(name: string) {
	return (REQUIRED_GROUP_NAMES as readonly string[]).includes(name);
}

function normalizeImageGroups(groups: any[]): FormImageGroup[] {
	if (!Array.isArray(groups)) {
		return REQUIRED_GROUPS.map((g) => ({
			...g,
			images_url: [],
			locked: true,
		}));
	}
	return groups.map((g) => {
		const images = Array.isArray(g.images_url) ? g.images_url : [];
		const normalized = images.map((img: any) => {
			if (typeof img === "string") {
				return { name: "", url: img };
			}
			if (img && typeof img === "object") {
				return { name: img.name || "", url: img.url || "" };
			}
			return { name: "", url: "" };
		});
		return {
			groupName: g.groupName || "",
			images_url: normalized,
			locked: false,
		};
	});
}

function ensureRequiredGroups(groups: any[]): FormImageGroup[] {
	const normalized = normalizeImageGroups(groups);

	// Fusionne les doublons des noms réservés (évite d'écraser le vrai background)
	const deduped: FormImageGroup[] = [];
	const reservedFirstIndex = new Map<string, number>();
	for (const group of normalized) {
		if (isReservedGroupName(group.groupName)) {
			const existingIdx = reservedFirstIndex.get(group.groupName);
			if (existingIdx !== undefined) {
				deduped[existingIdx].images_url.push(...group.images_url);
				continue;
			}
			reservedFirstIndex.set(group.groupName, deduped.length);
			deduped.push({ ...group, locked: true });
			continue;
		}
		deduped.push({ ...group, locked: false });
	}

	REQUIRED_GROUPS.forEach((req) => {
		if (!reservedFirstIndex.has(req.groupName)) {
			deduped.push({
				groupName: req.groupName,
				images_url: [],
				locked: true,
			});
		}
	});

	// Groupes obligatoires toujours en premier
	deduped.sort((a, b) => {
		const ia = REQUIRED_GROUP_NAMES.indexOf(
			a.groupName as (typeof REQUIRED_GROUP_NAMES)[number]
		);
		const ib = REQUIRED_GROUP_NAMES.indexOf(
			b.groupName as (typeof REQUIRED_GROUP_NAMES)[number]
		);
		if (ia !== -1 && ib !== -1) return ia - ib;
		if (ia !== -1) return -1;
		if (ib !== -1) return 1;
		return 0;
	});

	return deduped.map((g) => ({
		...g,
		locked: isReservedGroupName(g.groupName) ? true : false,
	}));
}

function toPersistableImageGroups(groups: FormImageGroup[]): ImageGroup[] {
	return groups.map(({ groupName, images_url }) => ({
		groupName,
		images_url,
	}));
}

const formData = ref({
	id: props.brand?.id || "",
	name: props.brand?.name || "",
	primaryColor: props.brand?.primaryColor || "#000000",
	secondaryColor: props.brand?.secondaryColor || "#000000",
	tertiaryColor: props.brand?.tertiaryColor || "#000000",
	accentColor:
		(props.brand as any)?.accentColor ||
		props.brand?.primaryColor ||
		"#000000",
	textColor: props.brand?.textColor || "#000000",
	textColor2: props.brand?.textColor2 || "#000000",
	textColorDark:
		(props.brand as any)?.textColorDark || props.brand?.textColor || "#000000",
	textColor2Dark:
		(props.brand as any)?.textColor2Dark ||
		props.brand?.textColor2 ||
		"#000000",
	titleFont: props.brand?.titleFont || "Inter",
	textFont: props.brand?.textFont || "Inter",
	tertiaryFont: props.brand?.tertiaryFont || "Inter",
	logoUrl: props.brand?.logoUrl || "",
	logoIconUrl: (props.brand as any)?.logoIconUrl || "",
	logoLineUrl: (props.brand as any)?.logoLineUrl || "",
	backgrounds: props.brand?.backgrounds || [],
	icons: props.brand?.icons || [],
	imageGroups: ensureRequiredGroups(props.brand?.imageGroups || []),
});

const handleSubmit = () => {
	const conflictIdx = formData.value.imageGroups.findIndex(
		(g) => !g.locked && isReservedGroupName(g.groupName)
	);
	if (conflictIdx !== -1) {
		groupNameErrorIdx.value = conflictIdx;
		return;
	}
	groupNameErrorIdx.value = null;
	emit("submit", {
		...formData.value,
		imageGroups: toPersistableImageGroups(formData.value.imageGroups),
	} as Brand);
};

const updateIcons = (icons: Icon[]) => {
	formData.value.icons = icons;
};

const removeIcon = (icon: Icon) => {
	formData.value.icons = formData.value.icons.filter(
		(i) => i.name !== icon.name
	);
};

function addImageGroup() {
	formData.value.imageGroups.push({
		groupName: "",
		images_url: [],
		locked: false,
	});
}

function removeImageGroup(idx: number) {
	const group = formData.value.imageGroups[idx];
	if (group?.locked) return;
	formData.value.imageGroups.splice(idx, 1);
	if (groupNameErrorIdx.value === idx) groupNameErrorIdx.value = null;
}

function onGroupNameBlur(idx: number) {
	const group = formData.value.imageGroups[idx];
	if (!group || group.locked) return;
	if (isReservedGroupName(group.groupName)) {
		groupNameErrorIdx.value = idx;
		return;
	}
	if (groupNameErrorIdx.value === idx) groupNameErrorIdx.value = null;
}
function addImageToGroup(groupIdx: number) {
	formData.value.imageGroups[groupIdx].images_url.push({ name: "", url: "" });
}
function removeImageFromGroup(groupIdx: number, imgIdx: number) {
	formData.value.imageGroups[groupIdx].images_url.splice(imgIdx, 1);
}

const { apiFetch } = useApi();
const authStore = useAuthStore();

interface ImageResponse {
	id: number;
	filename: string;
	originalName: string;
	url: string;
	createdAt: string;
}

async function fetchLibraryImages() {
	// Utilise l'API d'images pour la bibliothèque
	const headers = authStore.getAuthHeaders;
	const res = await apiFetch<ImageResponse[]>("/images", { headers });
	groupImageSelectorImages.value = res.map((img: ImageResponse) => ({
		name: img.originalName,
		url: resolveBackendImageUrl(img.url),
	}));
}

function openImageLibrary(groupIdx: number, imgIdx: number) {
	groupImageSelectorTarget.value = { groupIdx, imgIdx };
	showGroupImageSelector.value = true;
	fetchLibraryImages();
}

function onGroupImageSelected(images: { name: string; url: string }[]) {
	if (!groupImageSelectorTarget.value || images.length === 0) return;
	const { groupIdx, imgIdx } = groupImageSelectorTarget.value;
	formData.value.imageGroups[groupIdx].images_url[imgIdx].url = images[0].url;
	formData.value.imageGroups[groupIdx].images_url[imgIdx].name =
		images[0].name;
	showGroupImageSelector.value = false;
}

function onGroupImageSelectorCancel() {
	showGroupImageSelector.value = false;
}

async function openLogoLibrarySelector(
	target: "logoUrl" | "logoIconUrl" | "logoLineUrl"
) {
	logoLibraryTargetField.value = target;
	showLogoLibrarySelector.value = true;
	const headers = authStore.getAuthHeaders;
	const res = await apiFetch<ImageResponse[]>("/images", { headers });
	logoLibraryImages.value = res.map((img: ImageResponse) => ({
		name: img.originalName,
		url: resolveBackendImageUrl(img.url),
	}));
}

function onLogoImageSelected(images: { name: string; url: string }[]) {
	if (!images.length) return;
	formData.value[logoLibraryTargetField.value] = images[0].url;
	showLogoLibrarySelector.value = false;
}

function onLogoLibrarySelectorCancel() {
	showLogoLibrarySelector.value = false;
}
</script>
