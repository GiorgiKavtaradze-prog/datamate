import { manifestoIntro } from "./manifesto-data";

export function ManifestoHero() {
	return (
		<section className="relative w-full pt-16 pb-12 sm:pt-20 sm:pb-16 lg:pt-28 lg:pb-20">
			<div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
				<h1 className="mb-10 text-balance text-center font-semibold text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
					{manifestoIntro.title}
				</h1>
				<div className="space-y-5">
					{manifestoIntro.lead.map((paragraph, i) => (
						<p
							className="text-pretty text-foreground/80 leading-relaxed sm:text-lg"
							key={`lead-${i}`}
						>
							{paragraph}
						</p>
					))}
				</div>
			</div>
		</section>
	);
}
