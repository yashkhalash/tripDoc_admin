"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Logo } from "@/components/layout/logo";
import { DEFAULT_PLATFORM_NAME, loadBranding, resetBranding, saveBranding } from "@/lib/branding";
import { fileToDataUrl } from "@/lib/file-to-data-url";

const MAX_LOGO_BYTES = 512 * 1024;

export default function GeneralSettingsPage() {
  const { showToast } = useToast();
  const [platformName, setPlatformName] = useState(DEFAULT_PLATFORM_NAME);
  const [savedName, setSavedName] = useState(DEFAULT_PLATFORM_NAME);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [savedLogo, setSavedLogo] = useState<string | null>(null);

  useEffect(() => {
    const branding = loadBranding();
    setPlatformName(branding.platformName);
    setSavedName(branding.platformName);
    setLogoDataUrl(branding.logoDataUrl);
    setSavedLogo(branding.logoDataUrl);
  }, []);

  async function handleLogoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file", "error");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      showToast("Logo must be smaller than 512KB", "error");
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setLogoDataUrl(dataUrl);
  }

  function handleSave() {
    const trimmed = platformName.trim();
    if (!trimmed) {
      showToast("Platform name can't be empty", "error");
      return;
    }
    saveBranding({ platformName: trimmed, logoDataUrl });
    setPlatformName(trimmed);
    setSavedName(trimmed);
    setSavedLogo(logoDataUrl);
    showToast("Branding updated", "success");
  }

  function handleReset() {
    resetBranding();
    setPlatformName(DEFAULT_PLATFORM_NAME);
    setSavedName(DEFAULT_PLATFORM_NAME);
    setLogoDataUrl(null);
    setSavedLogo(null);
    showToast("Branding reset to default", "success");
  }

  const isDirty = platformName.trim() !== savedName || logoDataUrl !== savedLogo;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--color-text)]">General</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Platform branding shown in the browser tab, the sidebar, and the login screens.
        </p>
      </div>

      <div className="max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
        <p className="text-sm font-semibold text-[var(--color-text)]">Logo preview</p>
        <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
          {logoDataUrl ? (
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoDataUrl} alt={platformName} className="h-7 w-7 rounded-lg object-cover" />
              <span className="text-lg font-bold text-[var(--color-primary)]">{platformName || DEFAULT_PLATFORM_NAME}</span>
            </div>
          ) : (
            <Logo />
          )}
        </div>
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">
          {logoDataUrl
            ? "Using your uploaded logo."
            : "The default logo mark follows the primary color chosen under Appearance."}
        </p>

        <div className="mt-4 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text)]">Upload logo</label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoSelect}
              className="text-xs text-[var(--color-text-muted)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--color-primary)] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-[var(--color-primary-hover)]"
            />
            {logoDataUrl && (
              <button
                type="button"
                onClick={() => setLogoDataUrl(null)}
                className="text-xs text-[var(--color-danger)] hover:underline"
              >
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">PNG, JPG, or SVG. Up to 512KB.</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="mt-6 flex flex-col gap-4"
        >
          <Input
            label="Platform name"
            placeholder={DEFAULT_PLATFORM_NAME}
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={handleReset}>
              Reset to default
            </Button>
            <Button type="submit" disabled={!isDirty}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
