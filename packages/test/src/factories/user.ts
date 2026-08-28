import {
	session as sessionTable,
	user as userTable,
} from "@datamate/db/schema";
import { db } from "../db";
import { nextId } from "./id";

export async function insertUser(
	overrides: Partial<typeof userTable.$inferInsert> = {}
) {
	const id = nextId("user");
	const now = new Date();

	const [row] = await db()
		.insert(userTable)
		.values({
			id,
			name: `User ${id}`,
			email: `${id}@test.local`,
			emailVerified: true,
			status: "ACTIVE",
			role: "USER",
			createdAt: now,
			updatedAt: now,
			...overrides,
		})
		.returning();

	return row;
}

export async function insertSession(
	userId: string,
	overrides: Partial<typeof sessionTable.$inferInsert> = {}
) {
	const id = nextId("session");
	const now = new Date().toISOString();

	const [row] = await db()
		.insert(sessionTable)
		.values({
			id,
			userId,
			token: `token-${id}`,
			expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
			createdAt: now,
			updatedAt: now,
			...overrides,
		})
		.returning();

	return row;
}
