import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs";
import { findSchemaYaml } from "./helpers/index.js";

const server = new McpServer({
  name: "bh-openapi",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool(
  "get-schema-info",
  "Get the YAML definition of a schema by name",
  {
    schema: z.string().describe("Name of the schema (without .yaml extension)"),
  },
  async ({ schema }) => {
    const schemaPath = findSchemaYaml(schema);
    if (!schemaPath) {
      return {
        content: [
          {
            type: "text",
            text: `Schema "${schema}" not found.`,
          },
        ],
      };
    }
    try {
      const yamlContent = fs.readFileSync(schemaPath, "utf8");
      return {
        content: [
          {
            type: "text",
            text: `YAML for schema "${schema}":\n\n${yamlContent}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to read schema file: ${err}`,
          },
        ],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("bh-openapi MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
