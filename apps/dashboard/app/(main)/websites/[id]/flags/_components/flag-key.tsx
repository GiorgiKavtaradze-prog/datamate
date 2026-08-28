import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import type { Flag } from "./types";
import { CheckIcon, CopyIcon } from "@datamate/ui/icons";
import { Button, Tooltip } from "@datamate/ui";

export function FlagKey({
	flag,
	className,
	...props
}: { flag: Flag } & React.ComponentProps<"button">) {
	const { isCopied, copyToClipboard } = useCopyToClipboard();

	return (
		<Tooltip
			content={isCopied ? "Copied!" : "Click to copy key"}
			delay={200}
			side="bottom"
		>
			<Button
				className={cn(
					"h-4.5 font-mono text-xs has-[>svg]:px-1.5 dark:text-foreground/70",
					className
				)}
				data-row-interactive="true"
				onClick={() => copyToClipboard(flag.key)}
				size="sm"
				variant="ghost"
				{...props}
			>
				{flag.key}
				{isCopied ? (
					<CheckIcon className="size-3 text-green-500" />
				) : (
					<CopyIcon className="size-3 opacity-50" />
				)}
			</Button>
		</Tooltip>
	);
}
