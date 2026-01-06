// https://nuxt.com/docs/api/configuration/nuxt-config
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
			apiBase:
				process.env.NODE_ENV === "production"
					? "https://api.perfectgenerations.com/api"
					: "http://localhost:3001/api",
		},
	},
	devServer: {
		port: 3002,
		host: "localhost",
	},
});
