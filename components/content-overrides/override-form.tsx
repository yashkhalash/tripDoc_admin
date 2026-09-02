"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { contentOverridesApi } from "@/lib/content-overrides-api";

interface OverrideFormValues {
  snapshotId: string;
  overrideText: string;
  reason: string;
}

export function OverrideForm({
  mode,
  initial,
  snapshotLabel,
  loading,
  onSubmit,
  onCancel,
}: {
  mode: "create" | "edit";
  initial?: Partial<OverrideFormValues>;
  snapshotLabel?: string;
  loading?: boolean;
  onSubmit: (values: OverrideFormValues) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<OverrideFormValues>({
    snapshotId: initial?.snapshotId ?? "",
    overrideText: initial?.overrideText ?? "",
    reason: initial?.reason ?? "",
  });

  const { data: snapshots, isLoading: snapshotsLoading } = useQuery({
    queryKey: ["available-snapshots"],
    queryFn: () => contentOverridesApi.listAvailableSnapshots(),
    enabled: mode === "create",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {mode === "create" ? (
        <Select
          label="Intelligence snapshot"
          value={values.snapshotId}
          onChange={(e) => setValues((v) => ({ ...v, snapshotId: e.target.value }))}
          required
        >
          <option value="">
            {snapshotsLoading ? "Loading snapshots…" : "Select a snapshot to override"}
          </option>
          {snapshots?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.trip.destination} · {s.category.name} — {s.summary.slice(0, 40)}
            </option>
          ))}
        </Select>
      ) : (
        <p className="text-sm text-[var(--color-text-muted)]">Editing override for {snapshotLabel}</p>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--color-text)]">Override text</label>
        <textarea
          value={values.overrideText}
          onChange={(e) => setValues((v) => ({ ...v, overrideText: e.target.value }))}
          required
          rows={4}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]"
        />
      </div>

      <Input
        label="Reason (optional)"
        value={values.reason}
        onChange={(e) => setValues((v) => ({ ...v, reason: e.target.value }))}
        placeholder="e.g. Source data was stale"
      />

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading} disabled={mode === "create" && !values.snapshotId}>
          {mode === "create" ? "Add Override" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
