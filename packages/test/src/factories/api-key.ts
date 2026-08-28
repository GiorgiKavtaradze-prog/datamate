import { apikey } from "@datamate/db/schema";
import { generateKey, hashKey } from "keypal";
import { db } from "../db";
import { nextId } from "./id";

export async function insertApiKey(
	overrides: Partial<typeof apikey.$inferInsert> & { organizationId: string }
) {
	const id = nextId("key");
	const secret = generateKey({ prefix: "dbdy_", length: 48 });
	const keyHash = hashKey(secret);

	const [row] = await db()
		.insert(apikey)
		.values({
			id,
			name: `Key ${id}`,
			prefix: "dbdy",
			start: secret.slice(0, 8),
			keyHash,
			type: "user",
			scopes: [],
			enabled: true,
			rateLimitEnabled: false,
			...overrides,
		})
		.returning();

	return { ...row, secret };
}
