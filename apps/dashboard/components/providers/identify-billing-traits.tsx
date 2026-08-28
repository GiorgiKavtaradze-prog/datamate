"use client";

import { authClient } from "@datamate/auth/client";
import { identify, setGlobalProperties } from "@datamate/sdk";
import { useEffect } from "react";
import { isDashboardE2E } from "@/lib/e2e-mode";
import { useBillingContext } from "./billing-provider";

export function IdentifyBillingTraits() {
	const { data: session } = authClient.useSession();
	const { currentPlanId, isOrganizationBilling, isLoading } =
		useBillingContext();
	const userId = session?.user?.id;

	useEffect(() => {
		if (isDashboardE2E || isLoading || !(userId && currentPlanId)) {
			return;
		}
		identify(userId, {
			plan: currentPlanId,
			billing_scope: isOrganizationBilling ? "organization" : "personal",
		});
		setGlobalProperties({ plan: currentPlanId });
	}, [userId, currentPlanId, isOrganizationBilling, isLoading]);

	return null;
}
