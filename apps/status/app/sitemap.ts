import type { MetadataRoute } from "next";
import { getStatusPageUrl } from "@/lib/status-url";
import { rpcClient } from "@/lib/orpc";

export const dynamic = "force-dynamic";
export const revalidate = 86_400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	if (process.env.NODE_ENV === "development") {
		return [];
	}

	try {
		const pages = await rpcClient.statusPage.listPublic();

		return pages.map((page) => ({
			url: getStatusPageUrl(page.slug),
			lastModified: page.updatedAt,
			changeFrequency: "daily",
			priority: 0.7,
		}));
	} catch {
		return [];
	}
}
