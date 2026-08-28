import { publicConfig } from "@datamate/env/public";

export const STATUS_URL = publicConfig.urls.status;

export const DATAMATE_URL = "https://www.datamate.cc";
export const DATAMATE_UPTIME_URL = `${DATAMATE_URL}/uptime`;

export function getStatusPageUrl(slug: string): string {
	return `${STATUS_URL}/${slug}`;
}
