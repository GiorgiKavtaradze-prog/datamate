import { cn } from "../lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const baseControlShell =
	"inline-flex min-w-0 items-center gap-(--control-gap) rounded-md px-(--control-px) font-medium text-xs " +
	"[--control-gap:--spacing(1.5)] [--control-h:--spacing(8)] [--control-px:--spacing(3)] " +
	"h-(--control-h) select-none transition-[background-color,color,opacity,transform,filter,box-shadow] duration-(--duration-quick) ease-(--ease-smooth) motion-reduce:transition-none " +
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50";

export function fieldControlShell(className?: string) {
	return cn(
		baseControlShell,
		"w-full justify-between bg-secondary text-foreground",
		className
	);
}

export function ghostControlShell(className?: string) {
	return cn(
		baseControlShell,
		"justify-center bg-transparent text-muted-foreground hover:bg-interactive-hover hover:text-foreground",
		className
	);
}

interface TriggerShellButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	children?: ReactNode;
}

export function FieldTriggerButton({
	children,
	className,
	type = "button",
	...rest
}: TriggerShellButtonProps) {
	return (
		<button className={fieldControlShell(className)} type={type} {...rest}>
			{children}
		</button>
	);
}

export function GhostTriggerButton({
	children,
	className,
	type = "button",
	...rest
}: TriggerShellButtonProps) {
	return (
		<button className={ghostControlShell(className)} type={type} {...rest}>
			{children}
		</button>
	);
}
