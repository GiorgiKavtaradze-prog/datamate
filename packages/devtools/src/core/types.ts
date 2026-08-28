export interface DatamateTrackerLike {
	clear?: () => void;
	flush?: () => void;
	options?: Record<string, unknown>;
	screenView?: (properties?: Record<string, unknown>) => void;
	setGlobalProperties?: (properties: Record<string, unknown>) => void;
	track?: (name: string, properties?: Record<string, unknown>) => void;
}

export type DatamateDevtoolsEventType =
	| "track"
	| "screen_view"
	| "flush"
	| "clear"
	| "status";

export interface DatamateDevtoolsEvent {
	id: string;
	name: string;
	properties?: Record<string, unknown>;
	timestamp: number;
	type: DatamateDevtoolsEventType;
}

export interface DatamateTrackerSnapshot {
	anonymousId: string | null;
	clientId: string | null;
	hasAlias: boolean;
	hasTracker: boolean;
	isDisabled: boolean;
	isOptedOut: boolean;
	options: Record<string, unknown> | null;
	sessionId: string | null;
}

export interface DatamateQueueSnapshot {
	available: boolean;
	debugMode: boolean;
	flushing: {
		batch: boolean;
		track: boolean;
		vitals: boolean;
		errors: boolean;
	};
	interactionCount: number | null;
	isLikelyBot: boolean;
	maxScrollDepth: number | null;
	pageCount: number | null;
	pageStartTime: number | null;
	queues: {
		batch: number;
		track: number;
		vitals: number;
		errors: number;
	};
}

export type DatamateFlagSource =
	| "server"
	| "cache"
	| "default"
	| "error"
	| "override";

export interface DatamateFlagEntry {
	enabled: boolean;
	key: string;
	reason?: string;
	source: DatamateFlagSource;
	value: unknown;
	variant?: string;
}

export interface DatamateFlagsConfig {
	apiUrl: string | null;
	autoFetch: boolean;
	cacheSize: number;
	cacheTtl: number | null;
	clientId: string | null;
	defaults: Record<string, boolean | string | number>;
	disabled: boolean;
	environment: string | null;
	isPending: boolean;
	skipStorage: boolean;
	staleTime: number | null;
	user: {
		email: string | null;
		organizationId: string | null;
		teamId: string | null;
		userId: string | null;
	} | null;
}

export interface DatamateFlagsSnapshot {
	available: boolean;
	config: DatamateFlagsConfig | null;
	flags: DatamateFlagEntry[];
	isReady: boolean;
}

export interface DatamateFlagCatalogVariant {
	description?: string;
	key: string;
	type: "string" | "number" | "json";
	value: string | number;
	weight?: number;
}

export interface DatamateFlagCatalogEntry {
	defaultValue: boolean;
	description: string | null;
	id: string;
	key: string;
	status: "active" | "inactive" | "archived";
	type: "boolean" | "rollout" | "multivariant";
	variants?: DatamateFlagCatalogVariant[];
}

export type FlagCatalogStatus = "idle" | "loading" | "ready" | "error";

export interface FlagCatalogState {
	entries: DatamateFlagCatalogEntry[];
	error: string | null;
	fetchedAt: number | null;
	status: FlagCatalogStatus;
}

export type DiagnosticStatus = "ok" | "warn" | "fail" | "info";

export interface DiagnosticItem {
	hint?: string;
	id: string;
	label: string;
	status: DiagnosticStatus;
}

export interface DatamateIdentitySnapshot {
	anonymousId: string | null;
	globalProperties: Record<string, unknown>;
	profileId: string | null;
	sessionAgeMs: number | null;
	sessionId: string | null;
	sessionStartedAt: number | null;
	storageKeys: Array<{
		scope: "local" | "session";
		key: string;
		value: string | null;
	}>;
	urlParams: Record<string, string>;
}

export type DatamateDebugAction =
	| "clear"
	| "flush"
	| "screenView"
	| "trackTest"
	| "trackCustom"
	| "resetSession"
	| "refreshFlags"
	| "setGlobalProperty"
	| "removeGlobalProperty"
	| "clearGlobalProperties"
	| "setFlagOverride"
	| "clearFlagOverride";

export interface DatamateDevtoolsAdapter {
	clearEvents: () => void;
	getDiagnostics: () => DiagnosticItem[];
	getEvents: () => DatamateDevtoolsEvent[];
	getFlagsSnapshot: () => DatamateFlagsSnapshot;
	getIdentitySnapshot: () => DatamateIdentitySnapshot;
	getQueueSnapshot: () => DatamateQueueSnapshot;
	getSnapshot: () => DatamateTrackerSnapshot;
	instrument: () => void;
	runAction: (
		action: DatamateDebugAction,
		properties?: Record<string, unknown>
	) => void;
	subscribe: (listener: () => void) => () => void;
}

declare global {
	interface Window {
		datamate?: DatamateTrackerLike;
		datamateConfig?: Record<string, unknown>;
		datamateDisabled?: boolean;
		datamateOptedOut?: boolean;
		db?: DatamateTrackerLike;
	}
}
