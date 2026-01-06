export const useApi = () => {
	const config = useRuntimeConfig();
	const authStore = useAuthStore();

	const apiFetch = $fetch.create({
		baseURL: config.public.apiBase,
		onRequest({ request, options }) {
			// Add authorization header if token exists
			if (authStore.token) {
				options.headers = {
					...options.headers,
					Authorization: `Bearer ${authStore.token}`,
				} as any;
			}
		},
		onResponseError({ response }) {
			// Handle 401 errors by redirecting to login
			if (response.status === 401) {
				authStore.logout();
				navigateTo("/");
			}
		},
	});

	return {
		apiFetch,
	};
};
