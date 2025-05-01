import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerGetSchemaInfoTool } from "./tools/getSchemaInfo.js";
import { registerListProjectsTool } from "./tools/listProjects.js";

const server = new McpServer({
  name: "bh-openapi",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

registerGetSchemaInfoTool(server);
registerListProjectsTool(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("bh-openapi MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
