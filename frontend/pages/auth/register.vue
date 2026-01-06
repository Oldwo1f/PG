<template>
	<div
		class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
	>
		<div class="sm:mx-auto sm:w-full sm:max-w-md">
			<div class="text-center">
				<NuxtLink to="/" class="text-3xl font-bold text-blue-600">
					Perfect Generations
				</NuxtLink>
				<h2 class="mt-6 text-3xl font-extrabold text-gray-900">
					Créez votre compte
				</h2>
				<p class="mt-2 text-sm text-gray-600">
					Ou
					<NuxtLink
						to="/auth/login"
						class="font-medium text-blue-600 hover:text-blue-500"
					>
						connectez-vous à votre compte existant
					</NuxtLink>
				</p>
			</div>
		</div>

		<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
			<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
				<form class="space-y-6" @submit.prevent="handleRegister">
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div>
							<label
								for="firstName"
								class="block text-sm font-medium text-gray-700"
							>
								Prénom
							</label>
							<div class="mt-1">
								<input
									id="firstName"
									v-model="form.firstName"
									name="firstName"
									type="text"
									autocomplete="given-name"
									required
									:class="[
										'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
										errors.firstName
											? 'border-red-300 focus:ring-red-500 focus:border-red-500'
											: '',
									]"
									:placeholder="'Entrez votre prénom'"
								/>
							</div>
							<p
								v-if="errors.firstName"
								class="mt-2 text-sm text-red-600"
							>
								{{ errors.firstName }}
							</p>
						</div>

						<div>
							<label
								for="lastName"
								class="block text-sm font-medium text-gray-700"
							>
								Nom
							</label>
							<div class="mt-1">
								<input
									id="lastName"
									v-model="form.lastName"
									name="lastName"
									type="text"
									autocomplete="family-name"
									required
									:class="[
										'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
										errors.lastName
											? 'border-red-300 focus:ring-red-500 focus:border-red-500'
											: '',
									]"
									:placeholder="'Entrez votre nom'"
								/>
							</div>
							<p
								v-if="errors.lastName"
								class="mt-2 text-sm text-red-600"
							>
								{{ errors.lastName }}
							</p>
						</div>
					</div>

					<div>
						<label
							for="email"
							class="block text-sm font-medium text-gray-700"
						>
							Adresse email
						</label>
						<div class="mt-1">
							<input
								id="email"
								v-model="form.email"
								name="email"
								type="email"
								autocomplete="email"
								required
								:class="[
									'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
									errors.email
										? 'border-red-300 focus:ring-red-500 focus:border-red-500'
										: '',
								]"
								:placeholder="'Entrez votre adresse email'"
							/>
						</div>
						<p
							v-if="errors.email"
							class="mt-2 text-sm text-red-600"
						>
							{{ errors.email }}
						</p>
					</div>

					<div>
						<label
							for="password"
							class="block text-sm font-medium text-gray-700"
						>
							Mot de passe
						</label>
						<div class="mt-1">
							<input
								id="password"
								v-model="form.password"
								name="password"
								type="password"
								autocomplete="new-password"
								required
								:class="[
									'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
									errors.password
										? 'border-red-300 focus:ring-red-500 focus:border-red-500'
										: '',
								]"
								:placeholder="'Créez un mot de passe'"
							/>
						</div>
						<p
							v-if="errors.password"
							class="mt-2 text-sm text-red-600"
						>
							{{ errors.password }}
						</p>
						<div class="mt-2 text-xs text-gray-500">
							Le mot de passe doit contenir au moins 8 caractères
							avec des lettres, chiffres et caractères spéciaux
						</div>
					</div>

					<div>
						<label
							for="confirmPassword"
							class="block text-sm font-medium text-gray-700"
						>
							Confirmer le mot de passe
						</label>
						<div class="mt-1">
							<input
								id="confirmPassword"
								v-model="form.confirmPassword"
								name="confirmPassword"
								type="password"
								autocomplete="new-password"
								required
								:class="[
									'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
									errors.confirmPassword
										? 'border-red-300 focus:ring-red-500 focus:border-red-500'
										: '',
								]"
								:placeholder="'Confirmez votre mot de passe'"
							/>
						</div>
						<p
							v-if="errors.confirmPassword"
							class="mt-2 text-sm text-red-600"
						>
							{{ errors.confirmPassword }}
						</p>
					</div>

					<div class="flex items-center">
						<input
							id="terms"
							v-model="form.acceptTerms"
							name="terms"
							type="checkbox"
							required
							class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						/>
						<label
							for="terms"
							class="ml-2 block text-sm text-gray-900"
						>
							J'accepte les
							<NuxtLink
								to="/terms"
								class="font-medium text-blue-600 hover:text-blue-500"
								target="_blank"
							>
								conditions d'utilisation
							</NuxtLink>
							et la
							<NuxtLink
								to="/privacy"
								class="font-medium text-blue-600 hover:text-blue-500"
								target="_blank"
							>
								politique de confidentialité
							</NuxtLink>
						</label>
					</div>

					<div class="flex items-center">
						<input
							id="newsletter"
							v-model="form.acceptNewsletter"
							name="newsletter"
							type="checkbox"
							class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						/>
						<label
							for="newsletter"
							class="ml-2 block text-sm text-gray-900"
						>
							Je souhaite recevoir des newsletters et des offres
							spéciales
						</label>
					</div>

					<div v-if="error" class="rounded-md bg-red-50 p-4">
						<div class="flex">
							<div class="flex-shrink-0">
								<i
									class="ph-duotone ph-warning-circle h-5 w-5 text-red-400"
								></i>
							</div>
							<div class="ml-3">
								<h3 class="text-sm font-medium text-red-800">
									Erreur d'inscription
								</h3>
								<div class="mt-2 text-sm text-red-700">
									{{ error }}
								</div>
							</div>
						</div>
					</div>

					<div>
						<button
							type="submit"
							:disabled="loading"
							class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<span
								v-if="loading"
								class="absolute left-0 inset-y-0 flex items-center pl-3"
							>
								<i
									class="ph-duotone ph-spinner h-5 w-5 text-blue-500 group-hover:text-blue-400 animate-spin"
								></i>
							</span>
							{{
								loading
									? "Création du compte..."
									: "Créer mon compte"
							}}
						</button>
					</div>
				</form>

				<div class="mt-6">
					<div class="relative">
						<div class="absolute inset-0 flex items-center">
							<div class="w-full border-t border-gray-300" />
						</div>
						<div class="relative flex justify-center text-sm">
							<span class="px-2 bg-white text-gray-500">
								Ou s'inscrire avec
							</span>
						</div>
					</div>

					<div class="mt-6 grid grid-cols-2 gap-3">
						<button
							type="button"
							class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							<i class="ph-duotone ph-google-logo h-5 w-5"></i>
							<span class="ml-2">Continuer avec Google</span>
						</button>

						<button
							type="button"
							class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							<i class="ph-duotone ph-github-logo h-5 w-5"></i>
							<span class="ml-2">Continuer avec GitHub</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { useAuthStore } from "~/composables/useAuth";
import { useRouter } from "vue-router";

definePageMeta({
	auth: false,
});

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	confirmPassword: "",
	acceptNewsletter: false,
	acceptTerms: false,
});

const errors = reactive({
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	confirmPassword: "",
});

const loading = computed(() => authStore.loading);
const error = computed(() => authStore.error);

const handleRegister = async () => {
	// Reset errors
	Object.keys(errors).forEach(
		(key) => (errors[key as keyof typeof errors] = "")
	);

	if (form.password !== form.confirmPassword) {
		errors.confirmPassword = "Les mots de passe ne correspondent pas.";
		return;
	}
	if (!form.acceptTerms) {
		authStore.$patch({
			error: "Vous devez accepter les conditions d'utilisation.",
		});
		return;
	}

	try {
		await authStore.register({
			firstName: form.firstName,
			lastName: form.lastName,
			email: form.email,
			password: form.password,
			acceptNewsletter: form.acceptNewsletter,
		});
		if (authStore.isAuthenticated) {
			router.push("/dashboard");
		}
	} catch (err: any) {
		// The error from the store is already set, so we just log it
		console.error("Registration failed:", err);
		// You could potentially map specific backend errors to the form fields here
	}
};
</script>
