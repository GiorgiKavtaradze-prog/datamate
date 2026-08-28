import { describe, expect, it } from "bun:test";
import { API_SCOPES } from "./api-scopes";
import {
	type AgentDiscoveryUrls,
	createAuthorizationServerMetadata,
	createMcpServerCard,
	parseNlwebAskBody,
} from "./agent-discovery";

const urls = {
	siteUrl: "https://www.datamate.cc",
	apiUrl: "https://api.datamate.cc",
	basketUrl: "https://basket.datamate.cc",
	dashboardUrl: "https://app.datamate.cc",
	openapiSpecUrl: "https://www.datamate.cc/openapi.json",
	apiOpenapiSpecUrl: "https://api.datamate.cc/openapi.json",
	mcpServerUrl: "https://api.datamate.cc/v1/mcp/",
	mcpManifestUrl: "https://www.datamate.cc/.well-known/mcp.json",
} satisfies AgentDiscoveryUrls;

describe("agent discovery builders", () => {
	it("uses the shared API scope registry in auth metadata", () => {
		const metadata = createAuthorizationServerMetadata(urls);

		expect(API_SCOPES).toContain("track:events");
		expect(metadata.scopes_supported).toBe(API_SCOPES);
		expect(metadata.agent_auth.register_uri).toBe(
			"https://api.datamate.cc/agent-auth/register"
		);
	});

	it("advertises only the real MCP guide resource", () => {
		const card = createMcpServerCard(urls);

		expect(card.resources).toEqual([
			{
				uri: "datamate://guide",
				mimeType: "text/markdown",
				description: "MCP workflow guide and query conventions.",
			},
		]);
	});

	it("parses NLWeb ask bodies without casts", () => {
		expect(
			parseNlwebAskBody({
				question: "What is Datamate?",
				prefer: { streaming: true },
			})
		).toEqual({ query: "What is Datamate?", streaming: true });
		expect(parseNlwebAskBody("not an object")).toEqual({
			query: "",
			streaming: false,
		});
	});
});
