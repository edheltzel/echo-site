---
title: Usage
description: Everyday Echo CLI, health checks, mute, and the HTTP notify contract.
---

After install, day-to-day use is a small CLI plus an HTTP daemon on port **3246**.

## CLI at a glance

```bash
cli/echo doctor              # checks; ends Result: READY when healthy
cli/echo mute on|off|toggle|status|30m|on tts|on mic
cli/echo mode speech|sounds|status
cli/echo replay              # last spoken line
cli/echo replay 3            # last three (max 10)
curl -fsS http://localhost:3246/health
```

Mute is **machine-wide**. It silences Echo audio; notifications still arrive and are logged. It does not stop Oh My Pi live chat, which speaks on its own path. Taking the LaunchAgent down is daemon disable, not mute — see product [operations](https://github.com/edheltzel/Echo/blob/main/docs/operations.md#mute-vs-daemon-disable).

## Notify (the universal host API)

Any process can speak through Echo:

```bash
curl -X POST http://localhost:3246/notify \
  -H 'Content-Type: application/json' \
  -d '{"message":"Hello from Echo"}'
```

Adapters do the same POST with host metadata (`source`, `session_id`, completion vs wait lines). The wire contract is in product [http-api.md](https://github.com/edheltzel/Echo/blob/main/docs/http-api.md).

## Config

Persistent settings: `~/.config/echo/config.json` (optional; defaults apply if missing).

Secrets: only `ELEVENLABS_API_KEY` belongs in `~/.config/echo/.env` — never in `config.json`.

Voices and personas: `core/voices.json` inside the Echo checkout. After editing voices, use `cli/echo update` / re-stage as described in product operations.

Reload after config edits:

```bash
launchctl kickstart -k "gui/$UID/com.echo"
# or: bash scripts/restart.sh
```

## Logs and troubleshooting

- Daemon log: `~/Library/Logs/echo.log`
- Audio lifecycle JSONL: configured under `ECHO_AUDIO_LIFECYCLE_LOG` (default under `~/Library/Logs/echo/`)
- Wrong voice is not silence — identity default is edge `en-GB-RyanNeural`; see product getting-started troubleshooting and [voices.md](https://github.com/edheltzel/Echo/blob/main/docs/voices.md)

## Update and uninstall

```bash
git pull
cli/echo update
# or: bash scripts/install.sh --adapter <same adapter you use>
```

Uninstall and legacy services: product [operations.md](https://github.com/edheltzel/Echo/blob/main/docs/operations.md#uninstall).

## Next

- [Install guide](/docs/install/)
- [Core loop](/docs/core-loop/)
- [Hosts](/docs/hosts/)
