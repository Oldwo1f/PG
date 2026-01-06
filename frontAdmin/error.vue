<template>
	<div
		class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
	>
		<div class="sm:mx-auto sm:w-full sm:max-w-md">
			<div class="text-center">
				<h1 class="text-6xl font-extrabold text-gray-900 mb-4">
					{{ error.statusCode }}
				</h1>
				<h2 class="text-2xl font-bold text-gray-900 mb-4">
					{{
						error.statusCode === 404 ? "Page non trouvée" : "Erreur"
					}}
				</h2>
				<p class="text-gray-600 mb-8">
					{{
						error.statusCode === 404
							? "La page que vous recherchez n'existe pas."
							: "Une erreur s'est produite."
					}}
				</p>
				<div class="space-x-4">
					<button @click="handleError" class="admin-button-primary">
						Retour à l'accueil
					</button>
					<button @click="goBack" class="admin-button-secondary">
						Retour en arrière
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const error = useError();

const handleError = () => {
	clearError({ redirect: "/" });
};

const goBack = () => {
	history.back();
};
</script>
