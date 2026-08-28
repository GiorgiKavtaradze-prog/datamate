"use client";

import { Chart } from "@/components/ui/composables/chart";
import { cn } from "@/lib/utils";
import { Card } from "@datamate/ui";

const previewData = [
	{ date: "Mon", value: 186 },
	{ date: "Tue", value: 305 },
	{ date: "Wed", value: 237 },
	{ date: "Thu", value: 73 },
	{ date: "Fri", value: 209 },
	{ date: "Sat", value: 214 },
];

const ChartPreview = ({
	chartType,
	className,
	size = 150,
}: {
	chartType: "bar" | "line" | "area" | "composed";
	className?: string;
	size?: number;
}) => {
	const chartId = `chart-preview-${chartType}`;
	const chartHeight = size - 16;

	const seriesKind =
		chartType === "bar" || chartType === "composed"
			? "bar"
			: chartType === "line"
				? "line"
				: "area";

	return (
		<Card
			className={cn(
				"dotted-bg flex items-center justify-center overflow-hidden bg-accent p-0",
				className
			)}
			style={{ width: `${size}px`, height: `${size}px` }}
		>
			<Card.Content className="flex size-full items-center justify-center p-2">
				<div className="size-full">
					<Chart.SingleSeries
						color="var(--color-chart-1)"
						data={previewData}
						dataKey="value"
						height={chartHeight}
						id={chartId}
						seriesKind={seriesKind}
						tooltip={false}
					/>
				</div>
			</Card.Content>
		</Card>
	);
};

export default ChartPreview;
