import { flush, track } from "@datamate/sdk";

type PricingPlacement = "pricing_comparison_table" | "pricing_estimator";

export function trackPricingPlanClick(
	planId: string,
	placement: PricingPlacement
) {
	track("pricing_plan_clicked", { plan: planId, placement });
	flush();
}
