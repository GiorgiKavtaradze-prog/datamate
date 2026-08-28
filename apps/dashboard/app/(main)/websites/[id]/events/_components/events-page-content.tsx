"use client";

import { useAtom } from "jotai";
import { use, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
	EventsOverviewContent,
	WEBSITE_EVENTS_METRICS,
} from "@/components/events/custom-events";
import { useCustomEventsData } from "@/hooks/use-custom-events";
import { useDateFilters } from "@/hooks/use-date-filters";
import { dynamicQueryFiltersAtom } from "@/stores/jotai/filterAtoms";

interface EventsPageContentProps {
	params: Promise<{ id: string }>;
}

export function EventsPageContent({ params }: EventsPageContentProps) {
	const resolvedParams = use(params);
	const websiteId = resolvedParams.id;
	const router = useRouter();
	const [filters] = useAtom(dynamicQueryFiltersAtom);
	const { dateRange } = useDateFilters();

	const query = useCustomEventsData(websiteId, dateRange, {
		filters,
	});

	const getEventHref = useCallback(
		(eventName: string) =>
			`/websites/${websiteId}/events/${encodeURIComponent(eventName)}`,
		[websiteId]
	);

	const handlePropertyValueSelect = useCallback(
		(eventName: string, propertyKey: string, value: string) => {
			const params = new URLSearchParams({
				event: eventName,
				propKey: propertyKey,
				propVal: value,
			});
			router.push(`/websites/${websiteId}/events/stream?${params.toString()}`);
		},
		[router, websiteId]
	);

	return (
		<EventsOverviewContent
			dateRange={dateRange}
			getEventHref={getEventHref}
			metricKeys={WEBSITE_EVENTS_METRICS}
			onPropertyValueSelect={handlePropertyValueSelect}
			query={query}
		/>
	);
}
