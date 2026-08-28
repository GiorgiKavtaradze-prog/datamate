"use client";

import { type HTMLAttributes, type ReactNode, createContext, use, useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";

type ZoneVariant = "destructive" | "warning";

const ZoneContext = createContext<ZoneVariant | null>(null);

interface SettingCardGroupProps extends HTMLAttributes<HTMLDivElement> {}

function SettingCardGroup({ className, ...rest }: SettingCardGroupProps) {
	return (
		<div
			className={cn(
				"overflow-hidden rounded-xl border border-border/60 divide-y divide-border/60",
				className
			)}
			{...rest}
		/>
	);
}

interface SettingCardProps {
	children?: ReactNode;
	className?: string;
	description: ReactNode;
	expandable?: ReactNode;
	icon?: ReactNode;
	title: ReactNode;
}

function SettingCard({
	title,
	description,
	children,
	className,
	icon,
	expandable,
}: SettingCardProps) {
	const [expanded, setExpanded] = useState(false);

	return (
		<div className={cn("w-full", className)}>
			<div
				className={cn(
					"flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between",
					expandable && "cursor-pointer"
				)}
				onClick={expandable ? () => setExpanded((p) => !p) : undefined}
				onKeyDown={
					expandable
						? (e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									setExpanded((p) => !p);
								}
							}
						: undefined
				}
			>
				<div className="flex items-center gap-3 min-w-0">
					{icon && (
						<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
							{icon}
						</div>
					)}
					<div className="min-w-0 flex-1">
						<p className="font-medium text-foreground text-[13px]">{title}</p>
						<p className="text-muted-foreground text-xs">{description}</p>
					</div>
				</div>
				{children && <div className="shrink-0">{children}</div>}
			</div>
			{expandable && (
				<div
					className={cn(
						"grid transition-[grid-template-rows] duration-200",
						expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
					)}
				>
					<div className="overflow-hidden">
						<div className="border-t border-border/60 px-4 py-4">
							{expandable}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

const ZONE_STYLES: Record<
	ZoneVariant,
	{ border: string; heading: string; button: { tone: "destructive"; variant?: "primary" | "secondary" } }
> = {
	destructive: {
		border: "border-destructive/30 divide-destructive/30",
		heading: "text-destructive",
		button: { tone: "destructive" },
	},
	warning: {
		border: "border-amber-500/30 divide-amber-500/30",
		heading: "text-amber-600 dark:text-amber-500",
		button: { tone: "destructive", variant: "secondary" },
	},
};

interface SettingsZoneProps {
	children: ReactNode;
	className?: string;
	title: string;
	variant: ZoneVariant;
}

function SettingsZone({ children, className, title, variant }: SettingsZoneProps) {
	const styles = ZONE_STYLES[variant];
	return (
		<ZoneContext value={variant}>
			<div className={cn("w-full", className)}>
				<h3 className={cn("mb-3 font-semibold text-sm", styles.heading)}>
					{title}
				</h3>
				<div
					className={cn(
						"overflow-hidden rounded-xl border divide-y",
						styles.border
					)}
				>
					{children}
				</div>
			</div>
		</ZoneContext>
	);
}

interface SettingsZoneRowProps {
	action: {
		disabled?: boolean;
		label: string;
		loading?: boolean;
		onClick: () => void;
	};
	description: ReactNode;
	title: ReactNode;
}

function SettingsZoneRow({ title, description, action }: SettingsZoneRowProps) {
	const variant = use(ZoneContext) ?? "destructive";
	const btnProps = ZONE_STYLES[variant].button;

	return (
		<div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="min-w-0 flex-1">
				<p className="font-medium text-foreground text-sm">{title}</p>
				<p className="text-muted-foreground text-xs">{description}</p>
			</div>
			<Button
				disabled={action.disabled}
				loading={action.loading}
				onClick={action.onClick}
				size="sm"
				tone={btnProps.tone}
				variant={btnProps.variant}
			>
				{action.label}
			</Button>
		</div>
	);
}

export { SettingCard, SettingCardGroup, SettingsZone, SettingsZoneRow };
