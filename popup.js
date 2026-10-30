// Popup script for "Custom Themes for Any Site".
// The popup dies when it loses focus, so every change is saved immediately.

async function init() {
  const api = window.MY_THEMES;
  const DEFAULTS = api.DEFAULTS;

  const enabledEl = document.getElementById("enabled");
  const themeSelectEl = document.getElementById("themeSelect");
  const customSectionEl = document.getElementById("customSection");
  const customBgEl = document.getElementById("customBg");
  const customTextEl = document.getElementById("customText");
  const customLinkEl = document.getElementById("customLink");
  const customAccentEl = document.getElementById("customAccent");
  const customInputBgEl = document.getElementById("customInputBg");
  const customDecorationEl = document.getElementById("customDecoration");
  const disableSiteEl = document.getElementById("disableSite");
  const seasonSectionEl = document.getElementById("seasonSection");
  const autoOffEl = document.getElementById("autoOff");
  const seasonEndEl = document.getElementById("seasonEnd");
  const siteNameEl = document.getElementById("siteName");
  const statusEl = document.getElementById("status");
  const openNewTabEl = document.getElementById("openNewTab");

  const settings = await chrome.storage.local.get(DEFAULTS);

  let hostname = "";
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0 && tabs[0].url) {
      const url = new URL(tabs[0].url);
      // Only http/https pages are themed. chrome://, extension pages
      // and the Web Store must not leak their hostname (for example
      // the extension's own ID) into the per-site list.
      if (url.protocol === "http:" || url.protocol === "https:") {
        hostname = url.hostname;
      }
    }
  } catch (e) {
    hostname = "";
  }

  // Any normal http/https page can be themed now. chrome:// pages,
  // the Web Store and extension pages cannot, so the per-site
  // checkbox is disabled there instead of silently doing nothing.
  const isWebPage = hostname !== "";
  siteNameEl.textContent = hostname || "this page";
  disableSiteEl.disabled = !isWebPage;
  disableSiteEl.checked = hostname !== "" && settings.disabledSites.includes(hostname);

  function applyThemeToPopup(current) {
    const theme = api.resolveTheme(current);
    document.body.style.setProperty("--bg", theme.bg);
    document.body.style.setProperty("--text", theme.text);
    document.body.style.setProperty("--link", theme.link);
    document.body.style.setProperty("--accent", theme.accent);
    document.body.style.setProperty("--input-bg", theme.inputBg);
  }

  function refreshVisibility(current) {
    const isCustom = current.themeId === "custom";
    customSectionEl.style.display = isCustom ? "block" : "none";
    // Season controls only mean something for Halloween.
    seasonSectionEl.style.display = current.themeId === "halloween" ? "block" : "none";
    applyThemeToPopup(current);
  }

  function statusText(current) {
    if (!current.enabled) return "Theme is off.";
    const theme = api.resolveTheme(current);
    if (current.themeId === "halloween" && current.autoOff && current.seasonEnd && api.todayLocal() > current.seasonEnd) {
      return `Halloween season ended on ${current.seasonEnd}. Pick a later date to bring it back, or choose another theme.`;
    }
    if (hostname && current.disabledSites.includes(hostname)) {
      return `Theme is off on ${hostname}.`;
    }
    return `${theme.name} theme is on.`;
  }

  async function saveAndRefresh() {
    const current = await chrome.storage.local.get(DEFAULTS);
    statusEl.textContent = statusText(current);
    refreshVisibility(current);
  }

  enabledEl.checked = settings.enabled;
  themeSelectEl.value = settings.themeId;
  customBgEl.value = settings.customBg;
  customTextEl.value = settings.customText;
  customLinkEl.value = settings.customLink;
  customAccentEl.value = settings.customAccent;
  customInputBgEl.value = settings.customInputBg;
  customDecorationEl.value = settings.customDecoration;
  autoOffEl.checked = settings.autoOff;
  seasonEndEl.value = settings.seasonEnd;
  statusEl.textContent = statusText(settings);
  refreshVisibility(settings);

  enabledEl.addEventListener("change", async () => {
    await chrome.storage.local.set({ enabled: enabledEl.checked });
    await saveAndRefresh();
  });

  themeSelectEl.addEventListener("change", async () => {
    await chrome.storage.local.set({ themeId: themeSelectEl.value });
    await saveAndRefresh();
  });

  const customInputs = [
    ["customBg", customBgEl],
    ["customText", customTextEl],
    ["customLink", customLinkEl],
    ["customAccent", customAccentEl],
    ["customInputBg", customInputBgEl]
  ];
  for (const [key, el] of customInputs) {
    el.addEventListener("input", async () => {
      await chrome.storage.local.set({ [key]: el.value });
      await saveAndRefresh();
    });
  }
  customDecorationEl.addEventListener("change", async () => {
    await chrome.storage.local.set({ customDecoration: customDecorationEl.value || "⭐" });
    await saveAndRefresh();
  });

  autoOffEl.addEventListener("change", async () => {
    await chrome.storage.local.set({ autoOff: autoOffEl.checked });
    await saveAndRefresh();
  });

  seasonEndEl.addEventListener("change", async () => {
    if (!seasonEndEl.value) return;
    await chrome.storage.local.set({ seasonEnd: seasonEndEl.value });
    await saveAndRefresh();
  });

  disableSiteEl.addEventListener("change", async () => {
    if (!hostname) return;
    const current = await chrome.storage.local.get(DEFAULTS);
    let disabledSites = Array.isArray(current.disabledSites) ? [...current.disabledSites] : [];
    if (disableSiteEl.checked) {
      if (!disabledSites.includes(hostname)) disabledSites.push(hostname);
    } else {
      disabledSites = disabledSites.filter((site) => site !== hostname);
    }
    await chrome.storage.local.set({ disabledSites });
    await saveAndRefresh();
  });

  openNewTabEl.addEventListener("click", async () => {
    await chrome.tabs.create({});
    window.close();
  });
}

init();
