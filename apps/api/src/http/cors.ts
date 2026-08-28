import { config } from "@datamate/env/app";

const DATAMATE_HOST_RE = /(?:^|\.)datamate\.cc$/;
const allowedApiOrigins = new Set(config.cors.apiOrigins);

export function isAllowedApiOrigin(request: Request): boolean {
	const origin = request.headers.get("Origin");
	if (!origin) {
		return false;
	}

	try {
		const url = new URL(origin);
		return (
			DATAMATE_HOST_RE.test(url.hostname) || allowedApiOrigins.has(url.origin)
		);
	} catch {
		return false;
	}
}
