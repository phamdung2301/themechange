// Content script (ISOLATED world) for "Halloween Costume for Google".
// It only touches the page DOM. It never reads page JavaScript variables
// and never sends anything anywhere: settings come from chrome.storage.local.

const STYLE_ID = "halloween-costume-style";
const DECORATION_ID = "halloween-costume-decoration";

const DEFAULTS = {
  enabled: true,
  autoOff: true,
  seasonEnd: "2026-11-02",
  disabledSites: []
};

function todayLocal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isActive(settings, hostname) {
  if (!settings.enabled) return false;
  if (settings.autoOff && settings.seasonEnd && todayLocal() > settings.seasonEnd) {
    return false;
  }
  if (Array.isArray(settings.disabledSites) && settings.disabledSites.includes(hostname)) {
    return false;
  }
  return true;
}

function removeCostume() {
  const style = document.getElementById(STYLE_ID);
  if (style) style.remove();
  const decoration = document.getElementById(DECORATION_ID);
  if (decoration) decoration.remove();
}

let cachedCss = null;

async function applyCostume() {
  let settings;
  try {
    settings = await chrome.storage.local.get(DEFAULTS);
  } catch (e) {
    removeCostume();
    return;
  }

  if (!isActive(settings, window.location.hostname)) {
    removeCostume();
    return;
  }

  // Inject the stylesheet (fetched from the extension package, never remote).
  if (!document.getElementById(STYLE_ID)) {
    try {
      if (cachedCss === null) {
        const url = chrome.runtime.getURL("content.css");
        const response = await fetch(url);
        cachedCss = await response.text();
      }
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = cachedCss;
      document.documentElement.appendChild(style);
    } catch (e) {
      // If the stylesheet cannot load, do not leave a half-applied theme.
      removeCostume();
      return;
    }
  }

  // One small static corner decoration. No animation, no mouse-following,
  // no falling particles, and pointer-events are off in CSS so it can
  // never block a click on the page.
  if (!document.getElementById(DECORATION_ID)) {
    const decoration = document.createElement("div");
    decoration.id = DECORATION_ID;
    decoration.setAttribute("aria-hidden", "true");
    decoration.textContent = "🎃";
    document.body.appendChild(decoration);
  }
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local") applyCostume();
});

chrome.runtime.onMessage.addListener((message) => {
  if (message && message.type === "halloween-reevaluate") applyCostume();
});

applyCostume();
