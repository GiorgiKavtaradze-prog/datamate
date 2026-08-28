import {
	addImportsDir,
	addPlugin,
	addTypeTemplate,
	createResolver,
	defineNuxtModule,
	logger,
} from "@nuxt/kit";
import type { FlagsConfig } from "@datamate/sdk/vue";

export interface ModuleOptions {
	apiUrl?: string;
	clientId?: string;
	debug?: boolean;
	disabled?: boolean;
	enableBatching?: boolean;
	enableRetries?: boolean;
	flags?: FlagsConfig;
	ignoreBotDetection?: boolean;
	maskPatterns?: string[];
	samplingRate?: number;
	scriptUrl?: string;
	skipPatterns?: string[];
	trackAttributes?: boolean;
	trackErrors?: boolean;
	trackHashChanges?: boolean;
	trackInteractions?: boolean;
	trackOutgoingLinks?: boolean;
	/** @deprecated Use trackWebVitals. This remains as a compatibility alias. */
	trackPerformance?: boolean;
	trackWebVitals?: boolean;
	usePixel?: boolean;
}

declare module "nuxt/schema" {
	interface PublicRuntimeConfig {
		datamate: ModuleOptions;
	}
}

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: "@datamate/nuxt",
		configKey: "datamate",
		compatibility: { nuxt: ">=3" },
	},
	defaults: {},
	setup(options, nuxt) {
		const resolver = createResolver(import.meta.url);

		const clientId =
			options.clientId ||
			process.env.NUXT_PUBLIC_DATAMATE_CLIENT_ID ||
			process.env.VITE_DATAMATE_CLIENT_ID;

		if (!(clientId || options.disabled)) {
			logger.warn(
				"[@datamate/nuxt] No clientId found. Set `datamate.clientId` in nuxt.config.ts or provide the `NUXT_PUBLIC_DATAMATE_CLIENT_ID` environment variable."
			);
		}

		nuxt.options.runtimeConfig.public.datamate = {
			...options,
			clientId,
			// Inherit the top-level clientId into flags config so users don't repeat it.
			// A flags-specific clientId takes priority if explicitly set.
			flags: options.flags
				? { ...options.flags, clientId: options.flags.clientId ?? clientId }
				: undefined,
		};

		// Preconnect to the CDN so the tracker script loads as fast as possible.
		// This runs server-side and appears in the initial HTML — zero plugin overhead.
		if (!options.disabled) {
			let cdnOrigin = "https://cdn.datamate.cc";
			if (options.scriptUrl) {
				try {
					cdnOrigin = new URL(options.scriptUrl).origin;
				} catch {
					logger.warn(
						`[@datamate/nuxt] Invalid scriptUrl "${options.scriptUrl}" — falling back to default CDN.`
					);
				}
			}

			nuxt.options.app.head.link = [
				...(nuxt.options.app.head.link ?? []),
				{ rel: "dns-prefetch", href: cdnOrigin },
				{ rel: "preconnect", href: cdnOrigin },
			];
		}

		// Single client-only plugin — script injection, SPA tracking, flags
		addPlugin({
			src: resolver.resolve("./runtime/plugin.client"),
			mode: "client",
		});

		// Auto-import all composables from the composables directory
		addImportsDir(resolver.resolve("./runtime/composables"));

		// TypeScript augmentation: $datamate on NuxtApp and Vue component instances
		addTypeTemplate({
			filename: "types/datamate.d.ts",
			getContents: () => `
import type {
  clear,
  flush,
  getAnonymousId,
  getSessionId,
  getTracker,
  getTrackingIds,
  getTrackingParams,
  isTrackerAvailable,
  track,
  trackError,
} from '@datamate/sdk'

interface DatamateInstance {
  track: typeof track
  trackError: typeof trackError
  clear: typeof clear
  flush: typeof flush
  getTracker: typeof getTracker
  isTrackerAvailable: typeof isTrackerAvailable
  getAnonymousId: typeof getAnonymousId
  getSessionId: typeof getSessionId
  getTrackingIds: typeof getTrackingIds
  getTrackingParams: typeof getTrackingParams
  setGlobalProperties: (properties: Record<string, unknown>) => void
  screenView: (properties?: Record<string, unknown>) => void
}

declare module '#app' {
  interface NuxtApp {
    $datamate: DatamateInstance
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $datamate: DatamateInstance
  }
}

export {}
`,
		});
	},
});
