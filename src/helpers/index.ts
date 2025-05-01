import https from "https";

/**
 * Fetches a file from the behavio/behavio-api-docs private GitHub repo using the GitHub API.
 * @param project The project name (e.g. "trendaro-admin-v2")
 * @param schemaName The schema file name (without .yaml extension)
 * @returns The YAML file content as a string, or null if not found or unauthorized
 */
async function fetchSchemaFromGithub(
  project: string,
  schemaName: string
): Promise<string | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  const path = `projects/${project}/${schemaName}.yaml`;
  const options = {
    hostname: "api.github.com",
    path: `/repos/behavio/behavio-api-docs/contents/${path}`,
    headers: {
      "User-Agent": "bh-openapi-mcp",
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3.raw",
    },
  };
  return new Promise((resolve) => {
    https
      .get(options, (res) => {
        if (res.statusCode !== 200) return resolve(null);
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", () => resolve(null));
  });
}

/**
 * Lists all schema names (without .yaml extension) in a given project folder in behavio-api-docs on GitHub.
 * @param project The project name (e.g. "trendaro-admin-v2")
 * @returns Array of schema names (without .yaml extension)
 */
export async function listSchemasInProject(project: string): Promise<string[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return [];
  const path = `projects/${project}`;
  const options = {
    hostname: "api.github.com",
    path: `/repos/behavio/behavio-api-docs/contents/${path}`,
    headers: {
      "User-Agent": "bh-openapi-mcp",
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  };
  return new Promise((resolve) => {
    https
      .get(options, (res) => {
        if (res.statusCode !== 200) return resolve([]);
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const files = JSON.parse(data);
            const schemas = files
              .filter((f: any) => f.type === "file" && f.name.endsWith(".yaml"))
              .map((f: any) => f.name.replace(/\.yaml$/, ""));
            resolve(schemas);
          } catch {
            resolve([]);
          }
        });
      })
      .on("error", () => resolve([]));
  });
}

/**
 * Lists all project names (folder names) in behavio-api-docs on GitHub.
 * @returns Array of project names (folder names)
 */
export async function listProjects(): Promise<string[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return [];
  const path = `projects`;
  const options = {
    hostname: "api.github.com",
    path: `/repos/behavio/behavio-api-docs/contents/${path}`,
    headers: {
      "User-Agent": "openapi-mcp",
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  };
  return new Promise((resolve) => {
    https
      .get(options, (res) => {
        if (res.statusCode !== 200) return resolve([]);
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const files = JSON.parse(data);
            const projects = files
              .filter((f: any) => f.type === "dir")
              .map((f: any) => f.name);
            resolve(projects);
          } catch {
            resolve([]);
          }
        });
      })
      .on("error", () => resolve([]));
  });
}

export async function findSchemaYaml(
  schemaName: string,
  _baseDir = undefined,
  project = "trendaro-admin-v2"
): Promise<string | null> {
  return await fetchSchemaFromGithub(project, schemaName);
}
