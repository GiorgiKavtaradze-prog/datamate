export type DatamateAgentUserErrorCode = "agent_credits_exhausted";

interface DatamateAgentUserErrorOptions {
	code: DatamateAgentUserErrorCode;
	message: string;
}

export class DatamateAgentUserError extends Error {
	readonly code: DatamateAgentUserErrorCode;
	readonly expose = true;

	constructor({ code, message }: DatamateAgentUserErrorOptions) {
		super(message);
		this.name = "DatamateAgentUserError";
		this.code = code;
	}
}

export function isDatamateAgentUserError(
	error: unknown
): error is DatamateAgentUserError {
	return (
		error instanceof DatamateAgentUserError ||
		(isRecord(error) &&
			error.name === "DatamateAgentUserError" &&
			error.expose === true &&
			typeof error.code === "string" &&
			typeof error.message === "string")
	);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
