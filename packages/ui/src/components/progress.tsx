"use client";

import { cn } from "../lib/utils";

const toneClasses = {
	primary: "bg-primary",
	warning: "bg-warning",
	destructive: "bg-destructive",
	success: "bg-success",
};

interface ProgressProps {
	className?: string;
	size?: "sm" | "md";
	tone?: keyof typeof toneClasses;
	value: number;
}

function Progress({
	value,
	tone = "primary",
	size = "md",
	className,
}: ProgressProps) {
	const clamped = Math.min(Math.max(value, 0), 100);

	return (
		<div
			aria-valuemax={100}
			aria-valuemin={0}
			aria-valuenow={clamped}
			className={cn(
				"overflow-hidden rounded-full bg-secondary",
				size === "sm" ? "h-1.5 p-px" : "h-2 p-[1.5px]",
				className
			)}
			role="progressbar"
		>
			<div
				className={cn(
					"h-full rounded-full",
					"transition-[width] duration-(--duration-quick) ease-(--ease-smooth)",
					"motion-reduce:transition-none",
					toneClasses[tone]
				)}
				style={{ width: `${clamped}%` }}
			/>
		</div>
	);
}

export { Progress };
export type { ProgressProps };
