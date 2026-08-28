import { formatDailyDowntime } from "./implied-downtime";

interface UptimeHeatmapDayTooltipBodyProps {
	dateLabel: string;
	downtimeSeconds?: number;
	emptyLabel?: string;
	hasData: boolean;
	uptimePercent: number;
}

export function UptimeHeatmapDayTooltipBody({
	dateLabel,
	hasData,
	uptimePercent,
	downtimeSeconds,
	emptyLabel = "No data for this day",
}: UptimeHeatmapDayTooltipBodyProps) {
	return (
		<div className="flex flex-col gap-2 text-pretty">
			<p className="text-balance font-medium text-popover-foreground text-xs leading-snug">
				{dateLabel}
			</p>
			{hasData ? (
				<div className="flex flex-col gap-1.5 border-border/60 border-t pt-2">
					<div className="flex items-baseline justify-between gap-6">
						<span className="shrink-0 text-muted-foreground text-xs">
							Uptime
						</span>
						<span className="font-mono font-semibold text-popover-foreground text-xs tabular-nums leading-none">
							{uptimePercent.toFixed(2)}%
						</span>
					</div>
					{downtimeSeconds === undefined ? null : (
						<div className="flex items-baseline justify-between gap-6">
							<span className="shrink-0 text-muted-foreground text-xs">
								Down
							</span>
							<span className="font-mono text-popover-foreground text-xs tabular-nums leading-none">
								{formatDailyDowntime(downtimeSeconds)}
							</span>
						</div>
					)}
				</div>
			) : (
				<p className="text-muted-foreground text-xs leading-snug">
					{emptyLabel}
				</p>
			)}
		</div>
	);
}
