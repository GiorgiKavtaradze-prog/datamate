import {
	createDatamateEvlogEnv,
	datamateEvlogRedaction,
} from "@datamate/shared/evlog-redaction";
import { initLogger } from "evlog";
import { apiLoggerDrain } from "@/lib/evlog-api";

export function configureApiLogger() {
	initLogger({
		env: createDatamateEvlogEnv("api"),
		redact: datamateEvlogRedaction,
		drain: apiLoggerDrain,
		sampling: {
			rates: { info: 20, warn: 50, debug: 5 },
			keep: [{ status: 400 }, { duration: 1500 }],
		},
	});
}
