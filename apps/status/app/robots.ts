import type { MetadataRoute } from "next";
import { STATUS_URL } from "@/lib/status-url";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/_next/", "/*.json"],
		},
		sitemap: `${STATUS_URL}/sitemap.xml`,
	};
}
