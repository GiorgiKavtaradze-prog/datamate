import { headers } from "next/headers";
import { getDemoEmbedOrigin, hostFromNextHeaders } from "@/lib/demo-embed-url";

export async function DemoPreconnectLinks() {
	const origin = getDemoEmbedOrigin(hostFromNextHeaders(await headers()));
	if (
		origin.startsWith("http://localhost") ||
		origin.startsWith("http://127.0.0.1")
	) {
		return null;
	}

	return <link crossOrigin="anonymous" href={origin} rel="preconnect" />;
}
