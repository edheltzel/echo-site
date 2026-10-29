---
title: Overview
description: Echo speaks when a coding agent finishes its turn or needs you. One local daemon on your Mac.
---

Echo is ambient completion audio for coding agents. When a turn ends, a short line is spoken so you can keep your eyes on the work. When Claude Code, Pi, or oh-my-pi cannot continue without you, Echo speaks that wait once.

It is a local daemon on your Mac. Hosts do not import it. They POST JSON to `localhost:3246/notify`. A `curl` is a valid host.

## What it does

- **Speaks turn completions.** Wired hosts send the trailing completion line; Echo says it out loud.
- **Speaks the wait.** Claude Code, Pi, and oh-my-pi POST once when the agent is blocked on a permission, approval, or needs-input UI.
- **Stays quiet when you want.** Mute, sounds-only mode, daemon disable, and host flags control when nothing plays.
- **One daemon, many hosts.** Claude Code, Pi, oh-my-pi, Jcode, Grok Build, Codex, OpenCode (mute + completion), and raw HTTP.

## What it is not

Echo is not a conversation loop. It is not a menu-bar recorder, notch UI, or global push-to-talk chrome. First-class speech-to-text is roadmap, not this install. The optional one-shot voice ask (`echo-converse`) can speak one question and return one reply; that is extra, not why you install Echo.

## How it fits together

1. Install the core LaunchAgent (`com.echo`) on port **3246**.
2. Prove speech with a `curl` POST to `/notify`.
3. Optionally wire a host adapter so completions and waits arrive without you posting by hand.

## Next

- [Install guide](/docs/install/)
- [Core loop](/docs/core-loop/)
- [Usage: CLI and HTTP](/docs/usage/)
- [Supported hosts](/docs/hosts/)

Full product docs live in the [Echo repository](https://github.com/edheltzel/Echo/blob/main/README.md).
