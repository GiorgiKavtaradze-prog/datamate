import { manifestoSignature } from "./manifesto-data";

export function ManifestoSignature() {
	return (
		<div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
			<div className="space-y-1">
				<p className="font-medium text-foreground text-lg">
					- {manifestoSignature.name}
				</p>
				<p className="text-muted-foreground text-sm">
					{manifestoSignature.role}, {manifestoSignature.company}
				</p>
			</div>
		</div>
	);
}
