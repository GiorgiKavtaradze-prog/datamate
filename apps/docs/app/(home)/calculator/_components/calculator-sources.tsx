export function CalculatorSources() {
	return (
		<div className="mx-auto w-full max-w-3xl rounded border border-border bg-card/40 px-4 py-6 text-left sm:px-6">
			<p className="mb-4 text-center font-mono text-muted-foreground text-xs uppercase tracking-widest">
				Sources & methodology
			</p>
			<p className="mb-4 text-pretty text-muted-foreground text-xs leading-relaxed sm:text-sm">
				<span className="text-foreground/90">Visitor data loss</span> means
				visits that do not send consent to cookie-based analytics - a
				measurement gap, not customers who left your site.
			</p>
			<div className="space-y-4 text-pretty text-muted-foreground text-xs leading-relaxed sm:text-sm">
				<div>
					<p className="mb-2 font-medium text-foreground text-xs">
						Peer-reviewed & government-backed
					</p>
					<ul className="list-inside list-disc space-y-1.5">
						<li>
							<a
								className="underline underline-offset-2 hover:text-foreground"
								href="https://www.advance-metrics.com/en/blog/cookie-behaviour-study/"
								rel="noopener noreferrer"
								target="_blank"
							>
								Advance Metrics (2024)
							</a>
							: 1.2M+ interactions - 25.4% accept all; 68.9% close or ignore (no
							consent / no analytics).
						</li>
						<li>
							<a
								className="underline underline-offset-2 hover:text-foreground"
								href="https://www.usenix.org/system/files/usenixsecurity24-bielova.pdf"
								rel="noopener noreferrer"
								target="_blank"
							>
								CNIL / DITP + BIT (USENIX Security 2024)
							</a>
							: fair design → 33–46% reject; dark patterns → ~4% reject.
						</li>
						<li>
							<a
								className="underline underline-offset-2 hover:text-foreground"
								href="https://dl.acm.org/doi/10.1145/3319535.3354212"
								rel="noopener noreferrer"
								target="_blank"
							>
								Utz et al. (ACM CCS 2019)
							</a>
							: 80k+ real visitors - up to 45% reject with fair opt-out; without
							nudging, &lt;0.1% consent.
						</li>
						<li>
							<a
								className="underline underline-offset-2 hover:text-foreground"
								href="https://www.sciencedirect.com/science/article/abs/pii/S0167624522000427"
								rel="noopener noreferrer"
								target="_blank"
							>
								ScienceDirect (2022)
							</a>
							: ~15% long-term traffic reduction post-GDPR (macro effect).
						</li>
					</ul>
				</div>
				<div>
					<p className="mb-2 font-medium text-foreground text-xs">
						Industry (large samples, published methodology)
					</p>
					<ul className="list-inside list-disc space-y-1.5">
						<li>
							<a
								className="underline underline-offset-2 hover:text-foreground"
								href="https://www.etracker.com/en/cookie-consent-benchmarks/"
								rel="noopener noreferrer"
								target="_blank"
							>
								etracker Cookie Consent Benchmarks (2024)
							</a>
							: ~60% visit data loss with legally compliant banners.
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
