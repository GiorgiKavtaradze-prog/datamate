import { afterAll, beforeEach, describe, expect, mock, test } from "bun:test";
import * as actualDb from "@datamate/db";
import * as actualSchema from "@datamate/db/schema";
import * as actualRedis from "@datamate/redis";
import * as actualEvlog from "evlog";

const monitors = [{ granularity: "five_minutes", id: "schedule-1" }];
const upsertJobScheduler = mock(async () => undefined);
const dbSelect = mock(() => ({
	from: () => ({ where: async () => monitors }),
}));
const logInfo = mock(() => {});

mock.module("@datamate/db", () => ({
	...actualDb,
	db: { select: dbSelect },
	eq: mock(() => undefined),
}));
mock.module("@datamate/db/schema", () => ({
	...actualSchema,
	uptimeSchedules: {
		granularity: "granularity",
		id: "id",
		isPaused: "isPaused",
	},
}));
mock.module("@datamate/redis", () => ({
	...actualRedis,
	getUptimeQueue: () => ({ upsertJobScheduler }),
	UPTIME_CHECK_JOB_NAME: "uptime-check",
	UPTIME_JOB_OPTIONS: { attempts: 1_000_000 },
	uptimeSchedulerId: (scheduleId: string) => `uptime-${scheduleId}`,
}));
mock.module("evlog", () => ({
	...actualEvlog,
	log: { error: mock(() => {}), info: logInfo },
}));

const { syncSchedulers } = await import("./sync-schedulers");

beforeEach(() => {
	dbSelect.mockClear();
	logInfo.mockClear();
	upsertJobScheduler.mockClear();
});

afterAll(() => {
	mock.module("@datamate/db", () => actualDb);
	mock.module("@datamate/db/schema", () => actualSchema);
	mock.module("@datamate/redis", () => actualRedis);
	mock.module("evlog", () => actualEvlog);
});

describe("syncSchedulers", () => {
	test("upserts every active scheduler with current durable job options", async () => {
		await syncSchedulers();

		expect(upsertJobScheduler).toHaveBeenCalledWith(
			"uptime-schedule-1",
			{ pattern: "*/5 * * * *" },
			{
				data: { scheduleId: "schedule-1", trigger: "scheduled" },
				name: "uptime-check",
				opts: { attempts: 1_000_000 },
			}
		);
		expect(logInfo).toHaveBeenCalledWith(
			expect.objectContaining({ failed: 0, total: 1, upserted: 1 })
		);
	});
});
