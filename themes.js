// Shared theme definitions for "Custom Themes for Any Site".
// Loaded by the popup, the new tab page, and the content script.
// Colours here are extension data, never page data, so building CSS
// from them in content.js is safe. No remote assets, no remote code.

(function () {
  const THEMES = {
    halloween: {
      name: "Halloween",
      heading: "Happy Halloween",
      bg: "#0b0a09",
      text: "#f5e9d3",
      link: "#ff8c42",
      accent: "#c93a2b",
      inputBg: "#1a120b",
      decoration: "🎃"
    },
    midnight: {
      name: "Midnight",
      heading: "Midnight",
      bg: "#0f1115",
      text: "#e8eaed",
      link: "#8ab4f8",
      accent: "#3b82f6",
      inputBg: "#1c212b",
      decoration: "🌙"
    },
    ocean: {
      name: "Ocean",
      heading: "Ocean",
      bg: "#062a33",
      text: "#dff3f5",
      link: "#4dd0e1",
      accent: "#0097a7",
      inputBg: "#0b3d47",
      decoration: "🌊"
    },
    forest: {
      name: "Forest",
      heading: "Forest",
      bg: "#0d1f14",
      text: "#e8f5e9",
      link: "#81c784",
      accent: "#2e7d32",
      inputBg: "#162e1d",
      decoration: "🌿"
    },
    rose: {
      name: "Rose",
      heading: "Rose",
      bg: "#1f0f1a",
      text: "#fce4ec",
      link: "#f48fb1",
      accent: "#e91e63",
      inputBg: "#2e1626",
      decoration: "🌸"
    },
    sunset: {
      name: "Sunset",
      heading: "Sunset",
      bg: "#1a0f0a",
      text: "#ffedd5",
      link: "#fb923c",
      accent: "#f59e0b",
      inputBg: "#2a1a10",
      decoration: "🌅"
    }
  };

  const DEFAULTS = {
    enabled: true,
    themeId: "halloween",
    // Custom theme colours. Used only when themeId === "custom".
    customBg: "#111827",
    customText: "#f3f4f6",
    customLink: "#60a5fa",
    customAccent: "#6366f1",
    customInputBg: "#1f2937",
    customDecoration: "⭐",
    // Season auto-off applies ONLY to the Halloween theme. Other
    // themes have no season, so they never auto-off on a date.
    autoOff: true,
    seasonEnd: "2026-11-02",
    disabledSites: []
  };

  function resolveTheme(settings) {
    if (settings.themeId === "custom") {
      return {
        name: "Custom",
        heading: "My Theme",
        bg: settings.customBg || DEFAULTS.customBg,
        text: settings.customText || DEFAULTS.customText,
        link: settings.customLink || DEFAULTS.customLink,
        accent: settings.customAccent || DEFAULTS.customAccent,
        inputBg: settings.customInputBg || DEFAULTS.customInputBg,
        decoration: settings.customDecoration || DEFAULTS.customDecoration
      };
    }
    return THEMES[settings.themeId] || THEMES.halloween;
  }

  function todayLocal() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function isThemeActive(settings, hostname) {
    if (!settings.enabled) return false;
    if (
      settings.themeId === "halloween" &&
      settings.autoOff &&
      settings.seasonEnd &&
      todayLocal() > settings.seasonEnd
    ) {
      return false;
    }
    if (Array.isArray(settings.disabledSites) && hostname && settings.disabledSites.includes(hostname)) {
      return false;
    }
    return true;
  }

  // Expose on window so popup, new tab and content scripts share one
  // source of truth without module imports (content scripts cannot
  // rely on ES module imports in every browser).
  window.MY_THEMES = { THEMES, DEFAULTS, resolveTheme, todayLocal, isThemeActive };
})();
