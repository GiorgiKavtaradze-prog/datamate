"use client";

import {
	EventsOverviewContent,
	ORGANIZATION_EVENTS_METRICS,
} from "@/components/events/custom-events";
import { useEventsPageContext } from "./events-page-context";

export function EventsPageContent() {
	const { dateRange, isLoadingOrg, query } = useEventsPageContext();

	return (
		<EventsOverviewContent
			dateRange={dateRange}
			isPageLoading={isLoadingOrg}
			metricKeys={ORGANIZATION_EVENTS_METRICS}
			query={query}
		/>
	);
}
