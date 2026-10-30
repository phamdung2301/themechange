# 🎨 Custom Themes for Any Site

A lightweight Chromium extension that recolours **any website you open**
and your **new tab page** — pick a theme you like, or build your own
with a few colour pickers. No account, no server, no build step.

> Started as a Halloween theme for Google. It grew up: Halloween is
> now just one of seven themes, and any site can be themed, not just
> Google.

## ✨ Features

- **Any website, one click** — open a site, and it takes on your
  chosen theme: background, text, links, inputs, buttons and borders.
- **7 themes in the box** — Halloween, Midnight, Ocean, Forest, Rose,
  Sunset, plus a fully **Custom** theme.
- **Custom theme builder** — pick your own background, text, link,
  accent and input colours, plus a corner icon (any emoji). Changes
  apply to open pages immediately, no reload needed.
- **Themed new tab page** — every new tab matches your theme, with a
  search box that uses your browser's default search provider. It
  never changes your default provider.
- **Per-site off switch** — a site looks broken with a theme? Turn
  the theme off for just that site from the popup.
- **Halloween season auto-off** — for the Halloween theme only: it
  stops applying after the season end date (default 2026-11-02).
  Pick a later date to bring it back, or just switch themes.
- **A small corner icon** — each theme adds one static icon in the
  bottom-right corner of the page (🎃, 🌙, 🌊…). It never blocks
  clicks, and there are no animations, no followers, no particles.
- **Private by design** — nothing is collected, stored online, or
  sent anywhere. Settings live only in `chrome.storage.local` on
  your own computer.

## 🎭 Themes

| Theme | Corner icon | Background | Link colour |
|---|---|---|---|
| Halloween | 🎃 | `#0b0a09` | `#ff8c42` |
| Midnight | 🌙 | `#0f1115` | `#8ab4f8` |
| Ocean | 🌊 | `#062a33` | `#4dd0e1` |
| Forest | 🌿 | `#0d1f14` | `#81c784` |
| Rose | 🌸 | `#1f0f1a` | `#f48fb1` |
| Sunset | 🌅 | `#1a0f0a` | `#fb923c` |
| Custom | your pick | your pick | your pick |

## 🚀 Install (load unpacked)

Works on any **Chromium** browser: Chrome, Edge, Brave, Opera, Arc…

1. Download or clone this repository.
2. Open `chrome://extensions` (or your browser's extensions page).
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and choose the folder that contains
   `manifest.json`.
5. Open any website to see the theme, open a new tab for the themed
   new tab page, and click the toolbar icon to change themes.

To remove it: `chrome://extensions` → **Remove**. Settings are
deleted with the extension.

> **Note:** this repository is the source, not a Web Store listing
> yet. Loading unpacked (above) is how you try it today.

## 🖱️ How to use

Click the toolbar icon to open the popup:

- **Theme on** — global on/off.
- **Theme** — choose a preset, or **Custom…** to open the colour
  pickers and corner-icon field.
- **Turn off on this site** — disables the theme only for the site
  you are currently on.
- **Auto-off after Halloween ends / Season ends** — shown only for
  the Halloween theme.
- **Open themed new tab** — opens the themed new tab page.

## 🔐 Permissions — and why each one is needed

| Permission | Why |
|---|---|
| `storage` | Save your theme, custom colours, on/off and per-site list. |
| `alarms` | Re-check the Halloween season date about once an hour. |
| `search` | New tab search through your default search provider. |
| `activeTab` | The popup needs to know which site you are on. |
| `<all_urls>` | This is what lets the extension theme any website. |

Chrome shows its strongest warning for `<all_urls>` ("read and change
all your data on all websites"). That warning is honest: the content
script does run on every page — but all it does is recolour the page
and add one corner icon. It reads nothing from pages and sends
nothing anywhere. If this is ever published to the Web Store, expect
a deeper review because of this permission.

## 🧱 Project structure

```
manifest.json   MV3 manifest: <all_urls> content script, new tab override
themes.js       Shared theme definitions + defaults (popup, new tab
                and content script all use this one file)
background.js   Service worker: defaults on install, hourly re-check
content.js      Page theme logic: builds CSS from the chosen theme
popup.html/js/css   Toolbar popup: theme picker, custom colours,
                per-site off
newtab.html/js/css  Themed new tab page + search
icons/          Toolbar icons (16 / 48 / 128 px)
```

No build step: edit a file, then click **Reload** on the extension
in `chrome://extensions` to try it.

## ⚠️ What this extension does NOT do

- It does **not** change Chrome's own toolbar, address bar or
  bookmark bar. Chrome themes are a separate, static kind of
  extension with no JavaScript; this one themes web pages and its
  own new tab page, not the browser UI itself.
- It does **not** change your computer's wallpaper, taskbar or
  system theme. A browser extension cannot do that on Windows or
  macOS — that would need a separate desktop app.
- It does **not** work on Firefox or Safari yet. Firefox MV3 differs
  (background scripts instead of a service worker, a different
  search API), so it would need a separate build.
- It does **not** animate anything: no mouse-following character,
  no falling particles, no animated cursor.

## 🧪 Known limits

- Themes use broad colour rules on purpose, so some sites will look
  better than others. Sites with heavy custom styling, canvas-based
  content, or content inside cross-origin iframes may only partly
  change. If a site looks broken, use **Turn off on this site**.
- The new tab override replaces the browser's new tab page entirely
  while the extension is installed. Turning the extension off
  restores the normal new tab page.

## 🔒 Privacy

No analytics, no tracking, no network requests, no accounts.
Everything stays in `chrome.storage.local` on your computer.
