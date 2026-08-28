import type { UseQueryResult } from "@tanstack/react-query";

/**
 * Single place to derive list UI state from TanStack Query + optional gate loading.
 * Use with List.Content so pages don’t hand-roll loading → null → content flashes.
 */
export type ListQueryOutcome<T> =
	| { status: "empty" }
	| { status: "error" }
	| { status: "loading" }
	| { status: "ready"; items: T[] };

export function listQueryOutcome<T>(params: {
	data: T[] | undefined;
	gatePending?: boolean;
	isError: boolean;
	isPending: boolean;
	isSuccess: boolean;
}): ListQueryOutcome<T> {
	if (params.gatePending) {
		return { status: "loading" };
	}
	if (params.isPending) {
		return { status: "loading" };
	}
	if (params.isError) {
		return { status: "error" };
	}
	const items = params.data ?? [];
	if (items.length > 0) {
		return { status: "ready", items };
	}
	if (params.isSuccess) {
		return { status: "empty" };
	}
	return { status: "loading" };
}

export type ListQuerySlice<T> = Pick<
	UseQueryResult<T[], Error>,
	"data" | "isPending" | "isError" | "isSuccess"
>;

/** Infers list state from a TanStack array query — pass to List.Content as `query` instead of calling listQueryOutcome yourself. */
export function listQueryOutcomeFromQuery<T>(
	query: ListQuerySlice<T>,
	options?: { gatePending?: boolean }
): ListQueryOutcome<T> {
	return listQueryOutcome<T>({
		data: query.data ?? [],
		gatePending: options?.gatePending,
		isError: query.isError,
		isPending: query.isPending,
		isSuccess: query.isSuccess,
	});
}
