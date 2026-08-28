"use client";

import { AutumnProvider } from "autumn-js/react";
import { publicConfig } from "@datamate/env/public";

// Read directly so the value is inlined into the browser bundle.
const BILLING_DISABLED = process.env.NEXT_PUBLIC_BILLING_ENABLED === "false";

export function AutumnProviderGate({
	children,
}: {
	children: React.ReactNode;
}) {
	// When billing is disabled locally (no AUTUMN_SECRET_KEY), skip the
	// provider entirely so client hooks never fire billing API calls.
	if (BILLING_DISABLED) {
		return <>{children}</>;
	}

	return (
		<AutumnProvider backendUrl={publicConfig.urls.api} includeCredentials>
			{children}
		</AutumnProvider>
	);
}
