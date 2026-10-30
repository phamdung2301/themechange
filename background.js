// Background service worker for "Custom Themes for Any Site".
// It holds no UI state in memory: everything lives in chrome.storage.local,
// because a Manifest V3 service worker can be stopped at any time.

chrome.runtime.onInstalled.addListener(async () => {
  // themes.js is not loaded in the worker, so defaults are repeated
  // here in one place. Popup / new tab / content read the shared
  // defaults from themes.js; this list only fills missing keys.
  const defaults = {
    enabled: true,
    themeId: "halloween",
    customBg: "#111827",
    customText: "#f3f4f6",
    customLink: "#60a5fa",
    customAccent: "#6366f1",
    customInputBg: "#1f2937",
    customDecoration: "⭐",
    autoOff: true,
    seasonEnd: "2026-11-02",
    disabledSites: []
  };
  const stored = await chrome.storage.local.get(defaults);
  // Merge: old v1 settings (enabled, autoOff, seasonEnd, disabledSites)
  // survive an update; new theme keys are filled in, never overwritten
  // with a blank value.
  await chrome.storage.local.set({ ...defaults, ...stored });
  chrome.alarms.create("theme-season-check", { periodInMinutes: 60 });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== "theme-season-check") return;
  try {
    const tabs = await chrome.tabs.query({ url: ["http://*/*", "https://*/*"] });
    for (const tab of tabs) {
      if (typeof tab.id !== "number") continue;
      try {
        await chrome.tabs.sendMessage(tab.id, { type: "theme-reevaluate" });
      } catch (e) {
        // Tab has no content script running yet. It applies on load.
      }
    }
  } catch (e) {
    // Failing here must never break the popup or the theme itself.
  }
});
