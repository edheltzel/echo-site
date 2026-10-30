---
title: Usage
description: Everyday Echo commands, mute, sounds-only mode, configuration, and where Echo keeps its files.
---

## Everyday commands

```bash
cli/echo doctor              # health check, ends in Result: READY
cli/echo mute on             # also: off | toggle | status | 30m | on tts | on mic
cli/echo mode sounds         # sounds instead of speech; `mode speech` switches back
cli/echo replay              # last spoken line; `replay 3` for the last three
cli/echo update              # after git pull
bash scripts/start.sh | stop.sh | status.sh
```

## Mute

Mute applies to the **whole machine**, not one session. It survives daemon restarts.

- `all` (default): speaker plus mic capture are silent.
- `tts`: speech is replaced with short sounds. Notifications are still logged.
- `mic`: holds capture and voice ask only.
- Timed mute such as `30m` expires on the next notification after the deadline.

`/echo-mute` on hosts that register it runs the same command. There is no per-session mute. Mute does not stop Oh My Pi `/live`, which speaks on its own path.

**Mute vs daemon disable:** `bash scripts/stop.sh` unloads `com.echo`. That takes the service down; it is not mute.

## Sounds-only mode

`cli/echo mode sounds` (or `/echo-mode sounds`) plays one of three sounds instead of speech: **Request** (the agent needs you), **Done** (the turn finished), and **Generic** (everything else). The mode is global and survives restarts. Replay and voice-ask questions always speak.

## Configuration

- Settings: `~/.config/echo/config.json`. This file always wins.
- The only secret, `ELEVENLABS_API_KEY`, goes in `~/.config/echo/.env`. config.json rejects it.
- Useful keys: `ECHO_PREFERRED_NAME`, `ECHO_VOICE_SPEAK_COMPLETIONS`, `ECHO_VOICE_GREET_ON_START`, `ECHO_VOICE_SUPPRESS_SUBAGENTS`, `ECHO_SOUND_REQUEST` / `_DONE` / `_GENERIC`.
- A non-destructive migration moves old dotenv settings into config.json. It never edits or deletes the dotenv file.

## Where Echo keeps things

| What | Where |
| --- | --- |
| Config | `~/.config/echo/config.json` |
| Secret | `~/.config/echo/.env` |
| Service | LaunchAgent `com.echo`, port `3246` |
| Running payload | `~/Library/Application Support/echo/payload/` |
| Daemon log | `~/Library/Logs/echo.log` |
| Voice resolution log | `~/Library/Logs/echo/voice-resolution.jsonl` |
| Audio lifecycle log | `~/Library/Logs/echo/audio-lifecycle.jsonl` |
| Playback state | `~/.local/state/echo/playback-state.json` |

`/notify` and `/mute` are unauthenticated and listen on localhost only.

