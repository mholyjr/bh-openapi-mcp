# bh-openapi-mcp

MCP server to get openapi schemas

## Overview

This project provides a Model Context Protocol (MCP) server for OpenAPI-based schemas. It enables tools and resources to be exposed via a standardized interface, supporting schema discovery and introspection.

## Features

- MCP server implementation using `@modelcontextprotocol/sdk`
- Tool for retrieving YAML schema definitions by name and project from a private GitHub repository
- TypeScript-based codebase
- Fetching schemas directly from `@behavio/behavio-api-docs` repository to keep the data up-to-date

## Project Structure

- `src/` - Source code for the MCP server and helpers
- `build/` - Compiled output
- `package.json` - Project configuration and dependencies

## Getting Started

### VS Code Settings

```json
"mcp": {
    "servers": {
        "bh-openapi-mcp": {
            "type": "stdio",
            "command": "npx",
            "args": ["tsx", "[ABSOLUTE_PATH]/src/index.ts"],
            "env": {
                "GITHUB_TOKEN": "YOUR_GH_TOKEN"
            }
        }
    }
},
```

### Prerequisites

- Node.js (v16+ recommended)
- pnpm or npm

### Install dependencies

```sh
pnpm install
# or
npm install
```

### Build the project

```sh
pnpm build
# or
npm run build
```

### Start the server

```sh
pnpm start
# or
npm start
```

## Usage

The server exposes a tool called `get-schema-info` that allows you to retrieve the YAML definition of a schema by name. This is useful for schema discovery and documentation purposes.

## Development

- TypeScript is used for type safety.
