import type { DatamateConfig } from "../src/core/types";

export const validConfig = {
	clientId: "site_example",
	trackWebVitals: true,
} satisfies DatamateConfig;

export const invalidConfig: DatamateConfig = {
	clientId: "site_example",
	// @ts-expect-error Browser configuration must never accept a secret.
	clientSecret: "do-not-ship-browser-secrets",
};
