<template>
	<button
		:class="[
			'px-4 py-2 rounded-md transition-colors',
			variant === 'primary'
				? 'bg-blue-500 text-white hover:bg-blue-600'
				: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
		]"
		:disabled="disabled"
		@click="$emit('click')"
	>
		<slot></slot>
	</button>
</template>

<script setup lang="ts">
defineProps<{
	variant?: "primary" | "secondary";
	disabled?: boolean;
}>();

defineEmits<{
	(e: "click"): void;
}>();
</script>
