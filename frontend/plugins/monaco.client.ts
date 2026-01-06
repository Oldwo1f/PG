// plugins/monaco.client.ts
export default defineNuxtPlugin(() => {
	if (typeof window !== "undefined") {
		// @ts-ignore
		window.MonacoEnvironment = {
			getWorkerUrl: function (moduleId: string, label: string) {
				// Use data URL approach that works in both dev and production
				const getWorker = (workerId: string, label: string) => {
					const paths: Record<string, string> = {
						editor: "vs/editor/editor.worker",
						json: "vs/language/json/json.worker",
						css: "vs/language/css/css.worker",
						html: "vs/language/html/html.worker",
						typescript: "vs/language/typescript/ts.worker",
					};

					const path = paths[label] || paths.editor;
					return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
						self.MonacoEnvironment = { baseUrl: '${window.location.origin}/node_modules/monaco-editor/min/' };
						importScripts('${window.location.origin}/node_modules/monaco-editor/min/${path}.js');
					`)}`;
				};

				return getWorker(moduleId, label);
			},
		};
	}
});

