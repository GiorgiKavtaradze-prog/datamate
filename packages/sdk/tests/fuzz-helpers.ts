/**
 * Tunable iteration counts for fuzz / stress tests (single env var).
 * CI can set SDK_FUZZ_ITERATIONS=200 to keep runs shorter.
 */
export function getFuzzIterations(): number {
	const raw = process.env.SDK_FUZZ_ITERATIONS;
	if (raw !== undefined && raw !== "") {
		const n = Number(raw);
		if (Number.isFinite(n)) {
			return Math.min(10_000, Math.max(50, Math.floor(n)));
		}
	}
	return 500;
}

export function getStressIterations(): number {
	const raw = process.env.SDK_STRESS_ITERATIONS;
	if (raw !== undefined && raw !== "") {
		const n = Number(raw);
		if (Number.isFinite(n)) {
			return Math.min(2000, Math.max(20, Math.floor(n)));
		}
	}
	return 200;
}
