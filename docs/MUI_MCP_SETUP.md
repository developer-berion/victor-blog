# MUI MCP Setup

The MUI MCP server is installed locally in this repository as a development dependency.

## Installed Package

- `@mui/mcp`

## Local Script

- `npm run mui:mcp`

## What It Is For

- Provide MUI-aware design and implementation guidance.
- Inspect or reason about MUI patterns from a client that supports MCP.
- Keep the system design aligned with the official MUI docs.

## Notes

- This repository has the package installed, but the active MCP connection depends on the editor or agent client you are using.
- If your client supports MCP, point it at the local `mcp` binary exposed by the package.
- Use this together with `docs/MUI_DESIGN_SYSTEM.md` and the official MUI docs.

