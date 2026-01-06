<template>
	<div class="min-h-screen bg-gray-50">
		<!-- Header -->
		<header class="bg-white shadow">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between items-center py-6">
					<div class="flex items-center">
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
							Mon profil
						</h1>
					</div>
				</div>
			</div>
		</header>

		<!-- Main content -->
		<main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
			<div class="px-4 py-6 sm:px-0">
				<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
					<!-- Profile Info -->
					<div class="lg:col-span-2">
						<div class="bg-white shadow rounded-lg">
							<div class="px-4 py-5 sm:p-6">
								<h3
									class="text-lg leading-6 font-medium text-gray-900 mb-6"
								>
									Informations personnelles
								</h3>

								<form @submit.prevent="handleUpdateProfile">
									<div
										class="grid grid-cols-1 gap-6 sm:grid-cols-2"
									>
										<div>
											<label
												for="firstName"
												class="block text-sm font-medium text-gray-700"
											>
												Prénom
											</label>
											<input
												id="firstName"
												v-model="form.firstName"
												type="text"
												required
												class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
											/>
										</div>

										<div>
											<label
												for="lastName"
												class="block text-sm font-medium text-gray-700"
											>
												Nom
											</label>
											<input
												id="lastName"
												v-model="form.lastName"
												type="text"
												required
												class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
											/>
										</div>

										<div class="sm:col-span-2">
											<label
												for="email"
												class="block text-sm font-medium text-gray-700"
											>
												Adresse email
											</label>
											<input
												id="email"
												v-model="form.email"
												type="email"
												required
												class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
											/>
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

						<!-- Change Password -->
						<div class="mt-6 bg-white shadow rounded-lg">
							<div class="px-4 py-5 sm:p-6">
								<h3
									class="text-lg leading-6 font-medium text-gray-900 mb-6"
								>
									Changer le mot de passe
								</h3>

								<form @submit.prevent="handleChangePassword">
									<div class="space-y-4">
										<div>
											<label
												for="currentPassword"
												class="block text-sm font-medium text-gray-700"
											>
												Mot de passe actuel
											</label>
											<input
												id="currentPassword"
												v-model="
													passwordForm.currentPassword
												"
												type="password"
												required
												class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
											/>
										</div>

										<div>
											<label
												for="newPassword"
												class="block text-sm font-medium text-gray-700"
											>
												Nouveau mot de passe
											</label>
											<input
												id="newPassword"
												v-model="
													passwordForm.newPassword
												"
												type="password"
												required
												class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
											/>
										</div>

										<div>
											<label
												for="confirmPassword"
												class="block text-sm font-medium text-gray-700"
											>
												Confirmer le nouveau mot de
												passe
											</label>
											<input
												id="confirmPassword"
												v-model="
													passwordForm.confirmPassword
												"
												type="password"
												required
												class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
											/>
										</div>
									</div>

									<div
										class="mt-6 flex items-center justify-end space-x-3"
									>
										<button
											type="button"
											@click="resetPasswordForm"
											class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
										>
											Annuler
										</button>
										<button
											type="submit"
											:disabled="passwordLoading"
											class="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
										>
											{{
												passwordLoading
													? "Changement..."
													: "Changer le mot de passe"
											}}
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>

					<!-- Sidebar -->
					<div class="lg:col-span-1">
						<!-- Account Info -->
						<div class="bg-white shadow rounded-lg">
							<div class="px-4 py-5 sm:p-6">
								<h3
									class="text-lg leading-6 font-medium text-gray-900 mb-4"
								>
									Informations du compte
								</h3>

								<div class="space-y-4">
									<div>
										<dt
											class="text-sm font-medium text-gray-500"
										>
											Membre depuis
										</dt>
										<dd class="mt-1 text-sm text-gray-900">
											{{ memberSince }}
										</dd>
									</div>

									<div>
										<dt
											class="text-sm font-medium text-gray-500"
										>
											Rôle
										</dt>
										<dd class="mt-1 text-sm text-gray-900">
											{{ userRole }}
										</dd>
									</div>

									<div>
										<dt
											class="text-sm font-medium text-gray-500"
										>
											Dernière connexion
										</dt>
										<dd class="mt-1 text-sm text-gray-900">
											{{ lastLogin }}
										</dd>
									</div>
								</div>
							</div>
						</div>

						<!-- Danger Zone -->
						<div class="mt-6 bg-white shadow rounded-lg">
							<div class="px-4 py-5 sm:p-6">
								<h3
									class="text-lg leading-6 font-medium text-red-900 mb-4"
								>
									Zone de danger
								</h3>

								<div class="space-y-4">
									<div>
										<button
											@click="showDeleteModal = true"
											class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
										>
											<i
												class="ph-duotone ph-x h-5 w-5 mr-2"
											></i>
											Supprimer mon compte
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>

		<!-- Success/Error Messages -->
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

		<!-- Delete Account Modal -->
		<div
			v-if="showDeleteModal"
			class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
		>
			<div
				class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
			>
				<div class="mt-3">
					<div
						class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full"
					>
						<i
							class="ph-duotone ph-warning h-6 w-6 text-red-600"
						></i>
					</div>
					<div class="mt-2 text-center">
						<h3 class="text-lg font-medium leading-6 text-gray-900">
							Supprimer le compte
						</h3>
						<div class="mt-2 px-7 py-3">
							<p class="text-sm text-gray-500">
								Êtes-vous sûr de vouloir supprimer votre compte
								? Cette action est irréversible.
							</p>
						</div>
						<div class="items-center px-4 py-3">
							<input
								v-model="deleteConfirmation"
								type="text"
								placeholder="Tapez 'SUPPRIMER' pour confirmer"
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
						<div class="flex justify-end space-x-3 mt-4">
							<button
								@click="showDeleteModal = false"
								class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
							>
								Annuler
							</button>
							<button
								@click="handleDeleteAccount"
								:disabled="deleteConfirmation !== 'SUPPRIMER'"
								class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
							>
								Supprimer
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useAuthStore } from "~/composables/useAuth";
import { useUserStore } from "~/stores/user";

