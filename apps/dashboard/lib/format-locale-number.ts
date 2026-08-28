const LOCALE = "en-US" as const;

/** Stable number formatting for SSR + client (avoids locale mismatch hydration). */
export function formatLocaleNumber(value: number): string {
	return value.toLocaleString(LOCALE);
}
