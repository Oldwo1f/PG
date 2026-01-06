<template>
	<div class="min-h-screen bg-white flex flex-col">
		<Navigation />

		<main class="flex-1 flex flex-col">
			<slot />
		</main>

		<footer class="bg-gray-50 border-t mt-auto">
			<div class="container mx-auto px-4 py-4">
				<div class="text-center text-gray-600">
					© {{ new Date().getFullYear() }} Perfect Generations. Tous
					droits réservés.
				</div>
			</div>
		</footer>
	</div>
</template>

<script setup lang="ts">
import Navigation from "~/components/shared/Navigation.vue";
</script>
