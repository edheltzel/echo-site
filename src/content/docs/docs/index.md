---
title: What Echo is
description: Echo speaks your coding agent's completion line out loud, so you hear when a turn ends or when the agent needs you.
---

**Hear your agents.**

Coding agents finish in silence. You find out they are waiting only when you look back at the terminal.

Echo is ambient completion audio for coding agents. When a turn ends, Echo speaks a short completion line so you can keep your eyes on the work. Supported hosts also announce when they cannot continue without you. Echo runs as one local daemon on your Mac at `localhost:3246`. Hosts never import it. They POST JSON to `/notify`, so even a `curl` counts as a host.

Open source · local daemon · macOS · Bun

## Without Echo / with Echo

| Without Echo | With Echo |
| --- | --- |
| The turn ends and the room stays quiet. | The completion line is spoken when the agent is done. |
| You notice the wait only when you look at the terminal. | You hear the line from across the desk. |
| The agent is blocked on a permission prompt. | Hosts with needs-input support announce the wait. |
| Each host notifies differently, if at all. | One daemon on `:3246` serves Claude Code, Pi, oh-my-pi, Codex, and a `curl`. |

## What Echo is not

- Not a conversation loop. Echo announces; it does not listen-speak-listen.
- Not a menu-bar recorder, notch UI, or push-to-talk tool.
- First-class speech-to-text is on the [roadmap (#179)](https://github.com/edheltzel/Echo/issues/179). An optional one-shot voice ask exists, but it is an extra, not the reason to install Echo.

## A note on privacy

The default voice provider is Microsoft **edge-tts, which is an online service**. Kokoro and macOS `say` stay on your machine.

## Next

- [Install Echo](/docs/install/)
- [How the loop works](/docs/core-loop/)
- [Everyday usage](/docs/usage/)
- [Supported hosts](/docs/hosts/)

