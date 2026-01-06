# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Monaco Editor Worker Warning Fix

If you see the warning:

```
You must define a function MonacoEnvironment.getWorkerUrl or MonacoEnvironment.getWorker
```

**Solution:**

1. Create a directory `plugins` in `perfectgenerations/frontend/` if it does not exist.
2. Create a file `monaco.client.ts` in that directory with the following content:

```ts
// plugins/monaco.client.ts
if (typeof window !== "undefined") {
	window.MonacoEnvironment = {
		getWorkerUrl: function (moduleId, label) {
			return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        self.MonacoEnvironment = { baseUrl: '/' };
        importScripts('${location.origin}/node_modules/monaco-editor/min/vs/base/worker/workerMain.js');
      `)}`;
		},
	};
}
```

3. Nuxt will auto-import this plugin on the client side. This will remove the warning and enable Monaco Editor features.
