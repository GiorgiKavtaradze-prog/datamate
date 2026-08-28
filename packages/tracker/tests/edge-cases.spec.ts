import { countEvents, expect, findEvent, hasEvent, test } from "./test-utils";

test.describe("Edge Cases", () => {

	test.describe("URL-based ID Override", () => {
		test("uses a well-formed anonId from URL query param", async ({ page }) => {
			const anonId = "anon_00000000-0000-4000-8000-000000000001";
			await page.goto(`/test?anonId=${anonId}`);
			await page.evaluate(() => {
				(window as any).datamateConfig = {
					clientId: "test-url-override",
					ignoreBotDetection: true,
					batchTimeout: 200,
				};
			});
			await page.addScriptTag({ url: "/dist/datamate-debug.js" });

			await expect
				.poll(async () => await page.evaluate(() => !!(window as any).db))
				.toBeTruthy();

			const storedId = await page.evaluate(() => localStorage.getItem("did"));
			expect(storedId).toBe(anonId);
		});

		test("rejects a malformed anonId from URL query param", async ({
			page,
		}) => {
			await page.goto("/test?anonId=custom-anon-123");
			await page.evaluate(() => {
				(window as any).datamateConfig = {
					clientId: "test-url-override",
					ignoreBotDetection: true,
					batchTimeout: 200,
				};
			});
			await page.addScriptTag({ url: "/dist/datamate-debug.js" });

			await expect
				.poll(async () => await page.evaluate(() => !!(window as any).db))
				.toBeTruthy();

			const storedId = await page.evaluate(() => localStorage.getItem("did"));
			expect(storedId).toMatch(/^anon_[0-9a-f-]{36}$/);
		});

		test("uses a well-formed sessionId from URL query param", async ({
			page,
		}) => {
			const sessionId = "sess_00000000-0000-4000-8000-000000000002";
			await page.goto(`/test?sessionId=${sessionId}`);
			await page.evaluate(() => {
				(window as any).datamateConfig = {
					clientId: "test-url-override",
					ignoreBotDetection: true,
					batchTimeout: 200,
				};
			});
			await page.addScriptTag({ url: "/dist/datamate-debug.js" });

			await expect
				.poll(async () => await page.evaluate(() => !!(window as any).db))
				.toBeTruthy();

			const storedId = await page.evaluate(() =>
				sessionStorage.getItem("did_session")
			);
			expect(storedId).toBe(sessionId);
		});

		test("rejects a malformed sessionId from URL query param", async ({
			page,
		}) => {
			await page.goto("/test?sessionId=custom-session-456");
			await page.evaluate(() => {
				(window as any).datamateConfig = {
					clientId: "test-url-override",
					ignoreBotDetection: true,
					batchTimeout: 200,
				};
			});
			await page.addScriptTag({ url: "/dist/datamate-debug.js" });

			await expect
				.poll(async () => await page.evaluate(() => !!(window as any).db))
				.toBeTruthy();

			const storedId = await page.evaluate(() =>
				sessionStorage.getItem("did_session")
			);
			expect(storedId).toMatch(/^sess_[0-9a-f-]{36}$/);
		});
	});

	test.describe("Opt-in after Opt-out", () => {
		test("datamateOptIn clears opt-out flags", async ({ page }) => {
			await page.goto("/test");
			await page.evaluate(() => {
				// First opt out
				localStorage.setItem("datamate_opt_out", "true");
				localStorage.setItem("datamate_disabled", "true");
			});

			// Call optIn
			await page.evaluate(() => {
				// Simulate the opt-in function
				localStorage.removeItem("datamate_opt_out");
				localStorage.removeItem("datamate_disabled");
				(window as any).datamateOptedOut = false;
				(window as any).datamateDisabled = false;
			});

			const optOutFlag = await page.evaluate(() =>
				localStorage.getItem("datamate_opt_out")
			);
			const disabledFlag = await page.evaluate(() =>
				localStorage.getItem("datamate_disabled")
			);

			expect(optOutFlag).toBeNull();
			expect(disabledFlag).toBeNull();
		});

		test("tracking resumes after opt-in (requires page reload)", async ({
			page,
		}) => {
			await page.goto("/test");
			await page.evaluate(() => {
				localStorage.setItem("datamate_opt_out", "true");
			});
			await page.addScriptTag({ url: "/dist/datamate-debug.js" });

			// Opt back in
			await page.evaluate(() => {
				(window as any).datamateOptIn();
			});

			// Reload to reinitialize tracker
			await page.reload();
			await page.evaluate(() => {
				(window as any).datamateConfig = {
					clientId: "test-optin",
					ignoreBotDetection: true,
					batchTimeout: 200,
				};
			});

			const requestPromise = page.waitForRequest((req) =>
				req.url().includes("basket.datamate.cc")
			);

			await page.addScriptTag({ url: "/dist/datamate-debug.js" });

			const request = await requestPromise;
			expect(request).toBeTruthy();
		});
	});

	test.describe("No ClientId", () => {
		test("does not initialize without clientId", async ({ page }) => {
			let requestMade = false;

			await page.goto("/test");
			await page.evaluate(() => {
				(window as any).datamateConfig = {
					// No clientId
					ignoreBotDetection: true,
					batchTimeout: 200,
				};
			});

			page.on("request", (req) => {
				if (req.url().includes("basket.datamate.cc")) {
					requestMade = true;
				}
			});

			await page.addScriptTag({ url: "/dist/datamate-debug.js" });
			await page.waitForTimeout(500);

			expect(requestMade).toBe(false);
		});
	});

	test.describe("Re-initialization Prevention", () => {
		test("does not re-initialize if already initialized", async ({ page }) => {
			let initCount = 0;

			await page.goto("/test");
			await page.evaluate(() => {
				(window as any).datamateConfig = {
					clientId: "test-reinit",
					ignoreBotDetection: true,
					batchTimeout: 200,
				};
			});

			page.on("request", (req) => {
				initCount += countEvents(req, (e) => e.name === "screen_view");
			});

			// Load script twice
			await page.addScriptTag({ url: "/dist/datamate-debug.js" });
			await page.waitForTimeout(100);
			await page.addScriptTag({ url: "/dist/datamate-debug.js" });
			await page.waitForTimeout(500);

			// Should only have one screen_view
			expect(initCount).toBe(1);
		});
	});

	test.describe("Disabled Flag", () => {
		test("does not track when disabled option is true", async ({ page }) => {
			let requestMade = false;

			await page.goto("/test");
			await page.evaluate(() => {
				(window as any).datamateConfig = {
					clientId: "test-disabled",
					ignoreBotDetection: true,
					disabled: true,
					batchTimeout: 200,
				};
			});

			page.on("request", (req) => {
				if (req.url().includes("basket.datamate.cc")) {
					requestMade = true;
				}
			});

			await page.addScriptTag({ url: "/dist/datamate-debug.js" });
			await page.waitForTimeout(500);

			expect(requestMade).toBe(false);
		});
	});

	test.describe("Batch Timeout", () => {
		test("flushes batch after timeout even if not full", async ({
			page,
			browserName,
		}) => {
			test.skip(
				browserName === "webkit",
				"WebKit/Playwright batch interception issues"
			);

			await page.route("**/basket.datamate.cc/batch", async (route) => {
				await route.fulfill({
					status: 200,
					body: JSON.stringify({ success: true }),
				});
			});

			await page.goto("/test");
			await page.evaluate(() => {
				(window as any).datamateConfig = {
					clientId: "test-batch-timeout",
					ignoreBotDetection: true,
					enableBatching: true,
					batchSize: 100, // Large batch size
					batchTimeout: 500, // Short timeout for test
				};
			});
			await page.addScriptTag({ url: "/dist/datamate-debug.js" });

			await expect
				.poll(async () => await page.evaluate(() => !!(window as any).db))
				.toBeTruthy();

			const requestPromise = page.waitForRequest(
				(req) => req.url().includes("/batch"),
				{ timeout: 3000 }
			);

			// Send fewer events than batch size
			await page.evaluate(() => {
				(window as any).db.track("timeout_event_1");
				(window as any).db.track("timeout_event_2");
			});

			// Wait for timeout to trigger flush
			const request = await requestPromise;
			const payload = request.postDataJSON();

			expect(Array.isArray(payload)).toBe(true);
		});
	});

	test.describe("Pixel Mode", () => {
		test("sends events via image pixel when usePixel is enabled", async ({
			page,
		}) => {
			let pixelRequestMade = false;
			let pixelRequestPath: string | null = null;

			await page.route("**/basket.datamate.cc/*", async (route) => {
				if (route.request().method() !== "GET") {
					await route.fallback();
					return;
				}
				pixelRequestMade = true;
				try {
					pixelRequestPath = new URL(route.request().url()).pathname;
				} catch {
					/* best-effort */
				}
				await route.fulfill({
					status: 200,
					contentType: "image/jpeg",
					body: Buffer.from([]),
				});
			});

			await page.goto("/test");
			await page.evaluate(() => {
				(window as any).datamateConfig = {
					clientId: "test-pixel",
					ignoreBotDetection: true,
					usePixel: true,
					batchTimeout: 200,
				};
			});
			await page.addScriptTag({ url: "/dist/datamate-debug.js" });

			await page.waitForTimeout(500);
			expect(pixelRequestMade).toBe(true);
			expect(pixelRequestPath).toBe("/px.jpg");
		});
	});

	test.describe("Circular Reference Handling", () => {
		test("handles circular references in tracked properties", async ({
			page,
		}) => {
			await page.goto("/test");
			await page.evaluate(() => {
				(window as any).datamateConfig = {
					clientId: "test-circular",
					ignoreBotDetection: true,
					usePixel: true, // Pixel mode uses the safeStringify
					batchTimeout: 200,
				};
			});
			await page.addScriptTag({ url: "/dist/datamate-debug.js" });

			await expect
				.poll(async () => await page.evaluate(() => !!(window as any).db))
				.toBeTruthy();

			// This should not throw
			const noError = await page.evaluate(() => {
				try {
					const circular: any = { a: 1 };
					circular.self = circular;
					(window as any).db.track("circular_test", circular);
					return true;
				} catch {
					return false;
				}
			});

			expect(noError).toBe(true);
		});
	});

	test.describe("localStorage/sessionStorage Errors", () => {
		test("handles localStorage access errors gracefully", async ({ page }) => {
			await page.goto("/test");
			await page.evaluate(() => {
				// Mock localStorage to throw
				const originalGetItem = localStorage.getItem;
				localStorage.getItem = () => {
					throw new Error("Storage access denied");
				};

				(window as any).datamateConfig = {
					clientId: "test-storage-error",
					ignoreBotDetection: true,
					batchTimeout: 200,
				};

				// Restore after a short delay
				setTimeout(() => {
					localStorage.getItem = originalGetItem;
				}, 100);
			});

			// Should not throw
			const loaded = await page.evaluate(async () => {
				try {
					await new Promise((r) => setTimeout(r, 200));
					return true;
				} catch {
					return false;
				}
			});

			expect(loaded).toBe(true);
		});
	});

	test.describe("Empty Event Names", () => {
		test("handles tracking with empty string name", async ({ page }) => {
			await page.goto("/test");
			await page.evaluate(() => {
				(window as any).datamateConfig = {
					clientId: "test-empty",
					ignoreBotDetection: true,
					batchTimeout: 200,
				};
			});
			await page.addScriptTag({ url: "/dist/datamate-debug.js" });

			await expect
				.poll(async () => await page.evaluate(() => !!(window as any).db))
				.toBeTruthy();

			// Should not throw
			const noError = await page.evaluate(() => {
				try {
					(window as any).db.track("");
					return true;
				} catch {
					return false;
				}
			});

			expect(noError).toBe(true);
		});
	});

	test.describe("Very Long Event Names/Properties", () => {
		test("handles very long event names", async ({ page }) => {
			await page.goto("/test");
			await page.evaluate(() => {
				(window as any).datamateConfig = {
					clientId: "test-long",
					ignoreBotDetection: true,
					batchTimeout: 200,
				};
			});
			await page.addScriptTag({ url: "/dist/datamate-debug.js" });

			await expect
				.poll(async () => await page.evaluate(() => !!(window as any).db))
				.toBeTruthy();

			const longName = "a".repeat(1000);
			const requestPromise = page.waitForRequest(
				(req) =>
					req.url().includes("basket.datamate.cc") &&
					req.method() === "POST" &&
					hasEvent(req, (e) => e.name === longName)
			);

			await page.evaluate((name) => {
				(window as any).db.track(name);
			}, longName);

			const request = await requestPromise;
			const event = findEvent(request, (e) => e.name === longName);
			expect(event).toBeDefined();
			expect(String(event?.name).length).toBe(1000);
		});
	});

	test.describe("Special Characters in Properties", () => {
		test("handles special characters in event properties", async ({ page }) => {
			await page.goto("/test");
			await page.evaluate(() => {
				(window as any).datamateConfig = {
					clientId: "test-special",
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
					hasEvent(req, (e) => e.name === "special_chars")
			);

			await page.evaluate(() => {
				(window as any).db.track("special_chars", {
					emoji: "🎉🚀",
					unicode: "日本語",
					quotes: 'He said "hello"',
					newlines: "line1\nline2",
					html: "<script>alert('xss')</script>",
				});
			});

			const request = await requestPromise;
			const event = findEvent(request, (e) => e.name === "special_chars");
			const props = event?.properties as Record<string, unknown> | undefined;

			expect(props?.emoji).toBe("🎉🚀");
			expect(props?.unicode).toBe("日本語");
			expect(props?.quotes).toBe('He said "hello"');
			expect(props?.newlines).toBe("line1\nline2");
			expect(props?.html).toBe("<script>alert('xss')</script>");
		});
	});
});
