<template>
	<div
		class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
	>
		<div
			class="relative top-10 mx-auto p-6 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white"
		>
			<div class="mt-3">
				<!-- Header -->
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-medium text-gray-900">
						{{
							isEdit
								? "Modifier l'utilisateur"
								: "Nouvel utilisateur"
						}}
					</h3>
					<button
						@click="$emit('close')"
						class="text-gray-400 hover:text-gray-600"
					>
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
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<!-- Email -->
						<div>
							<label
								for="email"
								class="block text-sm font-medium text-gray-700 mb-1"
							>
								Email *
							</label>
							<input
								id="email"
								v-model="form.email"
								type="email"
								required
								:disabled="isEdit"
								class="admin-input"
								:class="{ 'bg-gray-100': isEdit }"
							/>
						</div>

						<!-- Password (only for new users) -->
						<div v-if="!isEdit">
							<label
								for="password"
								class="block text-sm font-medium text-gray-700 mb-1"
							>
								Mot de passe *
							</label>
							<input
								id="password"
								v-model="form.password"
								type="password"
								required
								minlength="6"
								class="admin-input"
							/>
						</div>

						<!-- First Name -->
						<div>
							<label
								for="firstName"
								class="block text-sm font-medium text-gray-700 mb-1"
							>
								Prénom
							</label>
							<input
								id="firstName"
								v-model="form.firstName"
								type="text"
								class="admin-input"
							/>
						</div>

						<!-- Last Name -->
						<div>
							<label
								for="lastName"
								class="block text-sm font-medium text-gray-700 mb-1"
							>
								Nom
							</label>
							<input
								id="lastName"
								v-model="form.lastName"
								type="text"
								class="admin-input"
							/>
						</div>

						<!-- Role -->
						<div>
							<label
								for="role"
								class="block text-sm font-medium text-gray-700 mb-1"
							>
								Rôle *
							</label>
							<select
								id="role"
								v-model="form.role"
								required
								class="admin-input"
							>
								<option value="user">Utilisateur</option>
								<option value="admin">Administrateur</option>
							</select>
						</div>

						<!-- Status (only for edit) -->
						<div v-if="isEdit">
							<label
								for="status"
								class="block text-sm font-medium text-gray-700 mb-1"
							>
								Statut *
							</label>
							<select
								id="status"
								v-model="form.status"
								required
								class="admin-input"
							>
								<option value="active">Actif</option>
								<option value="inactive">Inactif</option>
								<option value="suspended">Suspendu</option>
								<option value="pending_verification">
									En attente de vérification
								</option>
							</select>
						</div>
					</div>

					<!-- Error Message -->
					<div v-if="error" class="text-red-600 text-sm">
						{{ error }}
					</div>

					<!-- Actions -->
					<div class="flex justify-end space-x-3 pt-4">
						<button
							type="button"
							@click="$emit('close')"
							class="admin-button-secondary"
						>
							Annuler
						</button>
						<button
							type="submit"
							:disabled="loading"
							class="admin-button-primary"
						>
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
								{{ isEdit ? "Modification..." : "Création..." }}
							</span>
							<span v-else>
								{{ isEdit ? "Modifier" : "Créer" }}
							</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";

interface Props {
	user?: any;
	isEdit: boolean;
}

interface FormData {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	role: "user" | "admin";
	status?: "active" | "inactive" | "suspended" | "pending_verification";
}

const props = defineProps<Props>();
const emit = defineEmits<{
	close: [];
	save: [data: any];
}>();

// Reactive data
const loading = ref(false);
const error = ref("");

const form = reactive<FormData>({
	email: "",
	password: "",
	firstName: "",
	lastName: "",
	role: "user",
	status: "active",
});

// Initialize form when user prop changes
watch(
	() => props.user,
	(newUser) => {
		if (newUser && props.isEdit) {
			form.email = newUser.email || "";
			form.firstName = newUser.firstName || "";
			form.lastName = newUser.lastName || "";
			form.role = newUser.role || "user";
			form.status = newUser.status || "active";
			form.password = ""; // Don't populate password in edit mode
		}
	},
	{ immediate: true }
);

// Methods
const validateForm = (): boolean => {
	error.value = "";

	if (!form.email) {
		error.value = "L'email est requis";
		return false;
	}

	if (!props.isEdit && !form.password) {
		error.value = "Le mot de passe est requis";
		return false;
	}

	if (!props.isEdit && form.password.length < 6) {
		error.value = "Le mot de passe doit contenir au moins 6 caractères";
		return false;
	}

	if (!form.role) {
		error.value = "Le rôle est requis";
		return false;
	}

	if (props.isEdit && !form.status) {
		error.value = "Le statut est requis";
		return false;
	}

	return true;
};

const handleSubmit = async () => {
	if (!validateForm()) {
		return;
	}

	loading.value = true;
	error.value = "";

	try {
		const userData = props.isEdit
			? {
					email: form.email,
					firstName: form.firstName,
					lastName: form.lastName,
					role: form.role,
					status: form.status,
			  }
			: {
					email: form.email,
					password: form.password,
					firstName: form.firstName,
					lastName: form.lastName,
					role: form.role,
			  };

		emit("save", userData);
	} catch (err: any) {
		error.value = err.message || "Une erreur est survenue";
	} finally {
		loading.value = false;
	}
};

// Reset form on mount
onMounted(() => {
	if (!props.isEdit) {
		form.email = "";
		form.password = "";
		form.firstName = "";
		form.lastName = "";
		form.role = "user";
		form.status = "active";
	}
});
</script>
