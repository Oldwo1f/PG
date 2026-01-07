// plugins/monaco.client.ts
export default defineNuxtPlugin(() => {
	if (typeof window !== "undefined") {
		// @ts-ignore
		window.MonacoEnvironment = {
			getWorkerUrl: function (moduleId: string, label: string) {
				// Use CDN for Monaco workers - works in both dev and production
				const monacoVersion = "0.52.2"; // Match package.json version
				const cdnBase = `https://cdn.jsdelivr.net/npm/monaco-editor@${monacoVersion}/min`;
				
				const paths: Record<string, string> = {
					editor: "vs/editor/editor.worker",
					json: "vs/language/json/json.worker",
					css: "vs/language/css/css.worker",
					html: "vs/language/html/html.worker",
					typescript: "vs/language/typescript/ts.worker",
				};

				const path = paths[label] || paths.editor;
				
				// Always use CDN for reliability
				return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
					self.MonacoEnvironment = { baseUrl: '${cdnBase}/' };
					importScripts('${cdnBase}/${path}.js');
				`)}`;
			},
		};
	}
});

