"use client";

import type { ComponentProps } from "react";
import { forwardRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import { useFieldContext } from "@datamate/ui";

type TextareaProps = ComponentProps<typeof TextareaAutosize> & {
	showFocusIndicator?: boolean;
	wrapperClassName?: string;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	(
		{
			className,
			showFocusIndicator = true,
			wrapperClassName,
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

		return (
			<div className={cn("relative min-w-0 flex-1", wrapperClassName)}>
				<TextareaAutosize
					aria-describedby={ariaDescribedBy}
					aria-invalid={hasError || undefined}
					className={cn(
						"field-sizing-content flex min-h-20 w-full rounded-md bg-secondary px-3 py-2 text-foreground text-xs outline-none transition-colors",
						"placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
						"focus-visible:ring-2 focus-visible:ring-ring/60",
						hasError &&
							"ring-2 ring-destructive/60 focus-visible:ring-destructive/60",
						className
					)}
					data-slot="textarea"
					id={resolvedId}
					ref={ref}
					{...props}
				/>
				{showFocusIndicator ? null : null}
			</div>
		);
	}
);

Textarea.displayName = "Textarea";

export type { TextareaProps };
export { Textarea };
