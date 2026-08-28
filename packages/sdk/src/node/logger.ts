export interface Logger {
	debug(msg: string, data?: Record<string, unknown>): void;
	error(msg: string, data?: Record<string, unknown>): void;
	info(msg: string, data?: Record<string, unknown>): void;
	warn(msg: string, data?: Record<string, unknown>): void;
}

export function createLogger(debug = false): Logger {
	return createConsoleLogger(debug);
}

function formatData(data?: Record<string, unknown>): string {
	if (!data) {
		return "";
	}
	try {
		return JSON.stringify(data);
	} catch {
		return "[unserializable]";
	}
}

function createConsoleLogger(debug: boolean): Logger {
	const noop = () => {};

	return {
		info(msg: string, data?: Record<string, unknown>) {
			if (debug) {
				console.info(`[Datamate] ${msg}`, formatData(data));
			}
		},
		error(msg: string, data?: Record<string, unknown>) {
			if (debug) {
				console.error(`[Datamate] ${msg}`, formatData(data));
			}
		},
		warn(msg: string, data?: Record<string, unknown>) {
			if (debug) {
				console.warn(`[Datamate] ${msg}`, formatData(data));
			}
		},
		debug: debug
			? (msg: string, data?: Record<string, unknown>) => {
					console.debug(`[Datamate] ${msg}`, formatData(data));
				}
			: noop,
	};
}

export function createNoopLogger(): Logger {
	const noop = () => {};
	return {
		info: noop,
		error: noop,
		warn: noop,
		debug: noop,
	};
}
