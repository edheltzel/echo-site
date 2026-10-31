---
title: Mute, snooze, and the dashboard
description: Silence Echo for a while or until a set time, and control it from a local web page.
---
## Mute
```bash
cli/echo mute on            # speaker + mic
cli/echo mute 30m           # timed
cli/echo mute until 15:30   # local time; tomorrow if already past
cli/echo mute on tts        # notifications play as sounds instead of speech
cli/echo mute on mic        # blocks voice ask only
cli/echo mute off | status | toggle
```
Mute is machine-wide, not per session. It survives restarts, and a timed mute ends quietly on its own. `/echo-mute` inside a host runs the same command. Mute does not stop Oh My Pi `/live`.

## Dashboard
`cli/echo dashboard` opens `http://localhost:3246/`. Add `--print` to print the URL without opening it. From the dashboard you can check status, snooze by duration or until a date and time, use Wake now, switch speech/sounds mode, replay lines, and view your config with secrets hidden.

It only answers on localhost. Requests from other origins are rejected. That is a guard, not a login.

## Themes
The dashboard has four themes: Neutral (the default), High contrast, Cool slate, and Warm amber. Each comes in light and dark, and light or dark follows your OS setting until you pick one. Your browser remembers the choice.
