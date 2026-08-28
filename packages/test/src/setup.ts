import { closeClickHouse } from "./clickhouse";
import { closePostgres, truncatePostgres } from "./db";
import { closeRedis, flushRedis } from "./redis";

export async function reset() {
	await Promise.all([truncatePostgres(), flushRedis()]);
}

export async function cleanup() {
	await Promise.all([closePostgres(), closeRedis(), closeClickHouse()]);
}
