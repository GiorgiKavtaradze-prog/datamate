"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useFieldContext } from "@datamate/ui";

type InputProps = Omit<React.ComponentProps<"input">, "prefix" | "suffix"> & {
	variant?: "default" | "ghost";
	showFocusIndicator?: boolean;
	wrapperClassName?: string;
	prefix?: React.ReactNode;
	suffix?: React.ReactNode;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			type,
			variant = "default",
			showFocusIndicator = true,
			wrapperClassName,
			prefix,
			suffix,
			id,
			...props
		},
		ref
	) => {
		const field = useFieldContext();
		const hasError =
			field?.error ||
			props["aria-invalid"] === true ||
			props["aria-invalid"] === "true";
		const ariaDescribedBy =
			props["aria-describedby"] ??
			(field
				? [field.error && field.errorId, field.descriptionId]
						.filter(Boolean)
						.join(" ") || undefined
				: undefined);
		const resolvedId = id ?? field?.id;

		const hasPrefix = !!prefix;
		const hasSuffix = !!suffix;

		const isSmallHeight = className?.includes("h-8");
		const heightClass = isSmallHeight ? "h-8" : "h-9";

		if (hasPrefix || hasSuffix) {
			return (
				<div
					className={cn(
						"group relative flex min-w-0 flex-1 items-stretch rounded-md bg-secondary transition-colors",
						"focus-within:ring-2 focus-within:ring-ring/60",
						hasError && "ring-2 ring-destructive/60 focus-within:ring-destructive/60",
						wrapperClassName
					)}
				>
					{hasPrefix && (
						<span
							className={cn(
								"inline-flex shrink-0 select-none items-center rounded-l-md bg-muted px-3 text-muted-foreground text-xs",
								heightClass
							)}
						>
							{prefix}
						</span>
					)}
					<input
						aria-describedby={ariaDescribedBy}
						aria-invalid={hasError || undefined}
						className={cn(
							"peer flex h-9 min-w-0 flex-1 border-none bg-transparent px-3 py-1 text-foreground text-xs outline-none",
							"placeholder:text-muted-foreground",
							"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
							"file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm",
							variant === "ghost" && "hover:bg-interactive-hover/60",
							className
						)}
						data-slot="input"
						id={resolvedId}
						ref={ref}
						type={type}
						{...props}
					/>
					{hasSuffix && (
						<span
							className={cn(
								"inline-flex shrink-0 select-none items-center rounded-r-md bg-muted px-3 text-muted-foreground text-xs",
								heightClass
							)}
						>
							{suffix}
						</span>
					)}
				</div>
			);
		}

		return (
			<div className={cn("relative min-w-0 flex-1", wrapperClassName)}>
				<input
					aria-describedby={ariaDescribedBy}
					aria-invalid={hasError || undefined}
					className={cn(
						"peer flex h-9 w-full min-w-0 rounded-md bg-secondary px-3 py-1 text-foreground text-xs outline-none transition-colors",
						"placeholder:text-muted-foreground",
						"focus-visible:ring-2 focus-visible:ring-ring/60",
						"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
						hasError &&
							"ring-2 ring-destructive/60 focus-visible:ring-destructive/60",
						variant === "ghost" &&
							"bg-transparent hover:bg-interactive-hover/60 focus-visible:bg-interactive-hover/60",
						className
					)}
					data-slot="input"
					id={resolvedId}
					ref={ref}
					type={type}
					{...props}
				/>
				{showFocusIndicator ? null : null}
			</div>
		);
	}
);

Input.displayName = "Input";

export type { InputProps };
export { Input };
