// New tab page script for "Halloween Costume for Google".
// Search uses chrome.search when available, so the user's default search
// provider is respected. It never changes the default provider.

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

async function refresh() {
  const settings = await chrome.storage.local.get(DEFAULTS);
  const statusEl = document.getElementById("costumeStatus");
  const toggleEl = document.getElementById("toggleCostume");
  const seasonNoteEl = document.getElementById("seasonNote");

  let active = settings.enabled;
  if (settings.autoOff && settings.seasonEnd && todayLocal() > settings.seasonEnd) {
    active = false;
  }

  statusEl.textContent = active
    ? "The Halloween costume is on."
    : "The Halloween costume is off.";
  toggleEl.textContent = settings.enabled ? "Turn costume off" : "Turn costume on";
  seasonNoteEl.textContent = settings.autoOff
    ? `Season ends ${settings.seasonEnd}. After that date the costume stops applying until you pick a later date.`
    : "Auto-off is off. The costume stays on until you turn it off.";

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

  // Preferred path: the browser's own search API, which uses the user's
  // default search provider.
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
