import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Text } from "@datamate/ui";

interface ShowcaseSectionProps {
	children: ReactNode;
	className?: string;
	description?: string;
	id: string;
	title: string;
}

export function ShowcaseSection({
	id,
	title,
	description,
	children,
	className,
}: ShowcaseSectionProps) {
	return (
		<section
			className={cn(
				"flex scroll-mt-16 flex-col gap-6 border-border/60 border-b py-12",
				className
			)}
			id={id}
		>
			<header className="flex flex-col gap-1">
				<Text variant="title">{title}</Text>
				{description ? (
					<Text tone="muted" variant="body">
						{description}
					</Text>
				) : null}
			</header>
			<div className="flex flex-col gap-4">{children}</div>
		</section>
	);
}

interface ShowcaseRowProps {
	children: ReactNode;
	className?: string;
	label?: string;
}

export function ShowcaseRow({ label, children, className }: ShowcaseRowProps) {
	return (
		<div
			className={cn(
				"flex flex-col gap-2 rounded-lg bg-muted/50 p-6",
				className
			)}
		>
			{label ? (
				<Text tone="muted" variant="caption">
					{label}
				</Text>
			) : null}
			<div className="flex flex-wrap items-center gap-3">{children}</div>
		</div>
	);
}
