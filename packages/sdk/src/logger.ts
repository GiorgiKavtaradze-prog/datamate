class Logger {
	private debugEnabled = false;

	setDebug(enabled: boolean): void {
		this.debugEnabled = enabled;
	}

	debug(...args: unknown[]): void {
		if (this.debugEnabled) {
			console.log("[Datamate]", ...args);
		}
	}

	info(...args: unknown[]): void {
		console.info("[Datamate]", ...args);
	}

	warn(...args: unknown[]): void {
		console.warn("[Datamate]", ...args);
	}

	error(...args: unknown[]): void {
		console.error("[Datamate]", ...args);
	}

	table(data: unknown): void {
		if (this.debugEnabled) {
			console.table(data);
		}
	}

	time(label: string): void {
		if (this.debugEnabled) {
			console.time(`[Datamate] ${label}`);
		}
	}

	timeEnd(label: string): void {
		if (this.debugEnabled) {
			console.timeEnd(`[Datamate] ${label}`);
		}
	}

	json(data: unknown): void {
		if (this.debugEnabled) {
			console.log("[Datamate]", JSON.stringify(data, null, 2));
		}
	}
}

export const logger = new Logger();
