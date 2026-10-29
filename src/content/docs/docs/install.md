---
title: Install
description: Install the Echo daemon on macOS, hear your first spoken notification, then wire a host.
---

## Requirements

- **macOS.** The installer writes a LaunchAgent (`com.echo`).
- **[Bun](https://bun.sh/).**

Voice notifications need nothing else.

## 1. Install the core

```bash
git clone https://github.com/edheltzel/Echo.git
cd Echo
cli/echo install --adapter none
```

`cli/echo` delegates to `scripts/install.sh`, so `bash scripts/install.sh --adapter none` does the same thing. The installer writes the LaunchAgent `com.echo` and starts the server on `localhost:3246`. It should finish with:

```
OK echo is healthy on :3246
```

Keep the clone in a permanent location. The daemon runs from a staged payload, and moving the repo needs the steps in Echo's [operations guide](https://github.com/edheltzel/Echo/blob/main/docs/operations.md#moved-or-renamed-the-repo).

### Using GAP?

If your machine is managed by GAP, `gap sync` installs Echo at the version pinned in GAP's lock (currently `echo@v0.13.0`) and runs Echo's `scripts/install.sh`. `gap doctor` runs `cli/echo doctor`.

## 2. Hear "Hello from Echo"

```bash
curl -X POST http://localhost:3246/notify \
  -H 'Content-Type: application/json' \
  -d '{"message":"Hello from Echo"}'
```

You should hear "Hello from Echo" and get JSON with `"status":"accepted"`. A `202` means the daemon accepted the line, not that playback has finished.

## 3. Check the install

```bash
cli/echo doctor      # health checks; look for READY when things look good
curl -fsS http://localhost:3246/health
```

`doctor` is a checklist, not a guarantee — prove speech with your ear on the Hello smoke.

## 4. Wire a host (optional)

```bash
cli/echo install --adapter claudecode
```

Adapter values: `none`, `claudecode`, `jcode`, `grok`, `codex`, `mcp`, `pi`, `omp`, `opencode`, `empryo`. See [Hosts](/docs/hosts/).

## If you hear nothing

1. Run `bash scripts/status.sh`. You should see `Service: com.echo` loaded and `Health: OK`. If you don't, rerun the install. If port 3246 is occupied but not answering, run `cli/echo doctor`.
2. Check the daemon log: `tail -20 ~/Library/Logs/echo.log`.
3. Check the voice-resolution log: `tail -3 ~/Library/Logs/echo/voice-resolution.jsonl`.

On the smoke test, the expected voice is `en-GB-RyanNeural` (British male, the identity voice). If you hear macOS `say` ("Daniel"), edge-tts failed. A common fix is `/opt/homebrew/bin/python3 -m pip install edge-tts` followed by a restart.

## Optional: voice ask

The one-shot voice ask needs `brew install sox` (required), plus a transcriber: `brew install yap` (or `whisper-cli` with a model).

## Update and uninstall

- After a `git pull`, run `cli/echo update`. It re-stages the payload and reloads, and it rolls back automatically if the new payload fails `/health`.
- `cli/echo uninstall` removes the LaunchAgent and the staged payload. It does not remove adapter registrations.

