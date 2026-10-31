---
title: Notifications (text-to-speech)
description: How Echo speaks completion and needs-input lines from your coding agents.
---
When a turn ends, the host adapter POSTs the completion line to `/notify` on `:3246` and Echo speaks it.

- **Needs-input:** Claude Code, Pi, oh-my-pi, and Empryo announce approvals and questions. OpenCode, Jcode, Grok, and Codex speak only when the turn completes.
- **Voices:** Echo tries providers in order: edge-tts (the default, which is an online service), ElevenLabs, Kokoro (runs locally), and macOS `say` (runs locally). See [voices](https://github.com/edheltzel/Echo/blob/master/docs/voices.md).
- **Sounds instead of speech:** `cli/echo mode sounds` switches to sounds and `cli/echo mode speech` switches back. The setting is global and survives restarts.
- **Replay:** `cli/echo replay [n]` speaks the last 1 to 10 lines again. Only lines that actually played are kept.
- **Stays quiet** for subagents, headless runs, while a mic capture is in progress, and when muted. See [When it stays quiet](https://github.com/edheltzel/Echo/blob/master/docs/what-echo-does.md#when-it-stays-quiet).

This page is about Echo talking to you. For an agent listening to your answer, see [Voice ask (speech-to-text)](/docs/speech-to-text/).
