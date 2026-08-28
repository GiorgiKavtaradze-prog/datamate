import { createClient } from "@clickhouse/client";
import { CLICKHOUSE_OPTIONS, TABLE_NAMES } from "@datamate/db/clickhouse";

const URL = "http://default:@localhost:8123/datamate_analytics_test";

let instance: ReturnType<typeof createClient> | null = null;

export function clickhouse() {
	if (!instance) {
		instance = createClient({ url: URL, ...CLICKHOUSE_OPTIONS });
	}
	return instance;
}

export async function truncateClickHouse() {
	const ch = clickhouse();
	for (const table of Object.values(TABLE_NAMES)) {
		await ch.command({
			query: `TRUNCATE TABLE IF EXISTS ${table}`,
			clickhouse_settings: { wait_end_of_query: 1 },
		});
	}
}

export async function closeClickHouse() {
	if (instance) {
		await instance.close();
		instance = null;
	}
}
