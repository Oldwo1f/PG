// https://nuxt.com/docs/api/configuration/nuxt-config
const apiBaseEnv = process.env.NUXT_PUBLIC_API_BASE || "";
const proxyTargetEnv = process.env.NUXT_API_PROXY_TARGET || "";
/**
 * If a proxy target is provided, default to /api automatically to avoid CORS
 * and reduce local dev misconfiguration (you can still override via NUXT_PUBLIC_API_BASE).
 */
const effectiveApiBase =
	apiBaseEnv || (proxyTargetEnv ? "/api" : "http://localhost:3001/api");
const shouldProxyApi =
	!!proxyTargetEnv &&
	(effectiveApiBase === "/api" ||
		effectiveApiBase === "/api/" ||
		effectiveApiBase.startsWith("/api"));

function normalizeNoTrailingSlash(url: string): string {
	return url.endsWith("/") ? url.slice(0, -1) : url;
}

export default defineNuxtConfig({
	devtools: { enabled: true },
	compatibilityDate: "2025-07-01",
	modules: [
		"@nuxtjs/tailwindcss",
		"@nuxt/image",
		"@nuxt/test-utils/module",
		"@pinia/nuxt",
	],
	typescript: {
		strict: true,
	},
	css: ["~/assets/css/main.css"],
	app: {
		layoutTransition: { name: "layout", mode: "out-in" },
		pageTransition: { name: "page", mode: "out-in" },
		head: {
			title: "Perfect Generations - Administration",
			meta: [
				{ charset: "utf-8" },
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1",
				},
				{
					name: "description",
					content: "Dashboard d'administration - Perfect Generations",
				},
			],
			link: [
				{
					rel: "stylesheet",
					href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;600;700&display=swap",
				},
			],
		},
	},
	runtimeConfig: {
		public: {
			apiBase: effectiveApiBase,
		},
	},
	/**
	 * Dev proxy (avoid CORS when developing locally against a remote backend):
	 *
	 *   export NUXT_PUBLIC_API_BASE="/api"
	 *   export NUXT_API_PROXY_TARGET="https://backendperfectgeneration.aito-flow.com"
	 *
	 * The browser calls /api/** on localhost, Nuxt proxies to {target}/api/**.
	 */
	routeRules: shouldProxyApi
		? {
				"/api/**": {
					proxy: `${normalizeNoTrailingSlash(proxyTargetEnv)}/api/**`,
				},
			}
		: {},
	devServer: {
		port: 3002,
		host: "localhost",
	},
});
