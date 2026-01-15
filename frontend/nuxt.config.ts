// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "pathe";
const apiBaseEnv = process.env.NUXT_PUBLIC_API_BASE || "";
const proxyTargetEnv = process.env.NUXT_API_PROXY_TARGET || "";
const shouldProxyApi =
	!!proxyTargetEnv && (apiBaseEnv === "/api" || apiBaseEnv === "/api/" || apiBaseEnv.startsWith("/api"));

function normalizeNoTrailingSlash(url: string): string {
	return url.endsWith("/") ? url.slice(0, -1) : url;
}

export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: [
		"@nuxtjs/tailwindcss",
		"@nuxt/image",
		"@nuxt/test-utils/module",
		"@pinia/nuxt",
	],
	typescript: {
		strict: true,
	},
	css: ["~/assets/icons/phosphor-duotone.css"],
	app: {
		layoutTransition: { name: "layout", mode: "out-in" },
		pageTransition: { name: "page", mode: "out-in" },
		head: {
			title: "Perfect Generations",
			meta: [
				{ charset: "utf-8" },
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1",
				},
				{
					name: "description",
					content: "Générez des images parfaites pour votre marque",
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
			apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:3001/api",
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
		port: 3000,
		host: "localhost",
	},
	/**
	 * Expose local template assets (fonts) under a stable URL.
	 *
	 * This is critical for the Studio iframe `srcdoc` preview:
	 * - templates often reference fonts with relative paths like `../assets/fonts/...`
	 * - in Docker production, only `.output` is shipped, so we must copy/serve these files via Nitro
	 */
	nitro: {
		publicAssets: [
			{
				dir: resolve("./assets/fonts"),
				baseURL: "/assets/fonts",
			},
		],
	},
});
