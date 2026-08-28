import type { authClient } from "@datamate/auth/client";

export type Organization = NonNullable<
	ReturnType<typeof authClient.useListOrganizations>["data"]
>[number];
