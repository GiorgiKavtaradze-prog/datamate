import { describe, expect, it } from "bun:test";
import { buildAppHomeView } from "@/slack/app-home";
import { SLACK_SUGGESTED_PROMPTS } from "@/slack/messages";

describe("buildAppHomeView", () => {
	it("builds a home view with a header and blocks", () => {
		const view = buildAppHomeView();
		expect(view.type).toBe("home");
		const blocks = view.blocks as Array<Record<string, unknown>>;
		expect(blocks[0]).toMatchObject({ type: "header" });
		expect((blocks[0].text as { text: string }).text).toBe("Datamate");
		expect(blocks.length).toBeGreaterThan(3);
	});

	it("includes quick-action buttons that deep-link into the dashboard", () => {
		const view = buildAppHomeView();
		const blocks = view.blocks as Array<Record<string, unknown>>;
		const actions = blocks.find((b) => b.type === "actions");
		expect(actions).toBeDefined();
		const buttons = actions?.elements as Array<{ url: string }>;
		expect(buttons.length).toBeGreaterThan(0);
			const dashboardOrigin = new URL("https://app.datamate.cc").origin;
			expect(buttons.every((button) => new URL(button.url).origin === dashboardOrigin)).toBe(
				true
			);
	});

	it("renders connected sites when provided, and omits the block when empty", () => {
		const withSites = buildAppHomeView([
			{ domain: "app.datamate.cc", name: "Dashboard" },
			{ domain: "datamate.cc", name: null },
		]);
		const text = JSON.stringify(withSites);
		expect(text).toContain("Your connected sites");
		expect(text).toContain("*Dashboard* — app.datamate.cc");
		expect(text).toContain("• datamate.cc");

		expect(JSON.stringify(buildAppHomeView([]))).not.toContain(
			"Your connected sites"
		);
	});

	it("lists the suggested prompts", () => {
		const view = buildAppHomeView();
		const text = JSON.stringify(view);
		for (const prompt of SLACK_SUGGESTED_PROMPTS) {
			expect(text).toContain(prompt.message);
		}
	});
});
