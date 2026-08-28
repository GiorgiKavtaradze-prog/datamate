import { setAiRequestLoggerProvider } from "@datamate/ai/lib/request-logger";
import { shutdownPostgres } from "@datamate/db";
import { setRpcRequestLoggerProvider } from "@datamate/rpc/log-context";
import {
	createDatamateEvlogEnv,
	datamateEvlogRedaction,
} from "@datamate/shared/evlog-redaction";
import { App } from "@slack/bolt";
import { initLogger, log } from "evlog";
import { DatamateAgentClient } from "@/agent/agent-client";
import { resolveSlackConfig } from "@/config";
import {
	captureSlackError,
	flushBatchedSlackDrain,
	getActiveSlackLog,
	slackLoggerDrain,
} from "@/lib/evlog-slack";
import {
	abortAllSlackActiveRuns,
	waitForSlackActiveRuns,
} from "@/slack/active-runs";
import {
	createSlackAuthorize,
	SlackInstallationStore,
} from "@/slack/installations";
import { registerSlackListeners } from "@/slack/listeners";

const SHUTDOWN_RUN_SETTLE_TIMEOUT_MS = 10_000;

initLogger({
	env: createDatamateEvlogEnv("slack"),
	redact: datamateEvlogRedaction,
	drain: slackLoggerDrain,
	sampling: {},
});

setAiRequestLoggerProvider(getActiveSlackLog);
setRpcRequestLoggerProvider(getActiveSlackLog);

process.on("unhandledRejection", (reason) => {
	captureSlackError(reason, { process: "unhandledRejection" });
});

process.on("uncaughtException", (error) => {
	captureSlackError(error, { process: "uncaughtException" });
});

async function main() {
	const config = resolveSlackConfig();

	if (!config.enabled) {
		log.info({ lifecycle: "disabled", reason: config.reason });
		await flushBatchedSlackDrain();
		process.exit(0);
	}

	const installations = new SlackInstallationStore(config.crypto);

	const app = new App({
		appToken: config.appToken,
		authorize: createSlackAuthorize(installations),
		clientOptions: {
			slackApiUrl: "https://slack.com/api",
		},
		logLevel: config.logLevel,
		signingSecret: config.signingSecret,
		socketMode: config.socketMode,
	});

	registerSlackListeners(
		app,
		new DatamateAgentClient(installations),
		installations
	);

	try {
		if (config.socketMode) {
			await app.start();
		} else {
			await app.start(config.port);
		}
		console.info(
			config.socketMode
				? "[slack] Datamate bot is running in Socket Mode"
				: `[slack] Datamate bot is listening on port ${config.port}`
		);
		log.info({
			lifecycle: "started",
			slack_socket_mode: config.socketMode,
			...(config.socketMode ? {} : { slack_port: config.port }),
		});
	} catch (error) {
		captureSlackError(error, { lifecycle: "start_failed" });
		await flushBatchedSlackDrain();
		process.exit(1);
	}

	let shuttingDown = false;

	async function shutdown(signal: string) {
		if (shuttingDown) {
			return;
		}
		shuttingDown = true;
		const abortedRuns = abortAllSlackActiveRuns("shutdown");
		log.info({
			lifecycle: "shutdown",
			signal,
			slack_aborted_runs: abortedRuns,
		});
		await app
			.stop()
			.catch((error) =>
				captureSlackError(error, { lifecycle: "slack_stop_failed" })
			);
		await waitForSlackActiveRuns(SHUTDOWN_RUN_SETTLE_TIMEOUT_MS);
		await shutdownPostgres().catch((error) =>
			captureSlackError(error, { lifecycle: "postgres_shutdown_failed" })
		);
		await flushBatchedSlackDrain().catch((error) =>
			captureSlackError(error, { lifecycle: "drain_flush_failed" })
		);
		process.exit(0);
	}

	process.on("SIGTERM", () => shutdown("SIGTERM"));
	process.on("SIGINT", () => shutdown("SIGINT"));
}

main().catch(async (error) => {
	captureSlackError(error, { lifecycle: "main_failed" });
	await flushBatchedSlackDrain();
	process.exit(1);
});
