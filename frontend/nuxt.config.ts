// https://nuxt.com/docs/api/configuration/nuxt-config
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
	devServer: {
		port: 3000,
		host: "localhost",
	},
});
