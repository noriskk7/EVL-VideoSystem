# 🎮 EVL VideoSystem

🌐 **English** · [Português](LEIA-ME.md) · [Español](LEAME.md)

Watch and hear your capture card (USB or HDMI) in a window or fullscreen, **without stretching the image**. 📺
No install, no internet, no account: just open the `.exe` and play.

> 🔓 **Open and auditable code.** Own license: free for personal use and small businesses. No telemetry, no network calls.

## ✨ Highlights
- 🔌 **Plug and play**: your capture card shows up in the menu on its own.
- 🔊 **Audio paired automatically** with the right card, played on your speakers or headphones.
- 🖼️ **Correct aspect ratio**, in a window or fullscreen.
- 🌍 **English, Português and Español**. It follows Windows, or pick it in **Settings → Language**.
- 🪶 **Portable**: one `.exe`, nothing to install.

## 🚀 How to use
1. 🔌 Connect your capture card. It appears in the menu.
2. 👆 Click the card's channel.
3. 🔊 The card's audio plays automatically.

## ⌨️ Shortcuts (while viewing)
| Key | Action |
|---|---|
| `F` / `F11` / double-click | ⛶ Fullscreen |
| `Esc` | Exit fullscreen |
| `M` | 🔇 Mute |
| `↑` / `↓` | 🔉 Volume |
| `Backspace` | ↩️ Back to menu |

## 🎥 Streaming with OBS
Only one program can use a capture card at a time. Let EVL VideoSystem open the card and have OBS capture the EVL window:
- ❌ **Do not** add the card in OBS as a "Video Capture Device" at the same time (the image breaks).
- 🪟 Add **Window Capture** → "EVL VideoSystem" (method: Windows 10 1903 and up, "Capture cursor" off).
- 🎧 Audio: **Application Audio Capture** → EVL VideoSystem (or Desktop Audio, not both).
- ⛶ Press `F` in EVL for fullscreen. Do not minimize it (OBS freezes minimized windows). The controls hide when you click on another program.

## 🛠️ Common problems
- ⚫ **Black screen on PS3/PS4/PS5:** turn off HDCP on the console. It is a console lock and happens in any program.
- 🩶 **Half-gray or broken image:** another program (usually OBS) is using the card too. Close it there.
- 🔒 **"In use by another program":** close OBS, Discord or the browser that is using the card.
- 🔇 **No audio:** in **Settings**, pick the card's audio manually.
- 🔁 **Doubled sound:** turn off "Listen to this device" for the card in the Windows sound panel.
- 👻 **Nothing shows up:** Windows Settings → Privacy → Camera → turn on "Let desktop apps access your camera".
- 🛡️ **"Windows protected your PC":** click "More info" → "Run anyway" (the app has no paid digital signature).

**Requirements:** Windows 10 or 11, 64-bit.

## 👩‍💻 Run from source
```powershell
npm install
npm start      # run the app
npm test       # device-matching tests
npm run dist   # build the portable exe into dist\
```
If `node_modules\electron\dist` is missing after `npm install`, run `node node_modules\electron\install.js` once.

## 📄 License
[EVL Software License 1.0](LICENSE): free for personal use and small businesses (up to 100 people). Third-party: Electron (MIT) and the Nunito font (OFL-1.1).

💼 **Large companies and white-label:** get a commercial license at support@evlcorp.lol.