definePageMeta({
	auth: true,
});

const authStore = useAuthStore();
const userStore = useUserStore();

// Form data
const form = reactive({
	firstName: "",
	lastName: "",
	email: "",
});

const passwordForm = reactive({
	currentPassword: "",
	newPassword: "",
	confirmPassword: "",
});

// UI state
const loading = ref(false);
const passwordLoading = ref(false);
const showDeleteModal = ref(false);
const deleteConfirmation = ref("");
const message = ref<{
	type: "success" | "error";
	title: string;
	text: string;
} | null>(null);

// Computed properties
const user = computed(() => authStore.user);

const memberSince = computed(() => {
	if (!user.value?.createdAt) return "N/A";
	const date = new Date(user.value.createdAt);
	return date.toLocaleDateString("fr-FR", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
});

const userRole = computed(() => {
	if (!user.value?.role) return "Utilisateur";
	return user.value.role === "admin" ? "Administrateur" : "Utilisateur";
});

const lastLogin = computed(() => {
	// This would come from the backend in a real app
	return "Aujourd'hui";
});

// Methods
const resetForm = () => {
	form.firstName = user.value?.firstName || "";
	form.lastName = user.value?.lastName || "";
	form.email = user.value?.email || "";
};

const resetPasswordForm = () => {
	passwordForm.currentPassword = "";
	passwordForm.newPassword = "";
	passwordForm.confirmPassword = "";
};

const showMessage = (
	type: "success" | "error",
	title: string,
	text: string
) => {
	message.value = { type, title, text };
	setTimeout(() => {
		message.value = null;
	}, 5000);
};

const handleUpdateProfile = async () => {
	const result = await userStore.updateProfile({
		firstName: form.firstName,
		lastName: form.lastName,
		email: form.email,
	});

	if (result.success) {
		showMessage("success", "Profil mis à jour", userStore.message!);
	} else {
		showMessage("error", "Erreur", userStore.error!);
	}
};

const handleChangePassword = async () => {
	if (passwordForm.newPassword !== passwordForm.confirmPassword) {
		showMessage(
			"error",
			"Erreur",
			"Les mots de passe ne correspondent pas"
		);
		return;
	}

	if (passwordForm.newPassword.length < 8) {
		showMessage(
			"error",
			"Erreur",
			"Le nouveau mot de passe doit contenir au moins 8 caractères"
		);
		return;
	}

	const result = await userStore.changePassword(
		passwordForm.currentPassword,
		passwordForm.newPassword
	);

	if (result.success) {
		showMessage("success", "Mot de passe changé", userStore.message!);
		resetPasswordForm();
	} else {
		showMessage("error", "Erreur", userStore.error!);
	}
};

const handleDeleteAccount = async () => {
	if (deleteConfirmation.value !== "SUPPRIMER") {
		return;
	}

	const result = await userStore.deleteAccount();

	if (result.success) {
		showMessage(
			"success",
			"Compte supprimé",
			"Votre compte a été supprimé avec succès. Vous allez être redirigé."
		);
		showDeleteModal.value = false;
		// The logout action in the store already redirects
	} else {
		showMessage(
			"error",
			"Erreur",
			result.error ||
				"Une erreur est survenue lors de la suppression du compte"
		);
	}
};

// Lifecycle
onMounted(() => {
	resetForm();
});
</script>
