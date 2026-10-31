---
title: Install
description: Install Echo on macOS and hear your first spoken notification.
---
Requires macOS and [Bun](https://bun.sh/).

1. Install the core: `npx agent-echo install --adapter none` (or `git clone https://github.com/edheltzel/Echo.git && cd Echo && cli/echo install --adapter none`). Output ends with `OK echo is healthy on :3246`.
2. Turn the volume up.
3. Send a test line:
```bash
curl -X POST http://localhost:3246/notify -H 'Content-Type: application/json' -d '{"message":"Hello from Echo"}'
```
You should hear "Hello from Echo" and get `"status":"accepted"`. A `202` means the daemon accepted the line. It does not mean playback has finished.

Check the install with `cli/echo doctor`. It should end with `Result: READY`. To wire a host, see [Hosts](https://github.com/edheltzel/Echo/blob/master/docs/adapters.md). For troubleshooting, see [Getting started](https://github.com/edheltzel/Echo/blob/master/docs/getting-started.md).
