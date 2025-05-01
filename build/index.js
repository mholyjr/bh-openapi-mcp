import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
// Create server instance
const server = new McpServer({
    name: "bh-openapi",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});
/**
 * Recursively searches for a YAML file matching the schema name in the schemas directory.
 * @param schemaName The name of the schema to find (without .yaml extension).
 * @param baseDir The base directory to start searching from (default: "./schemas").
 * @returns The absolute path to the found YAML file, or null if not found.
 */
function findSchemaYaml(schemaName, baseDir = path.resolve(__dirname, "../schemas")) {
    const files = fs.readdirSync(baseDir);
    for (const file of files) {
        const fullPath = path.join(baseDir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            const result = findSchemaYaml(schemaName, fullPath);
            if (result)
                return result;
        }
        else if (file.toLowerCase() === `${schemaName.toLowerCase()}.yaml`) {
            return fullPath;
        }
    }
    return null;
}
server.tool("get-schema-info", "Get the YAML definition of a schema by name", {
    schema: z.string().describe("Name of the schema (without .yaml extension)"),
}, async ({ schema }) => {
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
    }
    catch (err) {
        return {
            content: [
                {
                    type: "text",
                    text: `Failed to read schema file: ${err}`,
                },
            ],
        };
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("bh-openapi MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
