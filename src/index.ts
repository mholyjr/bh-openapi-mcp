import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  findSchemaYaml,
  listSchemasInProject,
  listProjects,
} from "./helpers/index.js";

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
  "Get the YAML definition of a schema by name and project",
  {
    schema: z
      .string()
      .describe("Name of the schema (without .yaml extension)")
      .optional(),
    project: z
      .string()
      .describe("Name of the project (folder in behavio-api-docs)")
      .default("trendaro-admin-v2"),
  },
  async ({ schema, project }) => {
    if (!schema) {
      const schemas = await listSchemasInProject(project);
      if (!schemas || schemas.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No schemas found in project \"${project}\".`,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: `Available schemas in project \"${project}\":\n- ${schemas.join(
              "\n- "
            )}\n\nPlease specify which schema you want to use.`,
          },
        ],
      };
    }
    const yamlContent = await findSchemaYaml(schema, undefined, project);
    if (!yamlContent) {
      return {
        content: [
          {
            type: "text",
            text: `Schema \"${schema}\" not found in project \"${project}\" or could not be fetched from GitHub.`,
          },
        ],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: `YAML for schema \"${schema}\" in project \"${project}\":\n\n${yamlContent}`,
        },
      ],
    };
  }
);

server.tool(
  "list-projects",
  "List all available projects (folders) in behavio-api-docs",
  {},
  async () => {
    const projects = await listProjects();
    if (!projects || projects.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No projects found in behavio-api-docs or could not be fetched from GitHub.`,
          },
        ],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: `Available projects in behavio-api-docs:\n- ${projects.join(
            "\n- "
          )}`,
        },
      ],
    };
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
