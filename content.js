// Content script (ISOLATED world) for "Custom Themes for Any Site".
// It only touches the page DOM. It never reads page JavaScript variables
// and never sends anything anywhere: settings come from chrome.storage.local.
// Theme colours come from themes.js (extension data, never page data).

const STYLE_ID = "my-theme-style";
const DECORATION_ID = "my-theme-decoration";

function themeCss(theme) {
  // Broad colour rules on purpose, not a pixel-perfect redesign of any
  // one site: sites change their DOM often, so a narrow selector set
  // would break constantly. If one rule stops matching, the page
  // still works and the rest of the theme still applies.
  // No animations, ever.
  return `
html, body {
  background-color: ${theme.bg} !important;
  color: ${theme.text} !important;
}
a, a:visited {
  color: ${theme.link} !important;
}
a:hover {
  color: ${theme.link} !important;
  opacity: 0.85 !important;
}
input[type="text"], input[type="search"], textarea, select {
  background-color: ${theme.inputBg} !important;
  color: ${theme.text} !important;
  border-color: ${theme.accent} !important;
}
input[type="submit"], input[type="button"], button {
  background-color: ${theme.inputBg} !important;
  color: ${theme.text} !important;
  border-color: ${theme.accent} !important;
}
div {
  border-color: ${theme.accent} !important;
}
#${DECORATION_ID} {
  position: fixed !important;
  right: 16px !important;
  bottom: 16px !important;
  z-index: 2147483647 !important;
  font-size: 44px !important;
  line-height: 1 !important;
  pointer-events: none !important;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.6)) !important;
}
@media (prefers-reduced-motion: reduce) {
  #${DECORATION_ID} { animation: none !important; }
}
`;
}

function removeTheme() {
  const style = document.getElementById(STYLE_ID);
  if (style) style.remove();
  const decoration = document.getElementById(DECORATION_ID);
  if (decoration) decoration.remove();
}

async function applyTheme() {
  const api = window.MY_THEMES;
  if (!api) {
    removeTheme();
    return;
  }
  let settings;
  try {
    settings = await chrome.storage.local.get(api.DEFAULTS);
  } catch (e) {
    removeTheme();
    return;
  }

  if (!api.isThemeActive(settings, window.location.hostname)) {
    removeTheme();
    return;
  }

  const theme = api.resolveTheme(settings);

  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.documentElement.appendChild(style);
  }
  // Rebuild on every apply so a theme change in the popup recolours
  // the page immediately, without a reload.
  style.textContent = themeCss(theme);

  if (!document.getElementById(DECORATION_ID) && document.body) {
    const decoration = document.createElement("div");
    decoration.id = DECORATION_ID;
    decoration.setAttribute("aria-hidden", "true");
    decoration.textContent = theme.decoration;
    document.body.appendChild(decoration);
  } else if (document.getElementById(DECORATION_ID)) {
    document.getElementById(DECORATION_ID).textContent = theme.decoration;
  }
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local") applyTheme();
});

chrome.runtime.onMessage.addListener((message) => {
  if (message && message.type === "theme-reevaluate") applyTheme();
});

applyTheme();
