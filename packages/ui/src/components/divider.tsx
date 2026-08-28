import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

type DividerProps = HTMLAttributes<HTMLDivElement> & {
	orientation?: "horizontal" | "vertical";
};

export function Divider({
	className,
	orientation = "horizontal",
	...rest
}: DividerProps) {
	return (
		<div
			className={cn(
				"shrink-0 bg-border/60",
				orientation === "horizontal"
					? "h-px w-full"
					: "h-auto w-px self-stretch",
				className
			)}
			{...rest}
		/>
	);
}
