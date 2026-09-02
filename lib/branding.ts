const STORAGE_KEY = "tripdoc_admin_branding";

export const DEFAULT_PLATFORM_NAME = "TripDoc Admin";

export type Branding = {
  platformName: string;
  logoDataUrl: string | null;
};

const DEFAULT_BRANDING: Branding = {
  platformName: DEFAULT_PLATFORM_NAME,
  logoDataUrl: null,
};

export function loadBranding(): Branding {
  if (typeof window === "undefined") return DEFAULT_BRANDING;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_BRANDING;
    const parsed = JSON.parse(raw) as Partial<Branding>;
    return {
      platformName: parsed.platformName?.trim() || DEFAULT_PLATFORM_NAME,
      logoDataUrl: parsed.logoDataUrl || null,
    };
  } catch {
    return DEFAULT_BRANDING;
  }
}

export function saveBranding(branding: Partial<Branding>) {
  const next = { ...loadBranding(), ...branding };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("tripdoc_admin_branding_changed"));
}

export function resetBranding() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("tripdoc_admin_branding_changed"));
}
