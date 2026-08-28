export type IsAny<T> = 0 extends 1 & NoInfer<T> ? true : false;
export type IsOptional<T> =
	IsAny<T> extends true
		? true
		: Extract<T, undefined> extends never
			? false
			: true;

declare global {
	interface Window {
		__NEXT_DATA__?: { env?: Record<string, string> };
		__NUXT__?: { env?: Record<string, string> };
		__VITE_ENV__?: Record<string, string>;
	}
}

export function detectClientId(providedClientId?: string): string | undefined {
	if (providedClientId) {
		return providedClientId;
	}

	if (typeof process !== "undefined" && process.env) {
		return (
			process.env.NEXT_PUBLIC_DATAMATE_CLIENT_ID ||
			process.env.NUXT_PUBLIC_DATAMATE_CLIENT_ID ||
			process.env.VITE_DATAMATE_CLIENT_ID ||
			process.env.REACT_APP_DATAMATE_CLIENT_ID
		);
	}

	if (typeof window !== "undefined") {
		const nextEnv = window.__NEXT_DATA__?.env?.NEXT_PUBLIC_DATAMATE_CLIENT_ID;
		if (nextEnv) {
			return nextEnv;
		}

		const nuxtEnv = window.__NUXT__?.env?.NUXT_PUBLIC_DATAMATE_CLIENT_ID;
		if (nuxtEnv) {
			return nuxtEnv;
		}

		const viteEnv = window.__VITE_ENV__?.VITE_DATAMATE_CLIENT_ID;
		if (viteEnv) {
			return viteEnv;
		}
	}

	return;
}
