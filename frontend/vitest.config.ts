import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "url";

export default defineConfig({
	plugins: [vue()],
	test: {
		globals: true,
		environment: "jsdom",
		include: ["**/*.{test,spec}.{js,ts,jsx,tsx}"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/",
				".nuxt/",
				"coverage/",
				"**/*.d.ts",
				"**/*.config.ts",
				"**/types.ts",
			],
		},
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./", import.meta.url)),
		},
	},
});
