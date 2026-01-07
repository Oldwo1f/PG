/**
 * Utilitaire pour obtenir l'URL de base de l'API
 * Utilise la configuration runtime de Nuxt pour s'adapter à l'environnement
 */
export function getApiBaseUrl(): string {
	const config = useRuntimeConfig();
	return config.public.apiBase;
}

/**
 * Construit une URL complète pour un endpoint de l'API
 * @param endpoint - Le chemin de l'endpoint (ex: "/brands" ou "brands")
 * @returns L'URL complète
 */
export function getApiUrl(endpoint: string): string {
	const baseUrl = getApiBaseUrl();
	// S'assurer que l'endpoint commence par /
	const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
	// S'assurer que baseUrl ne se termine pas par /
	const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
	return `${normalizedBase}${normalizedEndpoint}`;
}

