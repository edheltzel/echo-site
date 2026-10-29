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

=== END ===

## Seven answers
1. Tagline: "Hear your agents." The paragraph is in index.md.
2. Install: clone + `cli/echo install --adapter none` is the canonical path. `gap sync` is valid only for GAP-managed machines and is not in Echo's docs.
3. Flow cards: Agent finishes / Echo speaks / Needs you / Quiet when it should be / Replay and doctor.
4. Config and paths: see usage.md.
5. Pages: index, install, core-loop, usage (mute and config), hosts. Later: voices, HTTP API, troubleshooting.
6. Do not claim:
   - Offline: edge-tts is online.
   - STT or conversation mode.
   - Linux or Windows support.
   - Wait pings for Codex, Grok, Jcode, or OpenCode.
   - Per-session mute.
   - That 202 means "spoken".
   - That `gap sync` is universal.
   - A version newer than the v0.13.0 pin (v0.13.3 exists upstream).
   - That doctor is always READY: MacDaddy edge-tts health is unverified.
7. Accent: none is documented. Keep the stand-in `#f472b6`.
