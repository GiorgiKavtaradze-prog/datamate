"use client";

import { authClient } from "@datamate/auth/client";
import { clearProfile, identify } from "@datamate/sdk";
import { useEffect } from "react";

export function IdentifyUser() {
	const { data: session, isPending } = authClient.useSession();

	useEffect(() => {
		if (isPending) {
			return;
		}
		const user = session?.user;
		if (user) {
			identify(user.id, {
				email: user.email,
				name: user.name ?? null,
			});
		} else {
			clearProfile();
		}
	}, [session, isPending]);

	return null;
}
