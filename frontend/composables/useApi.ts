export const useApi = () => {
	const config = useRuntimeConfig();

	const apiFetch = $fetch.create({
		baseURL: config.public.apiBase,
	});

	return {
		apiFetch,
	};
};
