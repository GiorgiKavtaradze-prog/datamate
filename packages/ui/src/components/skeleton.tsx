import { cn } from "../lib/utils";
import type { HTMLAttributes } from "react";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...rest }: SkeletonProps) {
	return (
		<div
			aria-hidden
			className={cn(
				"animate-pulse rounded-md bg-secondary motion-reduce:animate-none",
				className
			)}
			{...rest}
		/>
	);
}
