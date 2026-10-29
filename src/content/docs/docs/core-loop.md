---
title: Core loop
description: How Echo turns a host event into spoken audio on your Mac.
---

Echo’s loop is small on purpose: a host observes something worth saying, POSTs JSON to the local daemon, and the daemon speaks (or plays a sound) if voice is allowed.

## The path

1. **Host event.** A coding agent finishes a turn, hits a permission or approval wall, or you POST yourself.
2. **Adapter or curl.** A wired adapter extracts a short user-facing line (often the trailing `🗣️` completion) and POSTs to `/notify`. Or you `curl` the same endpoint.
3. **Daemon gate.** The request becomes speech only when voice is on, TTS mute is off, output mode is `speech`, and no live capture is holding the speaker. Otherwise you get a short sound, silence, or a held queue entry.
4. **Provider chain.** Speech goes through the configured TTS chain (default edge-tts online; Kokoro and macOS `say` stay local). Config lives in `~/.config/echo/config.json` and `core/voices.json`.
5. **You hear it.** Ambient completion audio — not a listen-speak conversation.

```
Host / curl  →  POST /notify  →  Echo daemon (:3246)  →  speaker
```

## When it speaks

Typical spoken lines:

- Turn-completion lines from wired hosts (Claude Code, Pi, oh-my-pi, Jcode, Grok Build, Codex)
- Needs-input / approval / attention lines from Claude Code, Pi, and oh-my-pi
- Session-start greetings when that host has greetings on (Pi and oh-my-pi default on; Claude Code, Jcode, Grok, and Codex default off)
- Anything you POST yourself, including the Hello from Echo smoke
- `cli/echo replay` of the last N lines that actually played

If a completion line is a question, it still speaks. Density modes (`announce` / `brief` / `consult` / `think`) change how dense that line is; they are not a second lifecycle.

## When an agent needs you

For Claude Code, Pi, and oh-my-pi, Echo speaks **once** when the host cannot continue without you. Adapters detect the wait and POST `/notify`. Completions that happen to be questions still speak as the turn-end line.

| Situation | What you hear |
| --- | --- |
| Claude Code AskUserQuestion or permission dialog | One question or approval line |
| Claude Code idle / needs-input | Persona paused and needs attention |
| Pi / omp tool approval or blocking UI prompt | Approval, question, or attention |
| OpenCode, Jcode, Grok, Codex | No dedicated wait ping; completions still speak at turn end where wired |

Retries for the same pending request do not speak again. Mute and daemon disable apply the same as any other notify.

## When it stays quiet

Usual reasons you hear nothing:

- Daemon not loaded (stopped / uninstalled) — that is disable, not mute
- No adapter installed and nothing POSTed `/notify`
- Speaker mute on (`mute on` / `mute all`); `mute tts` plays sounds instead of speech
- Host has completions or greetings off
- Subagent turns (suppressed by default); some headless Pi/omp runs stay quiet
- Capture in progress (Echo will not talk over an open mic)
- Stale line dropped from the play queue
- Wait ping not shipped for that host (completions may still fire at turn end)

## Sounds instead of speech

Three sounds: **request** (needs you), **done** (turn finished), **generic** (everything else). They play in sounds-only mode (`cli/echo mode sounds`) or when `mute tts` swaps speech for sound. `mute all` is total silence. Voice-ask and `replay` still speak.

## States worth knowing

| State | What you notice |
| --- | --- |
| Idle | Daemon up, nothing playing; `/health` healthy |
| Speaking | Line in the speaker; play queue in flight |
| Muted | Requests succeed; speaker off (sounds may still play under `tts`) |
| Sounds only | Short sound per notification, no speech |
| Stopped | `/health` does not connect; LaunchAgent not loaded |
| Held for capture | Banner may fire; speaker waits |
| Error | `cli/echo doctor` ends DEGRADED; check `~/Library/Logs/echo.log` |

`accepted` on `/notify` means the daemon took the line, not that playback finished. Prove speech with your ear.

## Next

- [Install guide](/docs/install/)
- [Usage](/docs/usage/)
- [Hosts](/docs/hosts/)
- Product: [what Echo does](https://github.com/edheltzel/Echo/blob/main/docs/what-echo-does.md)
