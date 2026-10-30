// New tab page script for "Custom Themes for Any Site".
// Search uses chrome.search when available, so the user's default search
// provider is respected. It never changes the default provider.

async function refresh() {
  const api = window.MY_THEMES;
  const settings = await chrome.storage.local.get(api.DEFAULTS);
  const theme = api.resolveTheme(settings);
  const active = api.isThemeActive(settings, "");

  document.body.style.setProperty("--bg", theme.bg);
  document.body.style.setProperty("--text", theme.text);
  document.body.style.setProperty("--link", theme.link);
  document.body.style.setProperty("--accent", theme.accent);
  document.body.style.setProperty("--input-bg", theme.inputBg);

  const headingEl = document.getElementById("heading");
  const pumpkinSvgEl = document.getElementById("pumpkinSvg");
  const themeIconEl = document.getElementById("themeIcon");
  const statusEl = document.getElementById("costumeStatus");
  const toggleEl = document.getElementById("toggleCostume");
  const seasonNoteEl = document.getElementById("seasonNote");

  headingEl.textContent = theme.heading;
  document.title = theme.heading;
  // Two separate decoration elements, toggled by display, so switching
  // themes never destroys the pumpkin SVG.
  if (settings.themeId === "halloween") {
    pumpkinSvgEl.style.display = "block";
    themeIconEl.style.display = "none";
  } else {
    pumpkinSvgEl.style.display = "none";
    themeIconEl.style.display = "block";
    themeIconEl.textContent = theme.decoration;
  }

  statusEl.textContent = active
    ? `${theme.name} theme is on.`
    : `${theme.name} theme is off.`;
  toggleEl.textContent = settings.enabled ? "Turn theme off" : "Turn theme on";

  if (settings.themeId === "halloween") {
    seasonNoteEl.textContent = settings.autoOff
      ? `Halloween season ends ${settings.seasonEnd}. After that date it stops applying until you pick a later date, or choose another theme.`
      : "Halloween auto-off is off. It stays on until you turn it off.";
  } else {
    seasonNoteEl.textContent = "This theme has no season end date. It stays on until you turn it off.";
  }

  toggleEl.onclick = async () => {
    await chrome.storage.local.set({ enabled: !settings.enabled });
    await refresh();
  };
}

document.getElementById("searchForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = document.getElementById("searchInput");
  const query = input.value.trim();
  if (!query) return;

  if (chrome.search && typeof chrome.search.query === "function") {
    try {
      await chrome.search.query({ text: query, disposition: "CURRENT_TAB" });
      return;
    } catch (e) {
      // Fall through to the plain search URL below.
    }
  }
  window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
});

refresh();
