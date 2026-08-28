import type { ComparisonFeature } from "@/lib/comparison-config";
import { FeatureRow } from "./feature-row";

export function FeatureTable({
	features,
	competitorName,
}: {
	features: ComparisonFeature[];
	competitorName: string;
}) {
	return (
		<div className="overflow-hidden rounded border border-border bg-card/30 backdrop-blur-sm">
			<div className="hidden grid-cols-[1fr_100px_100px_1fr] items-center gap-4 border-border border-b bg-muted/50 px-6 py-3.5 md:grid">
				<span className="font-semibold text-foreground text-xs uppercase tracking-wide">
					Feature
				</span>
				<span className="text-center font-semibold text-primary text-xs uppercase tracking-wide">
					Datamate
				</span>
				<span className="text-center font-semibold text-muted-foreground text-xs uppercase tracking-wide">
					{competitorName}
				</span>
				<span className="font-semibold text-foreground text-xs uppercase tracking-wide">
					Why it matters
				</span>
			</div>

			<div className="border-border border-b bg-muted/50 px-5 py-3 md:hidden">
				<span className="font-semibold text-foreground text-xs uppercase tracking-wide">
					Datamate vs {competitorName}
				</span>
			</div>

			{features.map((feature) => (
				<FeatureRow
					competitorName={competitorName}
					feature={feature}
					key={feature.name}
				/>
			))}
		</div>
	);
}
