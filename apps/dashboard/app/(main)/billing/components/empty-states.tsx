"use client";

import {
	ArrowClockwiseIcon,
	TrendUpIcon,
	WarningCircleIcon,
} from "@datamate/ui/icons";
import { Button } from "@datamate/ui";

export function EmptyUsageState() {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
				<TrendUpIcon
					className="text-secondary-foreground"
					size={24}
					weight="duotone"
				/>
			</div>
			<p className="font-semibold">No usage data yet</p>
			<p className="mt-1 max-w-xs text-muted-foreground text-sm">
				Start using features to see your consumption stats here
			</p>
		</div>
	);
}

interface ErrorStateProps {
	error: Error | unknown;
	onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
	const errorMessage =
		error instanceof Error ? error.message : "Failed to load billing data";

	return (
		<div className="flex h-full flex-col items-center justify-center p-8">
			<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
				<WarningCircleIcon
					className="text-destructive"
					size={24}
					weight="duotone"
				/>
			</div>
			<p className="font-semibold">Something went wrong</p>
			<p className="mt-1 mb-4 max-w-xs text-center text-muted-foreground text-sm">
				{errorMessage}
			</p>
			<Button className="mt-2" onClick={onRetry} size="sm" variant="secondary">
				<ArrowClockwiseIcon size={14} />
				Try again
			</Button>
		</div>
	);
}
