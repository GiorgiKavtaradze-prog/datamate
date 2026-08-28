import { resolveApiKey, type ApiKeyRow } from "@datamate/api-keys/resolve";
import {
	appendToConversation,
	getConversationHistory,
	type ConversationMessage,
} from "../ai/mcp/conversation-store";
import {
	runMcpAgent,
	streamMcpAgentText,
	runMcpAgentWithTrace,
	type McpAgentToolTrace,
} from "../ai/mcp/run-agent";
import type { DatamateAgentSlackContext } from "../ai/mcp/slack-context";
import type { LanguageModelUsage } from "ai";

export type { ConversationMessage } from "../ai/mcp/conversation-store";
export {
	DatamateAgentUserError,
	isDatamateAgentUserError,
	type DatamateAgentUserErrorCode,
} from "./errors";
export {
	classifySlackThreadReplyRelevance,
	type SlackThreadReplyMessage,
	type SlackThreadReplyRelevance,
	type SlackThreadReplyRelevanceInput,
} from "./slack-relevance";
export type {
	DatamateAgentSlackChannelHistoryResult,
	DatamateAgentSlackContext,
	DatamateAgentSlackMessage,
	DatamateAgentSlackThreadResult,
} from "../ai/mcp/slack-context";

export type DatamateAgentSource = "dashboard" | "mcp" | "slack";
export type DatamateAgentBillingMode = "bill" | "skip";
export type DatamateAgentMutationMode = "allow" | "dry-run";

export type DatamateAgentActor =
	| {
			apiKey: ApiKeyRow;
			requestHeaders?: Headers;
			type: "api_key";
			userId?: string | null;
	  }
	| {
			expectedOrganizationId?: string | null;
			requestHeaders?: Headers;
			secret: string;
			type: "api_key_secret";
			userId?: string | null;
	  }
	| {
			requestHeaders: Headers;
			type: "session";
			userId: string;
	  };

export interface DatamateAgentOptions {
	abortSignal?: AbortSignal;
	actor: DatamateAgentActor;
	billingMode?: DatamateAgentBillingMode;
	conversationId?: string;
	history?: ConversationMessage[];
	input: string;
	memoryUserId?: string | null;
	modelOverride?: string | null;
	mutationMode?: DatamateAgentMutationMode;
	onToolEvent?: (toolNames: string[]) => void;
	persistConversation?: boolean;
	slackContext?: DatamateAgentSlackContext | null;
	source?: DatamateAgentSource;
	timeoutMs?: number;
	timezone?: string;
	websiteDomain?: string | null;
	websiteId?: string | null;
}

export interface DatamateAgentResult {
	answer: string;
	conversationId: string;
}

export type DatamateAgentToolTrace = McpAgentToolTrace;

export interface DatamateAgentTraceResult extends DatamateAgentResult {
	steps: number;
	toolCalls: DatamateAgentToolTrace[];
	usage: LanguageModelUsage;
}

interface ResolvedAgentActor {
	apiKey: ApiKeyRow | null;
	requestHeaders: Headers;
	userId: string | null;
}

export async function askDatamateAgent(
	options: DatamateAgentOptions
): Promise<DatamateAgentResult> {
	const prepared = await prepareDatamateAgentCall(options);
	const answer = await runMcpAgent({
		apiKey: prepared.actor.apiKey,
		conversationId: prepared.conversationId,
		priorMessages: prepared.history,
		question: options.input,
		requestHeaders: prepared.actor.requestHeaders,
		abortSignal: options.abortSignal,
		billingMode: options.billingMode,
		memoryUserId: prepared.memoryUserId,
		mutationMode: options.mutationMode,
		slackContext: options.slackContext,
		source: prepared.source,
		modelOverride: options.modelOverride,
		storeMemory: options.persistConversation !== false,
		timeoutMs: options.timeoutMs,
		timezone: options.timezone,
		userId: prepared.actor.userId,
		websiteDomain: options.websiteDomain,
		websiteId: options.websiteId,
	});

	await persistAgentConversation(options, prepared, answer);

	return { answer, conversationId: prepared.conversationId };
}

