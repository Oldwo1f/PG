// plugins/monaco.client.ts
export default defineNuxtPlugin(() => {
	if (typeof window !== "undefined") {
		// @ts-ignore
		window.MonacoEnvironment = {
			getWorker: function (moduleId: string, label: string) {
				// Disable workers and run in main thread to avoid CORS/CDN issues
				// This is acceptable for most use cases and avoids network errors
				return undefined;
			},
			getWorkerUrl: function (moduleId: string, label: string) {
				// Return undefined to disable workers (fallback to main thread)
				// This avoids CORS issues with CDN workers
				return undefined;
			},
		};
	}
});

