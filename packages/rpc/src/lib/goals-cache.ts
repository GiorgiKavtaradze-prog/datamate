import {
	createDrizzleCache,
	invalidateAgentContextSnapshotsForWebsite,
	redis,
} from "@datamate/redis";

const cache = createDrizzleCache({ redis, namespace: "goals" });

export async function invalidateGoalsCache(websiteId: string): Promise<void> {
	await Promise.allSettled([
		cache.invalidateByTables(["goals"]),
		invalidateAgentContextSnapshotsForWebsite(websiteId),
	]);
}
