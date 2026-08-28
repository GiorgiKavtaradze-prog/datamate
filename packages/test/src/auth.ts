import { auth } from "@datamate/auth";
import { member as memberTable } from "@datamate/db/schema";
import { db } from "./db";
import { nextId } from "./factories/id";

export interface AuthUser {
	email: string;
	headers: Headers;
	id: string;
}

export async function signUp(
	overrides: { email?: string; name?: string; password?: string } = {}
): Promise<AuthUser> {
	const id = nextId("auth");
	const email = overrides.email ?? `${id}@test.local`;
	const name = overrides.name ?? `User ${id}`;
	const password = overrides.password ?? "test-password-123!";

	await auth.api.signUpEmail({ body: { email, name, password } });

	const res = await auth.api.signInEmail({
		body: { email, password },
		returnHeaders: true,
	});

	const sessionCookie = res.headers
		.getSetCookie()
		.find((c) => c.startsWith("datamate-dev.session_token="))
		?.split(";")[0];

	return {
		headers: new Headers(sessionCookie ? { cookie: sessionCookie } : {}),
		id: (res.response as { user?: { id?: string } })?.user?.id ?? "",
		email,
	};
}

export async function addToOrganization(
	userId: string,
	organizationId: string,
	role = "member"
) {
	const [row] = await db()
		.insert(memberTable)
		.values({
			id: nextId("member"),
			userId,
			organizationId,
			role,
			createdAt: new Date(),
		})
		.returning();
	return row;
}
