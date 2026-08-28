import type { Metadata } from "next";
import { StatusErrorShell } from "../_components/status-error-shell";

export const metadata: Metadata = {
	title: "Status page not found",
	robots: { index: false, follow: false },
};

export default function StatusNotFound() {
	return (
		<StatusErrorShell
			code="404"
			description="This organization doesn't have a public status page here, or it may have moved."
			title="Status page not found"
		/>
	);
}
