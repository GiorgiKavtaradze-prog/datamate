import { join } from "node:path";
import { file as BunFile, build, serve } from "bun";

const PORT = 3034;
const BASE_DIR = import.meta.dir;
const DIST_DIR = join(BASE_DIR, "test-dist");

async function buildTestBundle() {
	console.log("[Test Server] Building SDK test bundle...");

	const result = await build({
		entrypoints: [join(BASE_DIR, "test-entry.ts")],
		outdir: DIST_DIR,
		target: "browser",
		format: "esm",
		minify: false,
		sourcemap: "inline",
	});

	if (!result.success) {
		console.error("[Test Server] Build failed:", result.logs);
		process.exit(1);
	}

	console.log("[Test Server] Bundle built successfully");
}

await buildTestBundle();

serve({
	port: PORT,
	hostname: "127.0.0.1",
	async fetch(req) {
		const url = new URL(req.url);

		if (url.pathname === "/" || url.pathname === "/test") {
			return new Response(
				`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>SDK Test Page</title>
</head>
<body>
	<h1>SDK Test Page</h1>
	<script type="module" src="/test-dist/test-entry.js"></script>
</body>
</html>`,
				{ headers: { "Content-Type": "text/html" } }
			);
		}

		if (url.pathname.startsWith("/test-dist/")) {
			const filePath = join(BASE_DIR, url.pathname);
			const f = BunFile(filePath);
			if (await f.exists()) {
				return new Response(f, {
					headers: { "Content-Type": "application/javascript" },
				});
			}
			return new Response("Not found", { status: 404 });
		}

		return new Response("Not found", { status: 404 });
	},
});

console.log(`[Test Server] Running on http://127.0.0.1:${PORT}`);
