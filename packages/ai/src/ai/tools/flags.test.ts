import { describe, expect, test } from "bun:test";
import { userRuleSchema } from "@datamate/shared/flags";
import { createUserTargetRule } from "./flag-rules";

describe("flag tools", () => {
	test("creates batch email targeting rules", () => {
		const rule = createUserTargetRule("email", [
			"issa@datamate.cc",
			"qais@datamate.cc",
		]);

		expect(userRuleSchema.safeParse(rule).success).toBe(true);
		expect(rule).toEqual({
			batch: true,
			batchValues: ["issa@datamate.cc", "qais@datamate.cc"],
			enabled: true,
			operator: "in",
			type: "email",
			values: ["issa@datamate.cc", "qais@datamate.cc"],
		});
	});
});
