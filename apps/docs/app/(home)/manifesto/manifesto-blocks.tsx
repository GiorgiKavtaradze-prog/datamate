import type { ManifestoBlock } from "./manifesto-data";

export function ManifestoBlocks({
	blocks,
}: {
	blocks: readonly ManifestoBlock[];
}) {
	return (
		<div className="space-y-6">
			{blocks.map((block, i) => {
				if (block.type === "callout") {
					return (
						<p
							className="text-balance font-medium text-foreground text-xl leading-snug sm:text-2xl"
							key={`${i}-callout`}
						>
							{block.text}
						</p>
					);
				}

				if (block.type === "prompts") {
					return (
						<div
							className="space-y-2 rounded border border-border bg-card/40 p-4 sm:p-5"
							key={`${i}-prompts`}
						>
							{block.items.map((line, j) => (
								<p
									className="font-mono text-foreground/80 text-sm leading-relaxed"
									key={`${i}-pr-${j}`}
								>
									<span
										aria-hidden="true"
										className="mr-2 select-none text-muted-foreground/50"
									>
										&gt;
									</span>
									{line}
								</p>
							))}
						</div>
					);
				}

				return (
					<p
						className="text-pretty text-foreground/80 leading-relaxed sm:text-lg"
						key={`${i}-p`}
					>
						{block.text}
					</p>
				);
			})}
		</div>
	);
}
