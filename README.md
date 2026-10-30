# Custom Themes for Any Site — v1.1.0

A small, browser-only theme extension (Chromium, Manifest V3).
No build step, no account, no server, no remote code. All files are in
this folder, and `manifest.json` is at the root.

This is v2 of the Halloween extension. v1 only themed Google pages.
v2 themes **any website** and lets you pick a theme you like, not
just Halloween.

## What it does

- Themes any website you open with broad colours (background, text,
  links, inputs, buttons, borders) plus one small static corner icon
  in the bottom-right. The icon never blocks clicks
  (`pointer-events: none`). No animations.
- Replaces the new tab page with a themed page that matches the
  theme you picked. Its search box uses the browser's own search API,
  so it respects your default search provider and never changes it.
- Popup controls (click the toolbar icon):
  - **Theme on** — global on/off.
  - **Theme** — Halloween 🎃, Midnight 🌙, Ocean 🌊, Forest 🌿,
    Rose 🌸, Sunset 🌅, or **Custom…**.
  - **Custom…** — pick your own background, text, link, accent and
    input colours, plus your own corner icon (type any emoji, e.g. ⭐).
    Changes apply to open pages immediately, without a reload.
  - **Turn off on this site** — per-site off for the site you are on.
  - **Auto-off after Halloween ends** + **Season ends** — these only
    appear for the Halloween theme. Default season end is
    **2026-11-02**. Other themes have no season end date.
  - **Open themed new tab**.

## Which browsers?

Any **Chromium** browser can load this unpacked zip the same way:
Chrome, Edge, Brave, Opera, Arc, and others built on Chromium.
Firefox and Safari are **not** covered by this zip: Firefox MV3
differs (background scripts instead of a service worker, a different
search API, and a store ID requirement), so it would need a separate
build. Tell me if you want a Firefox version and I will build it
as a separate zip.

## Install (load unpacked)

**Remove v1 first** (important): v1 and v2 both try to replace the
new tab page, so Chrome will fight over it if both are installed.
Go to `chrome://extensions`, remove "Halloween Costume for Google",
then:

1. Unzip this file to a folder on your computer.
2. In your Chromium browser, open `chrome://extensions`.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and choose the folder that contains
   `manifest.json`.
5. Open any website to see the theme, open a new tab for the themed
   new tab page, and click the toolbar icon to change themes.

To remove it: `chrome://extensions` → Remove. Settings are deleted
with the extension.

## Files

| File | What it is |
|---|---|
| `manifest.json` | MV3 manifest: `<all_urls>` content script, new tab override |
| `themes.js` | Shared theme definitions + defaults + active-check (popup, new tab, content script all use this one file) |
| `background.js` | Service worker: defaults/migration on install, hourly re-check |
| `content.js` | Page theme logic: builds CSS from the chosen theme, corner icon |
| `popup.html` / `popup.css` / `popup.js` | Toolbar popup: theme picker, custom colours, per-site off |
| `newtab.html` / `newtab.css` / `newtab.js` | Themed new tab page + search |
| `icons/icon16.png`, `icon48.png`, `icon128.png` | Toolbar/store icons |

Permissions, and why each one is needed:

- `storage` — save the theme, custom colours, on/off, per-site list.
- `alarms` — re-check the Halloween season date about once an hour.
- `search` — new tab search through your default provider.
- `activeTab` — the popup needs to know which site you are on.
- Hosts `<all_urls>` — this is what lets v2 theme any website.
  Chrome shows its strongest warning for this ("read and change all
  your data on all websites"). That warning is honest: the content
  script does run on every page, but it only recolours the page and
  adds one corner icon. It reads nothing from pages and sends
  nothing anywhere. If you later publish to the Web Store, expect
  a deeper review because of this permission.

## What it deliberately does NOT do

- It does **not** change your computer's wallpaper, taskbar, or
  system theme. A browser extension cannot do that on Windows or
  macOS — that would be a separate desktop app/script.
- It does **not** change Chrome's own toolbar, address bar or
  bookmark bar colours. Chrome themes are a separate, static kind
  of extension with no JavaScript; this extension themes web pages
  and its own new tab page, not the browser chrome itself.
- It does **not** animate anything: no mouse-following character,
  no falling particles, no animated cursor.
- It does **not** collect, store online, or send anything. Settings
  live only in `chrome.storage.local` on your computer.

## Known limits

- Themes use broad colour rules on purpose, so some sites will look
  better than others. A site with heavy custom styling, canvas-based
  content, or content inside cross-origin iframes may only partly
  change. If a site looks broken with a theme, use "Turn off on
  this site" in the popup for that site.
- The new tab override replaces the browser's new tab page entirely
  while the extension is installed. Turning the extension off
  restores the normal new tab page.
