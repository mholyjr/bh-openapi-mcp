import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { listProjects } from "../helpers/github.js";

/**
 * Registers the list-projects tool with the MCP server.
 * This tool lists all available project folders in the behavio-api-docs GitHub repository.
 * It is useful for schema discovery and as a parameter source for other tools.
 *
 * @param server - The MCP server instance to register the tool on.
 */
export function registerListProjectsTool(server: McpServer) {
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
}
