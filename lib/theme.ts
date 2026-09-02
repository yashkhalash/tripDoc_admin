export const THEME_TOKENS = [
  "--color-primary",
  "--color-primary-hover",
  "--color-accent",
  "--color-bg",
  "--color-surface",
  "--color-text",
] as const;

export type ThemeToken = (typeof THEME_TOKENS)[number];
export type ThemeOverrides = Partial<Record<ThemeToken, string>>;

const STORAGE_KEY = "tripdoc_admin_theme_overrides";

export function loadThemeOverrides(): ThemeOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ThemeOverrides) : {};
  } catch {
    return {};
  }
}

export function saveThemeOverrides(overrides: ThemeOverrides) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  window.dispatchEvent(new Event("tripdoc_admin_branding_changed"));
}

export function applyThemeOverrides(overrides: ThemeOverrides) {
  const root = document.documentElement;
  THEME_TOKENS.forEach((token) => {
    const value = overrides[token];
    if (value) {
      root.style.setProperty(token, value);
    } else {
      root.style.removeProperty(token);
    }
  });
}

export function resetThemeOverrides() {
  window.localStorage.removeItem(STORAGE_KEY);
  applyThemeOverrides({});
}
