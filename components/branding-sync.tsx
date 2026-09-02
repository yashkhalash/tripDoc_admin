"use client";

import { useEffect } from "react";
import { loadBranding } from "@/lib/branding";
import { loadThemeOverrides } from "@/lib/theme";

const DEFAULT_PRIMARY = "#0b5394";

function faviconDataUrl(primary: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <rect width="32" height="32" rx="8" fill="${primary}" />
    <path d="M9 12.5C9 10.567 10.567 9 12.5 9h7A3.5 3.5 0 0123 12.5v3A3.5 3.5 0 0119.5 19h-5L11 23v-4.1A3.5 3.5 0 019 15.4v-2.9z" fill="white" fill-opacity="0.95" />
    <circle cx="13.2" cy="14" r="1.3" fill="${primary}" />
    <circle cx="16.6" cy="14" r="1.3" fill="${primary}" />
    <circle cx="20" cy="14" r="1.3" fill="${primary}" />
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const CUSTOM_ICON_ID = "tripdoc-admin-dynamic-favicon";

/** Keeps the browser tab title and favicon in sync with saved platform name / palette. */
export function BrandingSync() {
  useEffect(() => {
    function sync() {
      const branding = loadBranding();
      document.title = branding.platformName;

      const primary = loadThemeOverrides()["--color-primary"] ?? DEFAULT_PRIMARY;
      const href = branding.logoDataUrl ?? faviconDataUrl(primary);

      // Next.js's file-convention icons (app/favicon.ico, app/icon.svg) inject their own
      // <link rel="icon"> tags. Multiple icon links can coexist and browsers don't reliably
      // prefer the last one, so disable every icon link except the one we control.
      document
        .querySelectorAll<HTMLLinkElement>("link[rel~='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']")
        .forEach((el) => {
          if (el.id !== CUSTOM_ICON_ID) el.remove();
        });

      let link = document.getElementById(CUSTOM_ICON_ID) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.id = CUSTOM_ICON_ID;
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.type = branding.logoDataUrl ? "" : "image/svg+xml";
      link.href = href;
    }
    sync();
    window.addEventListener("tripdoc_admin_branding_changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("tripdoc_admin_branding_changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return null;
}
