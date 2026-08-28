import { expect, findEvent, hasEvent, test } from "./test-utils";

test.describe("General Tracking", () => {

	test("loads and initializes successfully via window.datamateConfig", async ({
		page,
	}) => {
		await page.goto("/test");
		await page.evaluate(() => {
			(window as any).datamateConfig = {
				clientId: "test-client-id",
				ignoreBotDetection: true,
				batchTimeout: 200,
			};
		});
		await page.addScriptTag({ url: "/dist/datamate-debug.js" });

		await expect
			.poll(async () => await page.evaluate(() => !!(window as any).datamate))
			.toBeTruthy();

		const tracker = await page.evaluate(
			() => (window as any).datamate.options
		);
		expect(tracker.clientId).toBe("test-client-id");
	});

	test("initializes via data- attributes", async ({ page }) => {
		await page.goto("/test");
		await page.evaluate(() => {
			const script = document.createElement("script");
			script.src = "/dist/datamate-debug.js";
			script.setAttribute("data-client-id", "data-attr-client");
			script.setAttribute("data-ignore-bot-detection", "true");
			document.body.appendChild(script);
		});

		await expect
			.poll(async () => await page.evaluate(() => !!(window as any).datamate))
			.toBeTruthy();

		const tracker = await page.evaluate(
			() => (window as any).datamate.options
		);
		expect(tracker.clientId).toBe("data-attr-client");
		expect(tracker.ignoreBotDetection).toBe(true);
	});

	test("initializes via query parameters", async ({ page }) => {
		await page.goto("/test");
		await page.evaluate(() => {
			const script = document.createElement("script");
			script.src =
				"/dist/datamate-debug.js?clientId=query-param-client&ignoreBotDetection=true";
			document.body.appendChild(script);
		});

		await expect
			.poll(async () => await page.evaluate(() => !!(window as any).datamate))
			.toBeTruthy();

		const tracker = await page.evaluate(
			() => (window as any).datamate.options
		);
		expect(tracker.clientId).toBe("query-param-client");
		expect(tracker.ignoreBotDetection).toBe(true);
	});

	test("sends screen_view event on load", async ({ page }) => {
		// Match exactly the root endpoint for track events
		const requestPromise = page.waitForRequest(
			(request) =>
				request.url().includes("basket.datamate.cc") &&
				request.method() === "POST" &&
				hasEvent(request, (e) => e.name === "screen_view")
		);

		await page.goto("/test");
		await page.evaluate(() => {
			(window as any).datamateConfig = {
				clientId: "test-client-id",
				ignoreBotDetection: true,
				batchTimeout: 200,
			};
		});
		await page.addScriptTag({ url: "/dist/datamate-debug.js" });

		const request = await requestPromise;
		const event = findEvent(request, (e) => e.name === "screen_view");
		expect(event).toBeTruthy();
		expect(event?.name).toBe("screen_view");
		expect(event?.anonymousId).toBeTruthy();
	});

	test("tracks custom events via window.db", async ({ page }) => {
		await page.goto("/test");
		await page.evaluate(() => {
			(window as any).datamateConfig = {
				clientId: "test-client-id",
				ignoreBotDetection: true,
				batchTimeout: 200,
			};
		});
		await page.addScriptTag({ url: "/dist/datamate-debug.js" });

		await expect
			.poll(async () => await page.evaluate(() => !!(window as any).db))
			.toBeTruthy();

		const requestPromise = page.waitForRequest(
			(req) =>
				req.url().includes("basket.datamate.cc") &&
				req.method() === "POST" &&
				hasEvent(req, (e) => e.name === "custom_click")
		);

		await page.evaluate(() => {
			(window as any).db.track("custom_click", { foo: "bar" });
		});

		const request = await requestPromise;
		const event = findEvent(request, (e) => e.name === "custom_click");
		expect(event).toBeTruthy();
		const props = event?.properties as Record<string, unknown> | undefined;
		expect(props?.foo).toBe("bar");
	});

	test("blocks tracking when bot detection is active (default)", async ({
		page,
	}) => {
		// Should NOT send a request if ignoreBotDetection is not set (default false)
		// We need to make sure the browser context actually looks like a bot to Playwright (headless usually does)
		// or we rely on the fact that we are NOT setting ignoreBotDetection: true.
		// However, standard Playwright headless chrome matches HEADLESS_CHROME_REGEX.

		let requestSent = false;
		page.on("request", (req) => {
			if (req.url().includes("/basket.datamate.cc/")) {
				requestSent = true;
			}
		});

		await page.goto("/test");
		await page.evaluate(() => {
			(window as any).datamateConfig = { clientId: "test-client-id" }; // ignoreBotDetection defaults to false
		});
		await page.addScriptTag({ url: "/dist/datamate-debug.js" });

		// Wait a bit to ensure no request is fired
		await page.waitForTimeout(1000);

		expect(requestSent).toBe(false);
	});
});
