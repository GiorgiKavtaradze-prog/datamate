import { isNull, type SQLWrapper } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { db } from "./client";

export function notDeleted<T extends PgTable>(
	table: T & { deletedAt: SQLWrapper }
) {
	return isNull(table.deletedAt);
}

type TransactionCallback = Parameters<typeof db.transaction>[0];

export function withTransaction<T>(
	callback: (tx: Parameters<TransactionCallback>[0]) => Promise<T>
): Promise<T> {
	return db.transaction(callback);
}

export function isUniqueViolationFor(
	error: unknown,
	constraintName: string
): boolean {
	if (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		"constraint" in error
	) {
		return error.code === "23505" && error.constraint === constraintName;
	}

	if (error instanceof Error && error.cause) {
		return isUniqueViolationFor(error.cause, constraintName);
	}

	return false;
}