export async function traceDatamateAgent(
	options: DatamateAgentOptions
): Promise<DatamateAgentTraceResult> {
	const prepared = await prepareDatamateAgentCall(options);
	const result = await runMcpAgentWithTrace({
		apiKey: prepared.actor.apiKey,
		abortSignal: options.abortSignal,
		conversationId: prepared.conversationId,
		billingMode: options.billingMode,
		modelOverride: options.modelOverride,
		memoryUserId: prepared.memoryUserId,
		mutationMode: options.mutationMode,
		priorMessages: prepared.history,
		question: options.input,
		requestHeaders: prepared.actor.requestHeaders,
		source: prepared.source,
		slackContext: options.slackContext,
		storeMemory: options.persistConversation !== false,
		timeoutMs: options.timeoutMs,
		timezone: options.timezone,
		userId: prepared.actor.userId,
		websiteDomain: options.websiteDomain,
		websiteId: options.websiteId,
	});

	await persistAgentConversation(options, prepared, result.answer);

	return {
		answer: result.answer,
		conversationId: prepared.conversationId,
		steps: result.steps,
		toolCalls: result.toolCalls,
		usage: result.usage,
	};
}

export async function* streamDatamateAgent(
	options: DatamateAgentOptions
): AsyncGenerator<string> {
	const prepared = await prepareDatamateAgentCall(options);
	let answer = "";

	for await (const chunk of streamMcpAgentText({
		apiKey: prepared.actor.apiKey,
		abortSignal: options.abortSignal,
		conversationId: prepared.conversationId,
		billingMode: options.billingMode,
		memoryUserId: prepared.memoryUserId,
		priorMessages: prepared.history,
		question: options.input,
		requestHeaders: prepared.actor.requestHeaders,
		source: prepared.source,
		slackContext: options.slackContext,
		modelOverride: options.modelOverride,
		mutationMode: options.mutationMode,
		onToolEvent: options.onToolEvent,
		storeMemory: options.persistConversation !== false,
		timeoutMs: options.timeoutMs,
		timezone: options.timezone,
		userId: prepared.actor.userId,
		websiteDomain: options.websiteDomain,
		websiteId: options.websiteId,
	})) {
		answer += chunk;
		yield chunk;
	}

	await persistAgentConversation(options, prepared, answer);
}

async function prepareDatamateAgentCall(options: DatamateAgentOptions) {
	const actor = await resolveDatamateAgentActor(options.actor);
	const conversationId = options.conversationId ?? crypto.randomUUID();
	const memoryUserId = options.memoryUserId ?? actor.userId;
	const history =
		options.history ??
		(await getConversationHistory(conversationId, memoryUserId, actor.apiKey));

	return {
		actor,
		conversationId,
		history: history.length > 0 ? history : undefined,
		memoryUserId,
		source: options.source ?? "mcp",
	};
}

async function resolveDatamateAgentActor(
	actor: DatamateAgentActor
): Promise<ResolvedAgentActor> {
	if (actor.type === "session") {
		return {
			apiKey: null,
			requestHeaders: actor.requestHeaders,
			userId: actor.userId,
		};
	}

	if (actor.type === "api_key") {
		return {
			apiKey: actor.apiKey,
			requestHeaders: actor.requestHeaders ?? new Headers(),
			userId: "userId" in actor ? (actor.userId ?? null) : actor.apiKey.userId,
		};
	}

	const requestHeaders =
		actor.requestHeaders ?? createApiKeyHeaders(actor.secret);
	const result = await resolveApiKey(requestHeaders);
	if (!result.key) {
		throw new Error(`Datamate API key is ${result.outcome}.`);
	}
	if (
		actor.expectedOrganizationId &&
		result.key.organizationId !== actor.expectedOrganizationId
	) {
		throw new Error("Datamate API key does not belong to this organization.");
	}

	return {
		apiKey: result.key,
		requestHeaders,
		userId: "userId" in actor ? (actor.userId ?? null) : result.key.userId,
	};
}

async function persistAgentConversation(
	options: DatamateAgentOptions,
	prepared: Awaited<ReturnType<typeof prepareDatamateAgentCall>>,
	answer: string
): Promise<void> {
	if (options.persistConversation === false) {
		return;
	}

	await appendToConversation(
		prepared.conversationId,
		prepared.memoryUserId,
		prepared.actor.apiKey,
		options.input,
		answer.trim() || "No response generated.",
		prepared.history
	);
}

function createApiKeyHeaders(secret: string): Headers {
	return new Headers({ Authorization: `Bearer ${secret}` });
}
