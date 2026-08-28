"use client";

import { cn } from "../lib/utils";
import { Collapsible as BaseCollapsible } from "@base-ui-components/react/collapsible";
import { CaretDownIcon } from "./icons";
import type { ComponentPropsWithoutRef } from "react";

function Root({
	className,
	...rest
}: ComponentPropsWithoutRef<typeof BaseCollapsible.Root>) {
	return <BaseCollapsible.Root className={cn(className)} {...rest} />;
}

function Trigger({
	className,
	children,
	...rest
}: ComponentPropsWithoutRef<typeof BaseCollapsible.Trigger>) {
	return (
		<BaseCollapsible.Trigger
			className={cn(
				"group/trigger flex h-9 w-full cursor-pointer select-none items-center gap-2 bg-secondary px-3 text-left text-xs",
				"transition-colors duration-(--duration-quick) ease-(--ease-smooth)",
				"hover:bg-interactive-hover",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-inset",
				"disabled:pointer-events-none disabled:opacity-50",
				className
			)}
			{...rest}
		>
			<span className="flex min-w-0 flex-1 items-center gap-2">{children}</span>
			<CaretDownIcon
				className={cn(
					"size-3.5 shrink-0 text-muted-foreground",
					"transition-transform duration-(--duration-quick) ease-(--ease-smooth)",
					"group-data-panel-open/trigger:-rotate-180"
				)}
			/>
		</BaseCollapsible.Trigger>
	);
}

function Panel({
	className,
	children,
	keepMounted = true,
	...rest
}: ComponentPropsWithoutRef<typeof BaseCollapsible.Panel>) {
	return (
		<BaseCollapsible.Panel
			className={cn(
				"h-(--collapsible-panel-height) overflow-hidden",
				"data-[ending-style]:h-0 data-[starting-style]:h-0",
				"transition-[height] duration-200 ease-out",
				"motion-reduce:transition-none",
				className
			)}
			keepMounted={keepMounted}
			{...rest}
		>
			{children}
		</BaseCollapsible.Panel>
	);
}

function Content({
	className,
	children,
	...rest
}: ComponentPropsWithoutRef<typeof BaseCollapsible.Panel>) {
	return (
		<Panel {...rest}>
			<div className={cn("p-3", className)}>{children}</div>
		</Panel>
	);
}

export const Accordion = Object.assign(Root, {
	Trigger,
	Panel,
	Content,
});
