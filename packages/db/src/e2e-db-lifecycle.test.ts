import { describe, expect, it } from "bun:test";
import {
	deriveAdminDatabaseUrl,
	deriveDatabaseUrl,
	isLocalDbHostname,
	parseLifecycleArgs,
	resolveE2EDatabaseName,
	resolveLifecycleConfig,
	sanitizeDbIdentifierPart,
	toShellAssignments,
} from "./e2e-db-lifecycle";

describe("e2e db lifecycle helpers", () => {
	it("parses create arguments", () => {
		expect(
			parseLifecycleArgs([
				"create",
				"--base-dsn",
				"postgres://u:p@localhost:5432/datamate",
				"--db-prefix",
				"db_e2e",
				"--run-id",
				"run-1",
			])
		).toMatchObject({
			baseDsn: "postgres://u:p@localhost:5432/datamate",
			command: "create",
			dbPrefix: "db_e2e",
			runId: "run-1",
		});
	});

	it("requires a db name for drop", () => {
		expect(() =>
			parseLifecycleArgs([
				"drop",
				"--base-dsn",
				"postgres://u:p@localhost:5432/datamate",
			])
		).toThrow("Drop command requires '--db-name'");
	});

	it("sanitizes and caps generated database names", () => {
		expect(sanitizeDbIdentifierPart("Datamate E2E -- branch/main")).toBe(
			"Datamate_E2E_branch_main"
		);
		expect(
			resolveE2EDatabaseName({
				dbPrefix: "datamate-e2e",
				runId: "run/with spaces",
			})
		).toBe("datamate_e2e_run_with_spaces");
		expect(
			resolveE2EDatabaseName({
				dbPrefix: "x".repeat(80),
				runId: "y".repeat(20),
			}).length
		).toBeLessThanOrEqual(63);
	});

	it("derives admin and target DSNs", () => {
		const base = new URL("postgres://u:p@localhost:5432/datamate?sslmode=disable");
		expect(deriveAdminDatabaseUrl(base).pathname).toBe("/postgres");
		expect(deriveDatabaseUrl(base, "datamate_e2e_run").pathname).toBe(
			"/datamate_e2e_run"
		);
	});

	it("refuses non-local database hosts by default", () => {
		expect(isLocalDbHostname("localhost")).toBe(true);
		expect(() =>
			resolveLifecycleConfig({
				allowNonLocal: false,
				baseDsn: "postgres://u:p@db.example.com:5432/datamate",
				command: "create",
				dbPrefix: "datamate_e2e",
			})
		).toThrow("Refusing to manage E2E DB on non-local host");
	});

	it("prints shell-safe assignments", () => {
		expect(
			toShellAssignments({ DATABASE_URL: "postgres://u:p@localhost/db'quoted" })
		).toBe("DATABASE_URL='postgres://u:p@localhost/db'\"'\"'quoted'");
	});
});
