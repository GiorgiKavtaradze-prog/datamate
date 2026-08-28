import {
	member as memberTable,
	organization as orgTable,
} from "@datamate/db/schema";
import { db } from "../db";
import { nextId } from "./id";

export async function insertOrganization(
	overrides: Partial<typeof orgTable.$inferInsert> = {}
) {
	const id = nextId("org");

	const [row] = await db()
		.insert(orgTable)
		.values({
			id,
			name: `Org ${id}`,
			slug: id,
			createdAt: new Date(),
			...overrides,
		})
		.returning();

	return row;
}

export async function insertMember(opts: {
	organizationId: string;
	userId: string;
	role?: string;
}) {
	const [row] = await db()
		.insert(memberTable)
		.values({
			id: nextId("member"),
			organizationId: opts.organizationId,
			userId: opts.userId,
			role: opts.role ?? "owner",
			createdAt: new Date(),
		})
		.returning();

	return row;
}
