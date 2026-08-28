/**
 * Pure scroll-depth calculations shared by the browser listener and unit tests.
 */

export function scrollableRangePx(
	documentScrollHeight: number,
	viewportInnerHeight: number
): number {
	const doc = Number.isFinite(documentScrollHeight) ? documentScrollHeight : 0;
	const vh = Number.isFinite(viewportInnerHeight) ? viewportInnerHeight : 0;
	return doc - vh;
}

/**
 * Returns 0–100 inclusive. No scrollable overflow ⇒ 100% (fully in view).
 */
export function scrollDepthPercentFromScrollY(
	scrollY: number,
	scrollableRangePxValue: number
): number {
	if (scrollableRangePxValue <= 0) {
		return 100;
	}
	const y = Number.isFinite(scrollY) ? Math.max(0, scrollY) : 0;
	const raw = (y / scrollableRangePxValue) * 100;
	return Math.min(100, Math.round(raw));
}

export function updateMaxScrollDepth(
	currentMax: number,
	scrollY: number,
	documentScrollHeight: number,
	viewportInnerHeight: number
): number {
	const range = scrollableRangePx(documentScrollHeight, viewportInnerHeight);
	const next = scrollDepthPercentFromScrollY(scrollY, range);
	return Math.max(currentMax, next);
}
