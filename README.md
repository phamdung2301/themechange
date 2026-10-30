# Halloween Costume for Google — v1.0.0

A small, browser-only Halloween extension (Chrome, Manifest V3).
No build step, no account, no server, no remote code. All files are in
this folder, and `manifest.json` is at the root, so this zip is also
ready to upload to the Chrome Web Store as-is.

## What it does

- Themes Google search pages (homepage and results) in a dark
  Halloween palette, with a small static pumpkin in the bottom-right
  corner. The pumpkin never blocks clicks (`pointer-events: none`).
- Replaces the new tab page with a Halloween page. Its search box uses
  the browser's own search API, so it respects your default search
  provider and never changes it.
- Popup controls (click the toolbar icon):
  - **Costume on** — global on/off.
  - **Turn off on this site** — per-site off for the current Google site.
  - **Auto-off after the season ends** + **Season ends** date —
    default season end is **2026-11-02**. After that date the costume
    simply stops applying. It never uninstalls itself; pick a later
    date in the popup to bring it back.

## What it deliberately does NOT do

- It does **not** change your computer's wallpaper, taskbar, or system
  theme. A Chrome extension cannot do that on Windows or macOS —
  that would be a separate desktop app/script.
- It does **not** switch Chrome browser themes at runtime. Chrome
  themes are a separate, static kind of extension with no JavaScript.
- It does **not** animate anything: no mouse-following character, no
  falling particles, no animated cursor. Those were the fragile parts
  in the research and are left out of v1 on purpose.
- It does **not** collect, store online, or send anything. Settings
  (on/off, per-site off list, season end date) live only in
  `chrome.storage.local` on your computer.

## Install (load unpacked, for trying it out)

1. Unzip this file to a folder on your computer.
2. In Chrome, open `chrome://extensions`.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and choose the folder that contains
   `manifest.json`.
5. Open a new tab (Halloween new tab page) and visit
   `https://www.google.com` (Halloween theme + pumpkin corner).
6. Click the pumpkin toolbar icon to turn it off, disable it for a
   site, or change the season end date.

To remove it: `chrome://extensions` → Remove. Settings are deleted
with the extension.

## Files

| File | What it is |
|---|---|
| `manifest.json` | MV3 manifest: permissions, new tab override, content script |
| `background.js` | Service worker: defaults on install, hourly season re-check |
| `content.js` | Page theme logic: on/off, season date, per-site off |
| `content.css` | Halloween palette for Google pages + corner decoration |
| `popup.html` / `popup.css` / `popup.js` | Toolbar popup controls |
| `newtab.html` / `newtab.css` / `newtab.js` | Halloween new tab page + search |
| `icons/icon16.png`, `icon48.png`, `icon128.png` | Toolbar/store icons |

Permissions, and why each one is needed:

- `storage` — save the on/off, per-site, and season settings.
- `alarms` — re-check the season date about once an hour.
- `search` — new tab search through your default provider.
- `activeTab` — the popup needs to know which site you are on.
- Hosts `*.google.com` / `google.com` — the only pages themed.

## Known limits (honest, from the research)

- Google changes its page layout often (redesigns, A/B tests). The
  theme uses broad colour rules on purpose, so if one rule stops
  matching, the page still works and the rest of the theme applies.
  It is not a pixel-perfect Google redesign.
- The new tab override replaces Chrome's new tab page entirely while
  the extension is installed. Turning the extension off in
  `chrome://extensions` restores the normal new tab page.
- Firefox: this manifest is Chrome MV3. Firefox MV3 differs
  (background scripts, theme API), so this zip is not a Firefox build.
