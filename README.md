# bh-openapi-mcp

Model-Driven Control Plane for OpenAPI

## Overview

This project provides a Model Context Protocol (MCP) server for OpenAPI-based schemas. It enables tools and resources to be exposed via a standardized interface, supporting schema discovery and introspection.

## Features

- MCP server implementation using `@modelcontextprotocol/sdk`
- Tool for retrieving YAML schema definitions by name
- TypeScript-based codebase
- Example integration with OpenAPI schemas (see `schemas/` directory)

## Project Structure

- `src/` - Source code for the MCP server and helpers
- `schemas/` - OpenAPI YAML schema files
- `build/` - Compiled output
- `package.json` - Project configuration and dependencies

## Getting Started

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
