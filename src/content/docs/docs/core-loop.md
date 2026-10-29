---
title: Core loop
description: How a finished agent turn becomes a spoken line, and when Echo stays quiet.
---

## 1. Agent finishes
The host adapter sees the turn end and POSTs the completion line (usually the trailing 🗣️ line) to `/notify`. Notify failures are warnings in the host session; they never break the turn.

## 2. Echo speaks
The daemon on `:3246` runs the provider chain (edge-tts, ElevenLabs, Kokoro, macOS `say`) and speaks the line in the requesting agent's voice. With no voice set, it uses the identity voice `en-GB-RyanNeural`.

## 3. Needs you
Claude Code, Pi, oh-my-pi, and Empryo announce approvals, questions, and paused waits. Duplicate events for the same pending request do not speak again. If you set `ECHO_PREFERRED_NAME`, the line addresses you by name.

## 4. Quiet when it should be
Subagents and headless runs stay silent by default. Echo also never talks over an open microphone. Mute or sounds-only mode keeps a shared room quiet.

## 5. Replay and doctor
`cli/echo replay [n]` re-speaks up to the last 10 lines that actually played. `cli/echo doctor` confirms the install is healthy.

## Speak density
`speak_mode` (`announce`, `brief`, `consult`, `think`) controls how dense the line is. It does not create new events. A line containing `?` or "about to" speaks at `consult` density.

