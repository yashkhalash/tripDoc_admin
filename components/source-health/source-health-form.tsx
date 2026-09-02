"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SourceHealthFormInput, SourceHealthStatus } from "@/lib/source-health-api";

const emptyForm: SourceHealthFormInput = {
  sourceName: "",
  category: "",
  status: "HEALTHY",
  responseTimeMs: null,
  message: null,
};

export function SourceHealthForm({
  initial,
  loading,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<SourceHealthFormInput>;
  loading?: boolean;
  submitLabel: string;
  onSubmit: (values: SourceHealthFormInput) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<SourceHealthFormInput>({ ...emptyForm, ...initial });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Source name"
        value={values.sourceName}
        onChange={(e) => setValues((v) => ({ ...v, sourceName: e.target.value }))}
        required
      />
      <Input
        label="Category"
        value={values.category}
        onChange={(e) => setValues((v) => ({ ...v, category: e.target.value }))}
        placeholder="e.g. Weather, Safety, Currency"
        required
      />
      <Select
        label="Status"
        value={values.status}
        onChange={(e) => setValues((v) => ({ ...v, status: e.target.value as SourceHealthStatus }))}
      >
        <option value="HEALTHY">Healthy</option>
        <option value="DEGRADED">Degraded</option>
        <option value="DOWN">Down</option>
      </Select>
      <Input
        label="Response time (ms)"
        type="number"
        min={0}
        value={values.responseTimeMs ?? ""}
        onChange={(e) =>
          setValues((v) => ({
            ...v,
            responseTimeMs: e.target.value === "" ? null : Number(e.target.value),
          }))
        }
      />
      <Input
        label="Message (optional)"
        value={values.message ?? ""}
        onChange={(e) => setValues((v) => ({ ...v, message: e.target.value || null }))}
        placeholder="e.g. Connection timeout"
      />
      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
