import { describe, expect, it } from "bun:test";
import {
	createAgentJson,
	createApiCatalog,
	createAuthorizationServerMetadata,
	createMcpManifest,
	createMcpServerCard,
	createProtectedResourceMetadata,
	developerResources,
} from "./agent-discovery";

describe("agent discovery resources", () => {
	it("lists Datamate OpenAPI and MCP resources by name", () => {
		const resourceText = developerResources
			.map((resource) => `${resource.title} ${resource.url}`)
			.join("\n");

		expect(resourceText).toContain("Datamate OpenAPI Spec");
		expect(resourceText).toContain("https://www.datamate.cc/openapi.json");
		expect(resourceText).toContain("Datamate MCP Server");
		expect(resourceText).toContain("https://www.datamate.cc/.well-known/mcp.json");
		expect(resourceText).toContain("Datamate API Catalog");
		expect(resourceText).toContain(
			"https://www.datamate.cc/.well-known/api-catalog"
		);
	});

	it("points MCP discovery at the Streamable HTTP server", () => {
		const manifest = createMcpManifest();

		expect(manifest.name).toBe("Datamate");
		expect(manifest.server.url).toBe("https://api.datamate.cc/v1/mcp/");
		expect(manifest.server.transport).toBe("streamable-http");
		expect(manifest.authentication.name).toBe("x-api-key");
		expect(manifest.openapi_url).toBe("https://www.datamate.cc/openapi.json");
	});

	it("publishes agent, MCP card, API catalog, and auth metadata", () => {
		const agent = createAgentJson();
		const serverCard = createMcpServerCard();
		const catalog = createApiCatalog();
		const prm = createProtectedResourceMetadata();
		const asMetadata = createAuthorizationServerMetadata();

		expect(agent.endpoints.auth_md).toBe("https://www.datamate.cc/auth.md");
		expect(serverCard.serverUrl).toBe("https://api.datamate.cc/v1/mcp/");
		expect(catalog.linkset[0]["service-desc"][0].href).toBe(
			"https://www.datamate.cc/openapi.json"
		);
		expect(prm.authorization_servers).toContain("https://api.datamate.cc");
		expect(asMetadata.agent_auth.identity_types_supported).toContain(
			"identity_assertion"
		);
	});
});
