import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "../lib/utils";

const text = cva("", {
	variants: {
		variant: {
			display: "text-display",
			title: "text-title",
			heading: "text-heading",
			body: "text-sm",
			label: "font-medium text-xs",
			caption: "text-[11px]",
		},
		tone: {
			default: "text-foreground",
			muted: "text-muted-foreground",
			destructive: "text-destructive",
		},
		mono: {
			true: "font-mono",
			false: "",
		},
	},
	defaultVariants: {
		variant: "body",
		tone: "default",
		mono: false,
	},
});

type TextOwnProps = VariantProps<typeof text> & {
	as?: ElementType;
	children?: ReactNode;
	className?: string;
};

type TextProps<T extends ElementType> = TextOwnProps &
	Omit<ComponentPropsWithoutRef<T>, keyof TextOwnProps>;

const variantElement: Record<
	NonNullable<TextOwnProps["variant"]>,
	ElementType
> = {
	display: "h1",
	title: "h2",
	heading: "h3",
	body: "p",
	label: "div",
	caption: "div",
};

export function Text<T extends ElementType = "p">({
	as,
	variant,
	tone,
	mono,
	className,
	...rest
}: TextProps<T>) {
	const Component = as ?? variantElement[variant ?? "body"];
	return (
		<Component
			className={cn(text({ variant, tone, mono }), className)}
			{...rest}
		/>
	);
}
