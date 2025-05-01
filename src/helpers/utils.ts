import https from "https";
import { fetchSchemaFromGithub } from "./github.js";

export async function findSchemaYaml(
  schemaName: string,
  _baseDir = undefined,
  project = "trendaro-admin-v2"
): Promise<string | null> {
  return await fetchSchemaFromGithub(project, schemaName);
}
