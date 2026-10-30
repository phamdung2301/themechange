// Background service worker for "Halloween Costume for Google".
// It holds no UI state in memory: everything lives in chrome.storage.local,
// because a Manifest V3 service worker can be stopped at any time.

const DEFAULTS = {
  enabled: true,
  autoOff: true,
  // Season end date (local date, YYYY-MM-DD). After this date the costume
  // simply stops applying. It never uninstalls itself, and the user can
  // pick a later date in the popup to bring it back.
  seasonEnd: "2026-11-02",
  disabledSites: []
};

chrome.runtime.onInstalled.addListener(async (details) => {
  const stored = await chrome.storage.local.get(DEFAULTS);
  // Fill in any missing key (for example after an update) without
  // overwriting settings the user already chose.
  const merged = { ...DEFAULTS, ...stored };
  if (details.reason === "install") {
    await chrome.storage.local.set(merged);
  } else {
    await chrome.storage.local.set(merged);
  }

  // Re-check the season once an hour so open Google tabs pick up the
  // auto-off without needing a reload. The check itself is date-based
  // (see content.js); the alarm only wakes the worker to re-evaluate.
  chrome.alarms.create("halloween-season-check", { periodInMinutes: 60 });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== "halloween-season-check") return;
  try {
    const tabs = await chrome.tabs.query({
      url: ["*://*.google.com/*", "*://google.com/*"]
    });
    for (const tab of tabs) {
      if (typeof tab.id !== "number") continue;
      try {
        await chrome.tabs.sendMessage(tab.id, { type: "halloween-reevaluate" });
      } catch (e) {
        // Tab has no content script running (for example it is still
        // loading). That is fine: the content script applies on load.
      }
    }
  } catch (e) {
    // No tabs permission beyond activeTab/hosts; failing silently here
    // must never break the popup or the theme itself.
  }
});
