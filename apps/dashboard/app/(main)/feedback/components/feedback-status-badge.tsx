"use client";

import { Badge } from "@datamate/ui";

const STATUS_CONFIG = {
	pending: { label: "Pending", variant: "warning" },
	approved: { label: "Approved", variant: "success" },
	rejected: { label: "Rejected", variant: "destructive" },
} as const;

type FeedbackStatusValue = keyof typeof STATUS_CONFIG;

export function FeedbackStatusBadge({
	status,
}: {
	status: FeedbackStatusValue;
}) {
	const config = STATUS_CONFIG[status];
	return <Badge variant={config.variant}>{config.label}</Badge>;
}
