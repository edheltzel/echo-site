---
title: Voice ask (speech-to-text)
description: An agent asks you one question out loud and gets your spoken answer back as text, transcribed on your Mac.
---
Echo can listen as well as speak. With voice ask, a coding agent speaks **one question**, records **one reply**, transcribes it **on your Mac**, and gets the transcript back. It is a single exchange. It is not a hands-free chat or a dictation mode.

## How it works
- The `echo_ask` tool is available in Pi and oh-my-pi through their adapters, and in Claude Code through `--adapter mcp`.
- The coordinator runs on `:32468`, separate from the notification daemon on `:3246`. It reserves the mic and speaks the question, but it never opens the microphone itself. Recording happens in your host's process, because macOS only grants mic access that way.

## Set it up
```bash
brew install sox   # required: provides rec
brew install yap   # recommended on-device transcriber (macOS 26)
```
You can use `whisper-cli` instead of yap. Set `ECHO_CONVERSE_WHISPER_MODEL` in `~/.config/echo/config.json`. sox is still required. `ECHO_CONVERSE_STT_TIER` picks `yap` or `whisper`. The default tries yap first, then whisper.

## Microphone permission
The first ask triggers the macOS mic prompt. The prompt names **your terminal app**, not Echo. This is measured on Pi and omp; Claude Code is not yet verified. Echo does not show its own prompt for each question. To turn off capture, run `cli/echo mute on mic`.

## Privacy
- Transcription runs locally. The reply is saved as a temporary WAV in `~/Library/Caches/echo/converse/` (file mode 0600) and deleted after use. A hard crash can leave a file behind, and it is safe to delete.
- The transcript goes straight to your agent. The coordinator only sees how many characters it has.
- The **question** is spoken through your TTS provider. The default, edge-tts, is online.

Full reference: [converse.md](https://github.com/edheltzel/Echo/blob/master/docs/converse.md).
