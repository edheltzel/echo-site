---
title: Install guide
description: Install Echo on macOS with Bun, hear Hello from Echo, then wire a host adapter.
---

Echo installs from a source checkout on **macOS**. The installer writes a LaunchAgent (`com.echo`) and starts a daemon on `localhost:3246`. You need [Bun](https://bun.sh/) and `git`.

The marketing site may show `gap sync` as a GAP-family install shortcut. The product install below is the source-checkout path from the Echo repo. Use whichever matches how you manage GAP skills; both end at a healthy daemon on `:3246`.

## Prerequisites

- A Mac (LaunchAgent). Linux is best-effort for manual server runs only.
- [Bun](https://bun.sh/) — `curl -fsSL https://bun.sh/install | bash`
- `git`

```bash
bun --version
```

## 1. Get the code

```bash
git clone https://github.com/edheltzel/Echo.git
cd Echo
```

You should see `core/`, `scripts/`, `adapters/`, and `cli/echo`.

## 2. Install the core

```bash
cli/echo install --adapter none
```

Same thing: `bash scripts/install.sh --adapter none`.

Output should end with:

```
OK echo is healthy on :3246
```

If you see `Voice server did not respond`, open `~/Library/Logs/echo.log`, fix the cause, and rerun. Running install again is safe.

## 3. Confirm health

```bash
curl -fsS http://localhost:3246/health
```

Expect JSON that starts like `{"status":"healthy","port":3246,...}`.

## 4. Hear Hello from Echo

Turn the volume up, then:

```bash
curl -X POST http://localhost:3246/notify \
  -H 'Content-Type: application/json' \
  -d '{"message":"Hello from Echo"}'
```

You should hear the identity voice say "Hello from Echo" and see JSON with `"status":"accepted"`. `202` / accepted means the daemon took the line, not that playback finished.

## 5. Everyday checks

```bash
cli/echo doctor    # one row per check; ends Result: READY when healthy
cli/echo mute on   # also: off | toggle | status | 30m | on tts | on mic
cli/echo replay    # last spoken line; replay 3 for the last three
```

Mute is machine-wide. Notifications still arrive and are logged. Mute vs unloading the daemon: see [operations in the product repo](https://github.com/edheltzel/Echo/blob/main/docs/operations.md#mute-vs-daemon-disable).

## Wire a host (after you hear the smoke)

```bash
cli/echo install --adapter claudecode   # Claude Code hooks
cli/echo install --adapter pi           # Pi
cli/echo install --adapter omp          # oh-my-pi
cli/echo install --adapter jcode
cli/echo install --adapter grok         # Grok Build
cli/echo install --adapter codex
cli/echo install --adapter opencode
cli/echo install --adapter mcp          # optional one-shot voice ask for Claude Code
```

Restart each host after install. Adapter details: [Supported hosts](/docs/hosts/).

## Optional voice-ask recorder

Voice notifications need nothing beyond the core. The optional one-shot voice ask needs `sox` (`rec`) and a local transcriber (recommended on macOS 26: `brew install sox yap`). See product `docs/dependencies.md` and `docs/converse.md`.

## Next

- [Overview](/docs/)
- [Core loop](/docs/core-loop/)
- [Usage](/docs/usage/)
- [Hosts](/docs/hosts/)
- Product: [getting started](https://github.com/edheltzel/Echo/blob/main/docs/getting-started.md) · [install human](https://github.com/edheltzel/Echo/blob/main/docs/install-human.md)
