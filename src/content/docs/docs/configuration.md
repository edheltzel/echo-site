---
title: Configuration and data
description: Where Echo keeps config, state, and logs.
---
| What | Where |
|---|---|
| Config | `~/.config/echo/config.json` (name, sounds, voice ask settings), voices.json, pronunciations.json |
| Daemon | LaunchAgent `com.echo`, `localhost:3246` |
| Voice ask | coordinator `:32468`, capture cache `~/Library/Caches/echo/converse/` |
| Logs | `~/Library/Logs/echo.log` |
| State | mute/mode files (`ECHO_MUTE_STATE_PATH`, `ECHO_MODE_STATE_PATH`), `~/.local/state/echo/playback-state.json` |

Muting leaves the daemon running. Disabling the daemon unloads `com.echo`. See [operations](https://github.com/edheltzel/Echo/blob/master/docs/operations.md#mute-vs-daemon-disable). For the full list of settings, see [configuration.md](https://github.com/edheltzel/Echo/blob/master/docs/configuration.md).
