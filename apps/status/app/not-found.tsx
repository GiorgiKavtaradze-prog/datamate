import type { Metadata } from "next";
import { StatusErrorShell } from "./_components/status-error-shell";

export const metadata: Metadata = {
	title: "Status page not found",
	robots: { index: false, follow: false },
};

export default function NotFound() {
	return (
		<StatusErrorShell
			code="404"
			description="Our bunny wandered off looking for this page, but it doesn't seem to exist."
			title="Lost in the data stream"
		/>
	);
}
