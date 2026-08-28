import { expect } from "bun:test";

export async function expectCode(promise: Promise<unknown>, code: string) {
	try {
		await promise;
		throw new Error(`Expected ${code} but resolved`);
	} catch (e: any) {
		expect(e.code).toBe(code);
	}
}
