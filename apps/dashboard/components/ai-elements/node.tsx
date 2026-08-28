import { Handle, Position } from "@xyflow/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@datamate/ui";

export type NodeProps = ComponentProps<typeof Card> & {
	handles: {
		target: boolean;
		source: boolean;
	};
};

export const Node = ({ handles, className, ...props }: NodeProps) => (
	<Card
		className={cn(
			"node-container relative size-full h-auto w-sm gap-0 rounded-md p-0",
			className
		)}
		{...props}
	>
		{handles.target && <Handle position={Position.Left} type="target" />}
		{handles.source && <Handle position={Position.Right} type="source" />}
		{props.children}
	</Card>
);

export type NodeHeaderProps = ComponentProps<typeof Card.Header>;

export const NodeHeader = ({ className, ...props }: NodeHeaderProps) => (
	<Card.Header
		className={cn("gap-0.5 rounded-t-md border-b bg-secondary p-3!", className)}
		{...props}
	/>
);

export type NodeTitleProps = ComponentProps<typeof Card.Title>;

export const NodeTitle = (props: NodeTitleProps) => <Card.Title {...props} />;

export type NodeDescriptionProps = ComponentProps<typeof Card.Description>;

export const NodeDescription = (props: NodeDescriptionProps) => (
	<Card.Description {...props} />
);

export type NodeActionProps = ComponentProps<typeof Card.Action>;

export const NodeAction = (props: NodeActionProps) => (
	<Card.Action {...props} />
);

export type NodeContentProps = ComponentProps<typeof Card.Content>;

export const NodeContent = ({ className, ...props }: NodeContentProps) => (
	<Card.Content className={cn("p-3", className)} {...props} />
);

export type NodeFooterProps = ComponentProps<typeof Card.Footer>;

export const NodeFooter = ({ className, ...props }: NodeFooterProps) => (
	<Card.Footer
		className={cn("rounded-b-md border-t bg-secondary p-3!", className)}
		{...props}
	/>
);
