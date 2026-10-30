---
title: Hosts
description: Which coding agents Echo can speak for, and what each one announces.
---

Wiring a host is optional. Any process that can POST JSON to `localhost:3246/notify` can use Echo.

| Host | `--adapter` | Completions | Needs-you announcements |
| --- | --- | --- | --- |
| Claude Code | `claudecode` | Yes, plus `/echo-voice`, `/echo-mute`, `/echo-mode` | Yes (questions, permissions, idle) |
| Pi | `pi` | Yes, plus session start | Yes |
| oh-my-pi | `omp` | Yes | Yes |
| Empryo | `empryo` | Yes, plus greeting | Yes (approval, question, plan review) |
| Codex | `codex` | Yes, opt-in session start | No |
| Grok Build | `grok` | Yes | No |
| Jcode | `jcode` | Yes (🗣️ lines) | No |
| OpenCode | `opencode` | Yes, on session idle | No |
| MCP (voice ask for Claude Code) | `mcp` | n/a | n/a |
| Scripts / `curl` | `none` | Whatever you POST | n/a |

Notes:
- Subagents stay quiet on all hosts.
- Headless Pi, omp, and Empryo runs stay quiet.
- OpenCode has no headless check yet, so `opencode run` still speaks.
- Uninstalling Echo does not remove adapter registrations.
