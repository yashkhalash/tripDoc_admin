"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  applyThemeOverrides,
  loadThemeOverrides,
  resetThemeOverrides,
  saveThemeOverrides,
  ThemeOverrides,
  ThemeToken,
} from "@/lib/theme";

const FIELDS: { token: ThemeToken; label: string }[] = [
  { token: "--color-primary", label: "Primary" },
  { token: "--color-primary-hover", label: "Primary (Hover)" },
  { token: "--color-accent", label: "Accent" },
  { token: "--color-bg", label: "Background" },
  { token: "--color-surface", label: "Surface" },
  { token: "--color-text", label: "Text" },
];

const DEFAULTS: Record<ThemeToken, string> = {
  "--color-primary": "#0b5394",
  "--color-primary-hover": "#094578",
  "--color-accent": "#f2994a",
  "--color-bg": "#f5f7fa",
  "--color-surface": "#ffffff",
  "--color-text": "#171923",
};

export default function AppearanceSettingsPage() {
  const { showToast } = useToast();
  const [values, setValues] = useState<ThemeOverrides>({});

  useEffect(() => {
    setValues(loadThemeOverrides());
  }, []);

  function handleChange(token: ThemeToken, value: string) {
    const next = { ...values, [token]: value };
    setValues(next);
    applyThemeOverrides(next);
  }

  function handleSave() {
    saveThemeOverrides(values);
    showToast("Appearance saved for this browser", "success");
  }

  function handleReset() {
    resetThemeOverrides();
    setValues({});
    showToast("Appearance reset to default", "success");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--color-text)]">Appearance</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Customize the color palette used across buttons, backgrounds, dropdowns, and date pickers.
        </p>
      </div>

      <div className="max-w-lg rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          {FIELDS.map((field) => (
            <div key={field.token} className="flex items-center justify-between gap-4">
              <label className="text-sm font-medium text-[var(--color-text)]">{field.label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={values[field.token] ?? DEFAULTS[field.token]}
                  onChange={(e) => handleChange(field.token, e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded border border-[var(--color-border)] bg-transparent"
                />
                <span className="w-20 font-mono text-xs text-[var(--color-text-muted)]">
                  {values[field.token] ?? DEFAULTS[field.token]}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={handleReset}>
            Reset to Default
          </Button>
          <Button onClick={handleSave}>Save Palette</Button>
        </div>
      </div>

      <div className="max-w-lg rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
        <p className="text-sm font-semibold text-[var(--color-text)]">Live preview</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <select className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]">
            <option>Sample dropdown</option>
          </select>
          <input
            type="date"
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]"
          />
        </div>
      </div>
    </div>
  );
}
