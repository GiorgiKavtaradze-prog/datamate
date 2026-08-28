"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type InlineToggleOption<T extends string> = {
	value: T;
	label: ReactNode;
	ariaLabel?: string;
};

type InlineToggleProps<T extends string> = {
	options: InlineToggleOption<T>[];
	value: T;
	onValueChangeAction: (value: T) => void;
	className?: string;
	disabled?: boolean;
};

export function InlineToggle<T extends string>({
	options,
	value,
	onValueChangeAction,
	className,
	disabled = false,
}: InlineToggleProps<T>) {
	return (
		<div
			className={cn(
				"flex items-center overflow-hidden rounded border",
				disabled && "pointer-events-none opacity-40",
				className
			)}
			role="radiogroup"
		>
			{options.map((option) => {
				const isSelected = option.value === value;
				return (
					<button
						aria-checked={isSelected}
						aria-label={option.ariaLabel}
						className={cn(
							"flex items-center gap-1 px-2 py-1 text-xs transition-colors",
							isSelected
								? "bg-accent text-foreground"
								: "text-muted-foreground hover:text-foreground"
						)}
						disabled={disabled}
						key={option.value}
						onClick={() => onValueChangeAction(option.value)}
						role="radio"
						type="button"
					>
						{option.label}
					</button>
				);
			})}
		</div>
	);
}
