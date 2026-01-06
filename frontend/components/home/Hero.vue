<template>
	<section class="relative py-20 overflow-hidden">
		<div class="container mx-auto px-4">
			<div class="max-w-3xl mx-auto text-center">
				<h1
					class="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
				>
					Génération d'Images Parfaite pour Votre Marque
				</h1>
				<p class="text-xl text-gray-600 mb-8">
					Plus de compromis sur la qualité. Des images qui reflètent
					parfaitement l'identité de votre marque.
				</p>
				<div class="flex justify-center gap-4">
					<Button variant="primary" @click="$emit('start')">
						Commencer Maintenant
					</Button>
					<Button variant="secondary" @click="$emit('demo')">
						Voir la Démo
					</Button>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import Button from "../shared/Button.vue";

defineEmits<{
	(e: "start"): void;
	(e: "demo"): void;
}>();
</script>
