"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { applyThemeOverrides, loadThemeOverrides, saveThemeOverrides, ThemeOverrides } from "@/lib/theme";
import { PALETTE_PRESETS } from "@/lib/palette-presets";

export default function AppearanceSettingsPage() {
  const { showToast } = useToast();
  const [selectedId, setSelectedId] = useState<string>(PALETTE_PRESETS[0].id);
  const [applied, setApplied] = useState<ThemeOverrides>({});

  useEffect(() => {
    const stored = loadThemeOverrides();
    setApplied(stored);
    const match = PALETTE_PRESETS.find(
      (p) => JSON.stringify(p.colors) === JSON.stringify(stored)
    );
    setSelectedId(match?.id ?? PALETTE_PRESETS[0].id);
  }, []);

  function handlePreview(id: string) {
    setSelectedId(id);
    const preset = PALETTE_PRESETS.find((p) => p.id === id);
    if (preset) applyThemeOverrides(preset.colors);
  }

  function handleApply() {
    const preset = PALETTE_PRESETS.find((p) => p.id === selectedId);
    if (!preset) return;
    saveThemeOverrides(preset.colors);
    setApplied(preset.colors);
    showToast(`"${preset.name}" palette applied`, "success");
  }

  const isDirty = JSON.stringify(applied) !== JSON.stringify(PALETTE_PRESETS.find((p) => p.id === selectedId)?.colors ?? {});

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text)]">Appearance</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Choose a color palette for the admin console. It applies to buttons, backgrounds, dropdowns, and date
            pickers.
          </p>
        </div>
        <Button onClick={handleApply} disabled={!isDirty}>
          Apply Palette
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PALETTE_PRESETS.map((preset) => {
          const selected = preset.id === selectedId;
          return (
            <button
              key={preset.id}
              onClick={() => handlePreview(preset.id)}
              className={`relative flex flex-col gap-3 rounded-xl border-2 bg-[var(--color-surface)] p-4 text-left shadow-sm transition-colors ${
                selected ? "border-[var(--color-primary)]" : "border-[var(--color-border)]"
              }`}
              style={{ background: preset.colors["--color-surface"] }}
            >
              {selected && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
              )}
              <p className="text-sm font-semibold" style={{ color: preset.colors["--color-text"] }}>
                {preset.name}
              </p>

              <div
                className="h-8 rounded-md"
                style={{ background: preset.colors["--color-primary"] }}
              />
              <div
                className="h-2 w-10 rounded-full"
                style={{ background: preset.colors["--color-accent"] }}
              />

              <div className="flex gap-1.5">
                {[
                  preset.colors["--color-primary"],
                  preset.colors["--color-accent"],
                  "#22c55e",
                  "#f59e0b",
                  "#ef4444",
                ].map((c, i) => (
                  <span key={i} className="h-4 w-4 rounded-full border border-black/5" style={{ background: c }} />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
