<template>
	<div class="min-h-screen bg-gray-50">
		<!-- Header -->
		<header class="bg-white shadow">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between items-center py-6">
					<div class="flex items-center space-x-4">
						<NuxtLink
							to="/dashboard"
							class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
						>
							<i
								class="ph-duotone ph-arrow-left h-6 w-6 mr-2"
							></i>
							Retour au tableau de bord
						</NuxtLink>
						<h1 class="text-2xl font-bold text-gray-900">
							Paramètres
						</h1>
					</div>
				</div>
			</div>
		</header>

		<!-- Main content -->
		<main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
			<div class="px-4 py-6 sm:px-0">
				<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
					<!-- Settings form -->
					<div class="lg:col-span-2">
						<div class="bg-white shadow rounded-lg">
							<div class="px-4 py-5 sm:p-6">
								<h3
									class="text-lg leading-6 font-medium text-gray-900 mb-6"
								>
									Préférences générales
								</h3>

								<form @submit.prevent="handleSave">
									<div
										class="grid grid-cols-1 gap-6 sm:grid-cols-2"
									>
										<div>
											<label
												for="language"
												class="block text-sm font-medium text-gray-700"
												>Langue</label
											>
											<select
												id="language"
												v-model="form.language"
												class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
											>
												<option value="fr">
													Français
												</option>
												<option value="en">
													English
												</option>
											</select>
										</div>

										<div>
											<label
												for="theme"
												class="block text-sm font-medium text-gray-700"
												>Thème</label
											>
											<select
												id="theme"
												v-model="form.theme"
												class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
											>
												<option value="system">
													Système
												</option>
												<option value="light">
													Clair
												</option>
												<option value="dark">
													Sombre
												</option>
											</select>
										</div>

										<div class="sm:col-span-2">
											<h4
												class="text-sm font-medium text-gray-900 mb-2"
											>
												Notifications
											</h4>
											<div class="space-y-3">
												<label
													class="flex items-center"
												>
													<input
														type="checkbox"
														v-model="
															form.emailNotifications
														"
														class="h-4 w-4 text-blue-600 border-gray-300 rounded"
													/>
													<span
														class="ml-2 text-sm text-gray-700"
														>Recevoir les
														notifications par
														email</span
													>
												</label>
												<label
													class="flex items-center"
												>
													<input
														type="checkbox"
														v-model="
															form.marketingEmails
														"
														class="h-4 w-4 text-blue-600 border-gray-300 rounded"
													/>
													<span
														class="ml-2 text-sm text-gray-700"
														>Recevoir les emails
														marketing</span
													>
												</label>
											</div>
										</div>
									</div>

									<div
										class="mt-6 flex items-center justify-end space-x-3"
									>
										<button
											type="button"
											@click="resetForm"
											class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
										>
											Annuler
										</button>
										<button
											type="submit"
											:disabled="loading"
											class="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
										>
											{{
												loading
													? "Sauvegarde..."
													: "Sauvegarder"
											}}
										</button>
									</div>
								</form>
							</div>
						</div>

						<!-- API Keys section -->
						<div class="mt-6 bg-white shadow rounded-lg">
							<div class="px-4 py-5 sm:p-6">
								<div
									class="flex items-center justify-between mb-4"
								>
									<h3
										class="text-lg leading-6 font-medium text-gray-900"
									>
										Clés API
									</h3>
									<div class="flex gap-2">
										<button
											@click="refreshApiKey"
											class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
										>
											<i
												class="ph-duotone ph-arrows-clockwise mr-2"
											></i>
											Regénérer
										</button>
										<button
											@click="revokeApiKey"
											class="inline-flex items-center px-3 py-2 border border-red-300 text-red-700 rounded-md text-sm hover:bg-red-50"
											:disabled="api.loading"
										>
											<i class="ph-duotone ph-x mr-2"></i>
											Révoquer
										</button>
									</div>
								</div>

								<div class="space-y-3">
									<div
										class="flex items-center justify-between p-3 bg-gray-50 rounded-md"
									>
										<div class="truncate">
											<p
												class="text-sm text-gray-700"
												v-if="api.maskedKey"
											>
												{{ api.maskedKey }}
											</p>
											<p
												class="text-sm text-gray-400"
												v-else
											>
												Aucune clé API. Cliquez sur
												"Générer" pour en créer une.
											</p>
										</div>
										<div class="flex gap-2">
											<button
												@click="copyApiKey"
												:disabled="!api.fullKey"
												class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
											>
												<i
													class="ph-duotone ph-copy mr-2"
												></i>
												Copier
											</button>
											<button
												@click="generateApiKey"
												class="inline-flex items-center px-3 py-2 border border-blue-300 text-blue-700 rounded-md text-sm hover:bg-blue-50"
												:disabled="api.loading"
											>
												<i
													class="ph-duotone ph-key mr-2"
												></i>
												Générer
											</button>
										</div>
									</div>

									<div class="text-xs text-gray-500">
										Utilisez le header
										<code
											>Authorization: ApiKey
											VOTRE_CLE</code
										>
										ou <code>X-API-Key: VOTRE_CLE</code>.
									</div>
								</div>
							</div>
						</div>

						<!-- Advanced section -->
						<div class="mt-6 bg-white shadow rounded-lg">
							<div class="px-4 py-5 sm:p-6">
								<h3
									class="text-lg leading-6 font-medium text-gray-900 mb-6"
								>
									Avancé
								</h3>
								<div class="space-y-4">
									<div
										class="flex items-center justify-between"
									>
										<div>
											<p
												class="text-sm font-medium text-gray-900"
											>
												Mode compact
											</p>
											<p class="text-sm text-gray-500">
												Réduit les espacements et la
												taille de certains éléments.
											</p>
										</div>
										<label
											class="inline-flex items-center cursor-pointer"
										>
											<input
												type="checkbox"
												class="sr-only"
												v-model="form.compactMode"
											/>
											<span class="relative">
												<span
													class="block w-10 h-6 bg-gray-200 rounded-full shadow-inner"
												></span>
												<span
													class="dot absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow transition"
													:class="{
														'translate-x-4 bg-blue-600':
															form.compactMode,
													}"
												></span>
											</span>
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Sidebar -->
					<div class="lg:col-span-1">
						<div class="bg-white shadow rounded-lg">
							<div class="px-4 py-5 sm:p-6">
								<h3
									class="text-lg leading-6 font-medium text-gray-900 mb-4"
								>
									À propos
								</h3>
								<dl class="space-y-3">
									<div>
										<dt
											class="text-sm font-medium text-gray-500"
										>
											Version
										</dt>
										<dd class="mt-1 text-sm text-gray-900">
											1.0.0
										</dd>
									</div>
									<div>
										<dt
											class="text-sm font-medium text-gray-500"
										>
											Langue
										</dt>
										<dd class="mt-1 text-sm text-gray-900">
											{{
												form.language === "fr"
													? "Français"
													: "English"
											}}
										</dd>
									</div>
									<div>
										<dt
											class="text-sm font-medium text-gray-500"
										>
											Thème
										</dt>
										<dd
											class="mt-1 text-sm text-gray-900 capitalize"
										>
											{{ form.theme }}
										</dd>
									</div>
								</dl>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>

		<!-- Toast -->
		<div
			v-if="message"
			class="fixed top-4 right-4 z-50 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
		>
			<div class="p-4">
				<div class="flex items-start">
					<div class="flex-shrink-0">
						<i
							class="ph-duotone ph-check-circle h-6 w-6 text-green-400"
						></i>
					</div>
					<div class="ml-3 w-0 flex-1 pt-0.5">
						<p class="text-sm font-medium text-gray-900">
							{{ message.title }}
						</p>
						<p class="mt-1 text-sm text-gray-500">
							{{ message.text }}
						</p>
					</div>
					<div class="ml-4 flex-shrink-0 flex">
						<button
							@click="message = null"
							class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							<i class="ph-duotone ph-x h-5 w-5"></i>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useAuthStore } from "~/composables/useAuth";
