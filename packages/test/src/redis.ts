import Redis from "ioredis";

const DEFAULT_REDIS_URL = "redis://localhost:6379/1";

function redisUrl(): string {
	return process.env.REDIS_URL ?? DEFAULT_REDIS_URL;
}

let instance: Redis | null = null;

export function redis() {
	if (!instance) {
		instance = new Redis(redisUrl(), {
			connectTimeout: 5000,
			commandTimeout: 3000,
			maxRetriesPerRequest: 1,
		});
		instance.on("error", () => {});
	}
	return instance;
}

export async function flushRedis() {
	await redis().flushdb();
}

export async function closeRedis() {
	if (instance) {
		await instance.quit();
		instance = null;
	}
}
