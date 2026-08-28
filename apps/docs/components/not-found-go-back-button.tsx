"use client";

import { ArrowLeftIcon } from "@datamate/ui/icons";
import { Button } from "@datamate/ui";

export function NotFoundGoBackButton() {
	return (
		<Button
			className="gap-2"
			onClick={() => window.history.back()}
			variant="secondary"
		>
			<ArrowLeftIcon className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
			Go back
		</Button>
	);
}