import { useApi } from "~/composables/useApi";

definePageMeta({
	auth: true,
});

type ThemePreference = "system" | "light" | "dark";
type LanguagePreference = "fr" | "en";

interface PreferencesForm {
	language: LanguagePreference;
	theme: ThemePreference;
	emailNotifications: boolean;
	marketingEmails: boolean;
	compactMode: boolean;
}

const STORAGE_KEY = "pg.preferences";

const loading = ref(false);
const message = ref<{ title: string; text: string } | null>(null);
const authStore = useAuthStore();
const { apiFetch } = useApi();

const api = reactive({
	maskedKey: "" as string | null,
	fullKey: "" as string | null,
	loading: false,
});

const form = reactive<PreferencesForm>({
	language: "fr",
	theme: "system",
	emailNotifications: true,
	marketingEmails: false,
	compactMode: false,
});

const resetForm = () => {
	const saved = readFromStorage();
	if (saved) {
		Object.assign(form, saved);
	}
};

const readFromStorage = (): PreferencesForm | null => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as Partial<PreferencesForm>;
		return {
			language: parsed.language ?? "fr",
			theme: parsed.theme ?? "system",
			emailNotifications: parsed.emailNotifications ?? true,
			marketingEmails: parsed.marketingEmails ?? false,
			compactMode: parsed.compactMode ?? false,
		};
	} catch {
		return null;
	}
};

