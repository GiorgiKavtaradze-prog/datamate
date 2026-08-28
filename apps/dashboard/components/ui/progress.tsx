"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Progress({
	className,
	value,
	...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
	const clamped = Math.min(Math.max(value || 0, 0), 100);

	return (
		<ProgressPrimitive.Root
			className={cn(
				"relative h-2 w-full overflow-hidden rounded-full bg-secondary",
				className
			)}
			data-slot="progress"
			value={clamped}
			{...props}
		>
			<ProgressPrimitive.Indicator
				className="h-full w-full flex-1 rounded-full bg-primary transition-all"
				data-slot="progress-indicator"
				style={{ transform: `translateX(-${100 - clamped}%)` }}
			/>
		</ProgressPrimitive.Root>
	);
}

export { Progress };
