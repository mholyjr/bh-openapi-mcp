import * as fs from "fs";
import * as path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Recursively searches for a YAML file matching the schema name in the schemas directory.
 * @param schemaName The name of the schema to find (without .yaml extension).
 * @param baseDir The base directory to start searching from (default: "./schemas").
 * @returns The absolute path to the found YAML file, or null if not found.
 */
export function findSchemaYaml(
  schemaName: string,
  baseDir = path.resolve(__dirname, "../schemas")
): string | null {
  const files = fs.readdirSync(baseDir);
  for (const file of files) {
    const fullPath = path.join(baseDir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const result = findSchemaYaml(schemaName, fullPath);
      if (result) return result;
    } else if (file.toLowerCase() === `${schemaName.toLowerCase()}.yaml`) {
      return fullPath;
    }
  }
  return null;
}
