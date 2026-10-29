---
title: Hosts
description: Which coding agents Echo can speak for, and how each adapter attaches.
---

Echo’s core is host-neutral. Adapters observe host lifecycle events and POST to `localhost:3246/notify`. Wiring a host is optional; `curl` alone is enough to hear speech.

## Support matrix

| Host | Completion speech | Needs-you wait ping | Notes |
| --- | --- | --- | --- |
| Claude Code | Yes | Yes | Hooks + `/echo-voice`, `/echo-mute`, `/echo-mode`. Optional mute/mode plugin. |
| Pi | Yes | Yes | Extension / packages reconcile. Greetings default on. |
| oh-my-pi (omp) | Yes | Yes | Counterpart of Pi adapter; own package. Live chat path is separate from Echo mute. |
| Jcode | Yes | No dedicated wait ping | Lifecycle `🗣️` completions. |
| Grok Build | Yes | No dedicated wait ping | Lifecycle completions; mute/mode as skills. |
| Codex | Yes | No dedicated wait ping | Completions + opt-in session starts. |
| OpenCode | Completion when idle | No dedicated wait ping | Mute + mode commands; subagent sessions stay quiet. |
| Raw HTTP / curl | Yes | You choose the line | Any client that POSTs `/notify`. |
| MCP adapter | — | — | Optional one-shot voice ask for Claude Code (Pi/omp already have it). |

Subagents stay quiet by default. Headless Pi and omp runs (`json` / `print`, or no UI) stay quiet.

## Install an adapter

From an Echo checkout, after the core is healthy:

```bash
cli/echo install --adapter claudecode
cli/echo install --adapter pi
cli/echo install --adapter omp
cli/echo install --adapter jcode
cli/echo install --adapter grok
cli/echo install --adapter codex
cli/echo install --adapter opencode
cli/echo install --adapter mcp
```

`scripts/install.sh` re-reconciles every installed adapter on every run. Registrations are idempotent and prune stale paths (repo renames). Prefer `cli/echo install` over hand-editing host config.

Restart each host after install.

## Adapter rules (for contributors)

Adapters:

1. Observe host lifecycle events
2. Extract a short user-facing message
3. POST to `/notify` with `source` / `session_id` when available
4. Treat notify failures as non-fatal warnings
5. Suppress child/subagent contexts
6. Detect needs-input themselves and POST a dedicated wait line (Claude Code, Pi, omp)

They import nothing from `core/`. Shared helpers come from `@echo/shared`. Full contract: product [adapters.md](https://github.com/edheltzel/Echo/blob/main/docs/adapters.md).

## Next

- [Install guide](/docs/install/)
- [Core loop](/docs/core-loop/)
- [Usage](/docs/usage/)
