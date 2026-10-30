// Popup script for "Halloween Costume for Google".
// The popup dies when it loses focus, so every change is saved immediately.

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

function statusText(settings, hostname) {
  if (!settings.enabled) return "Costume is off.";
  if (settings.autoOff && settings.seasonEnd && todayLocal() > settings.seasonEnd) {
    return `Season ended on ${settings.seasonEnd}. Pick a later date to bring the costume back.`;
  }
  if (hostname && settings.disabledSites.includes(hostname)) {
    return `Costume is off on ${hostname}.`;
  }
  return "Costume is on. Happy Halloween!";
}

async function init() {
  const enabledEl = document.getElementById("enabled");
  const disableSiteEl = document.getElementById("disableSite");
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
      hostname = url.hostname;
    }
  } catch (e) {
    hostname = "";
  }

  const themeable = hostname === "" || hostname.endsWith(".google.com") || hostname === "google.com";
  if (hostname) {
    siteNameEl.textContent = hostname;
  } else {
    siteNameEl.textContent = "this page";
  }
  // Per-site off only makes sense on a page the extension can theme.
  // On other pages the checkbox is disabled rather than silently useless.
  disableSiteEl.disabled = !themeable || hostname === "";
  disableSiteEl.checked = hostname !== "" && settings.disabledSites.includes(hostname);

  enabledEl.checked = settings.enabled;
  autoOffEl.checked = settings.autoOff;
  seasonEndEl.value = settings.seasonEnd;
  statusEl.textContent = statusText(settings, hostname);

  async function saveAndRefresh() {
    const current = await chrome.storage.local.get(DEFAULTS);
    statusEl.textContent = statusText(current, hostname);
  }

  enabledEl.addEventListener("change", async () => {
    await chrome.storage.local.set({ enabled: enabledEl.checked });
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
    // An empty tab opens the extension's overridden new tab page.
    await chrome.tabs.create({});
    window.close();
  });
}

init();