const writeToStorage = (prefs: PreferencesForm) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
};

const handleSave = async () => {
	loading.value = true;
	try {
		// Persist locally for now. Hook to backend later if needed.
		writeToStorage({ ...form });
		message.value = {
			title: "Préférences sauvegardées",
			text: "Vos paramètres ont été enregistrés.",
		};
	} finally {
		loading.value = false;
		setTimeout(() => (message.value = null), 3000);
	}
};

onMounted(() => {
	const saved = readFromStorage();
	if (saved) {
		Object.assign(form, saved);
	}
	// Load API key masked value
	fetchApiKeyStatus();
});

const fetchApiKeyStatus = async () => {
	api.loading = true;
	try {
		const data = await apiFetch<{
			hasApiKey: boolean;
			maskedKey: string | null;
		}>("/users/me/api-key", { headers: authStore.getAuthHeaders });
		api.maskedKey = data.maskedKey || null;
		api.fullKey = null; // never store server-side key; only on fresh generation
	} catch (e) {
		// ignore
	} finally {
		api.loading = false;
	}
};

const generateApiKey = async () => {
	api.loading = true;
	try {
		const data = await apiFetch<{ apiKey: string }>("/users/me/api-key", {
			method: "POST",
			headers: authStore.getAuthHeaders,
		});
		api.fullKey = data.apiKey;
		api.maskedKey = `${data.apiKey.slice(0, 6)}••••${data.apiKey.slice(
			-4
		)}`;
		message.value = {
			title: "Clé API générée",
			text: "Copiez-la et conservez-la en lieu sûr.",
		};
	} finally {
		api.loading = false;
	}
};

const refreshApiKey = generateApiKey;

const revokeApiKey = async () => {
	api.loading = true;
	try {
		await apiFetch("/users/me/api-key", {
			method: "DELETE",
			headers: authStore.getAuthHeaders,
		});
		api.fullKey = null;
		api.maskedKey = null;
		message.value = {
			title: "Clé API révoquée",
			text: "Votre clé a été désactivée.",
		};
	} finally {
		api.loading = false;
	}
};

const copyApiKey = async () => {
	if (!api.fullKey) return;
	try {
		await navigator.clipboard.writeText(api.fullKey);
		message.value = {
			title: "Copié",
			text: "La clé API a été copiée dans le presse-papiers.",
		};
	} catch (_) {
		// ignore
	}
};
</script>
