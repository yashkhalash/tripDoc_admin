"use client";

import { useEffect, useState } from "react";
import { Branding, DEFAULT_PLATFORM_NAME, loadBranding } from "@/lib/branding";

export function Logo({
  withLabel = true,
  variant = "default",
}: {
  withLabel?: boolean;
  variant?: "default" | "sidebar";
}) {
  const [branding, setBranding] = useState<Branding>({
    platformName: DEFAULT_PLATFORM_NAME,
    logoDataUrl: null,
  });

  useEffect(() => {
    setBranding(loadBranding());
    function onBrandingChanged() {
      setBranding(loadBranding());
    }
    window.addEventListener("tripdoc_admin_branding_changed", onBrandingChanged);
    window.addEventListener("storage", onBrandingChanged);
    return () => {
      window.removeEventListener("tripdoc_admin_branding_changed", onBrandingChanged);
      window.removeEventListener("storage", onBrandingChanged);
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      {branding.logoDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={branding.logoDataUrl} alt={branding.platformName} className="h-7 w-7 rounded-lg object-cover" />
      ) : (
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
          <path
            d="M9 12.5C9 10.567 10.567 9 12.5 9h7A3.5 3.5 0 0123 12.5v3A3.5 3.5 0 0119.5 19h-5L11 23v-4.1A3.5 3.5 0 019 15.4v-2.9z"
            fill="white"
            fillOpacity="0.95"
          />
          <circle cx="13.2" cy="14" r="1.3" fill="var(--color-primary)" />
          <circle cx="16.6" cy="14" r="1.3" fill="var(--color-primary)" />
          <circle cx="20" cy="14" r="1.3" fill="var(--color-primary)" />
        </svg>
      )}
      {withLabel &&
        (variant === "sidebar" ? (
          <div className="min-w-0 leading-tight">
            <p className="truncate text-base font-bold text-[var(--sidebar-text)]">{branding.platformName}</p>
            <p className="text-[10px] font-semibold tracking-widest text-[var(--sidebar-text-muted)]">
              ADMIN PANEL
            </p>
          </div>
        ) : (
          <span className="text-lg font-bold text-[var(--color-primary)]">{branding.platformName}</span>
        ))}
    </div>
  );
}
