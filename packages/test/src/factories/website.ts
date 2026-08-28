import { websites } from "@datamate/db/schema";
import { db } from "../db";
import { nextId } from "./id";

export async function insertWebsite(
	overrides: Partial<typeof websites.$inferInsert> & { organizationId: string }
) {
	const id = nextId("website");

	const [row] = await db()
		.insert(websites)
		.values({
			id,
			domain: `${id}.example.com`,
			name: `Site ${id}`,
			status: "ACTIVE",
			isPublic: false,
			...overrides,
		})
		.returning();

	return row;
}
