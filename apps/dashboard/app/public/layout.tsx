"use client";

import { AutumnProviderGate } from "@/components/providers/autumn-provider-gate";
import { BillingProvider } from "@/components/providers/billing-provider";

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AutumnProviderGate>
			<BillingProvider public>
				<div className="h-dvh overflow-hidden text-foreground">{children}</div>
			</BillingProvider>
		</AutumnProviderGate>
	);
}
