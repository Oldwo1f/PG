/**
 * Utilitaire pour obtenir l'URL de base de l'API
 * Utilise la configuration runtime de Nuxt pour s'adapter à l'environnement
 */
export function getApiBaseUrl(): string {
	const config = useRuntimeConfig();
	return config.public.apiBase;
}

function normalizeNoTrailingSlash(url: string): string {
	return url.endsWith("/") ? url.slice(0, -1) : url;
}

/**
 * Retourne l'origine (sans /api) pour construire des URLs statiques si besoin.
 * Ex: https://backendperfectgeneration.aito-flow.com
 */
export function getApiOrigin(): string {
	const base = normalizeNoTrailingSlash(getApiBaseUrl());
	return base.replace(/\/api$/, "");
}

/**
 * Base pour servir les images via l'endpoint backend (bypass /uploads).
 * Ex: https://backend.../api/images/file
 */
export function getBackendImageFileBaseUrl(): string {
	const base = normalizeNoTrailingSlash(getApiBaseUrl());
	return `${base}/images/file`;
}

function extractFilenameFromImagePath(pathname: string): string | null {
	// /uploads/images/<filename>
	let m = pathname.match(/\/uploads\/images\/([^/]+)$/);
	if (m?.[1]) return m[1];

	// /api/images/file/<filename>
	m = pathname.match(/\/api\/images\/file\/([^/]+)$/);
	if (m?.[1]) return m[1];

	// /images/file/<filename> (au cas où)
	m = pathname.match(/\/images\/file\/([^/]+)$/);
	if (m?.[1]) return m[1];

	return null;
}

/**
 * Convertit une URL d'image backend stockée en DB (souvent /uploads/images/...)
 * vers l'endpoint fonctionnel: /api/images/file/:filename
 *
 * - Si l'URL est externe (autre domaine), on la laisse telle quelle.
 * - Si c'est déjà /api/images/file/, on la normalise et on la retourne.
 */
export function resolveBackendImageUrl(input?: string | null): string {
	if (!input) return "";

	const apiOrigin = getApiOrigin();
	const imageBase = getBackendImageFileBaseUrl();

	// URL absolue
	if (/^https?:\/\//i.test(input)) {
		try {
			const u = new URL(input);
			// Laisser les URLs externes
			if (u.origin !== apiOrigin) return input;

			const filename = extractFilenameFromImagePath(u.pathname);
			return filename ? `${imageBase}/${filename}` : input;
		} catch {
			return input;
		}
	}

	// URL relative
	const filename = extractFilenameFromImagePath(input);
	if (filename) return `${imageBase}/${filename}`;

	// Fallback: si c'est un chemin relatif sur notre backend, le rendre absolu
	if (input.startsWith("/")) return `${apiOrigin}${input}`;
	return input;
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

