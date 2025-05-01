import { z } from "zod";
import { findSchemaYaml } from "../helpers/utils.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { listSchemasInProject } from "../helpers/github.js";

/**
 * Registers the get-schema-info tool with the MCP server.
 * This tool retrieves the YAML definition of a schema by name and project from the behavio-api-docs GitHub repository.
 * If no schema is specified, it lists available schemas in the selected project and prompts the user to choose one.
 *
 * @param server - The MCP server instance to register the tool on.
 */
export function registerGetSchemaInfoTool(server: McpServer) {
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
}
