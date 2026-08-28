"use client";

import { Tooltip } from "@datamate/ui";
import { formatLocaleNumber } from "@/lib/format-locale-number";
import { cn } from "@/lib/utils";
import { InfoIcon } from "@datamate/ui/icons";

interface PricingTier {
	amount: number;
	to: number | "inf";
}

interface PricingTiersTooltipProps {
	className?: string;
	showText?: boolean;
	tiers: PricingTier[];
}

export function PricingTiersTooltip({
	tiers,
	className,
	showText = true,
}: PricingTiersTooltipProps) {
	const formatTierRange = (tier: PricingTier, index: number) => {
		const prevTier = index > 0 ? tiers[index - 1] : null;
		const from = prevTier
			? typeof prevTier.to === "number"
				? prevTier.to + 1
				: 0
			: 0;
		const to = tier.to;

		const formatNumber = (num: number) => {
			if (num >= 1_000_000) {
				return `${(num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1)}M`;
			}
			if (num >= 1000) {
				return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`;
			}
			return formatLocaleNumber(num);
		};

		if (to === "inf") {
			return `${formatNumber(from)}+`;
		}

		if (from === 0) {
			return `0 - ${formatNumber(typeof to === "number" ? to : 0)}`;
		}

		return `${formatNumber(from)} - ${formatNumber(typeof to === "number" ? to : 0)}`;
	};

	return (
		<Tooltip
			content={
				<div className="w-64 space-y-3 p-1">
					<div>
						<h4 className="font-semibold text-sm">Tiered Pricing Structure</h4>
						<p className="text-xs opacity-70">
							Lower rates for higher usage volumes
						</p>
					</div>
					<div className="space-y-2">
						{tiers.map((tier) => (
							<div
								className="flex items-center justify-between text-xs"
								key={tier.to}
							>
								<span className="opacity-70">
									{formatTierRange(tier, tiers.indexOf(tier))} events
								</span>
								<span className="font-medium font-mono">
									${tier.amount.toFixed(6)} each
								</span>
							</div>
						))}
					</div>
					<div className="border-current/10 border-t pt-2 text-xs opacity-70">
						You only pay the tier rate for usage within that range
					</div>
				</div>
			}
			side="top"
		>
			<button
				className={cn(
					"inline-flex cursor-help items-center gap-1 text-muted-foreground text-xs hover:text-foreground",
					!showText && "rounded-full p-1 hover:bg-muted/50",
					className
				)}
				type="button"
			>
				<InfoIcon size={12} />
				{showText && <span>View pricing tiers</span>}
			</button>
		</Tooltip>
	);
}
