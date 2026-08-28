"use client";

import { Skeleton } from "@datamate/ui";
import { LatencyChartChunkPlaceholder } from "@datamate/ui/uptime";

export function MonitorDetailLoading() {
	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="flex min-h-[88px] shrink-0 items-center gap-3 border-b p-3 sm:p-4">
				<Skeleton className="size-12 shrink-0 rounded" />
				<div className="min-w-0 flex-1 space-y-2">
					<Skeleton className="h-7 w-52 max-w-[70%] rounded sm:h-8" />
					<Skeleton className="h-4 w-full max-w-lg rounded" />
				</div>
				<div className="hidden shrink-0 flex-wrap items-center justify-end gap-2 sm:flex">
					<Skeleton className="h-9 w-18 rounded" />
					<Skeleton className="size-9 rounded" />
					<Skeleton className="h-9 w-24 rounded" />
					<Skeleton className="h-9 w-20 rounded" />
					<Skeleton className="h-9 w-24 rounded" />
					<Skeleton className="h-9 w-20 rounded" />
				</div>
			</div>

			<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
				<div className="flex min-h-10 shrink-0 items-center gap-5 border-b bg-card px-4 py-2.5 sm:px-6">
					<Skeleton className="h-3.5 w-16 rounded" />
					<Skeleton className="h-3.5 w-28 rounded" />
					<Skeleton className="h-3.5 w-24 rounded" />
					<Skeleton className="h-3.5 w-20 rounded" />
				</div>

				<div className="shrink-0 bg-sidebar">
					<div className="flex min-h-10 items-center justify-between gap-3 border-b px-4 py-2.5 sm:px-6">
						<Skeleton className="h-5 w-36 rounded" />
						<Skeleton className="h-4 w-32 rounded" />
					</div>
					<div className="p-4">
						<div className="flex h-16 w-full gap-px sm:gap-1">
							{Array.from({ length: 24 }).map((_, i) => (
								<Skeleton
									className="h-full min-w-0 flex-1 rounded-sm"
									key={`h-${i}`}
								/>
							))}
						</div>
						<div className="mt-2 flex justify-between">
							<Skeleton className="h-3 w-16 rounded" />
							<Skeleton className="h-3 w-12 rounded" />
						</div>
					</div>
					<LatencyChartChunkPlaceholder />
				</div>

				<div className="flex min-h-0 flex-1 flex-col overflow-hidden border-t bg-sidebar">
					<div className="min-h-0 flex-1 overflow-y-auto">
						<div className="flex min-h-19 flex-col justify-center border-b px-4 py-3 sm:px-6">
							<Skeleton className="h-5 w-44 rounded" />
							<Skeleton className="mt-2 h-3 w-56 max-w-full rounded sm:mt-1.5" />
						</div>
						<div className="bg-card">
							<div className="border-b px-3">
								<div className="flex h-10 items-center gap-6">
									<Skeleton className="h-4 w-14 rounded" />
									<Skeleton className="h-4 w-12 rounded" />
									<Skeleton className="h-4 w-16 rounded" />
									<Skeleton className="h-4 w-8 rounded" />
									<Skeleton className="h-4 w-16 rounded" />
								</div>
							</div>
							<div className="divide-y">
								{Array.from({ length: 6 }).map((_, i) => (
									<div
										className="flex h-[52px] items-center gap-3 px-3"
										key={`r-${i}`}
									>
										<Skeleton className="size-4 shrink-0 rounded" />
										<Skeleton className="h-4 w-24 rounded" />
										<Skeleton className="ml-auto h-4 w-28 rounded sm:ml-0" />
										<Skeleton className="hidden h-5 w-14 rounded sm:block" />
										<Skeleton className="hidden h-4 w-24 rounded md:block" />
										<Skeleton className="hidden h-4 w-12 rounded lg:block" />
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
