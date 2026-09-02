"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshJobFormInput, RefreshJobStatus } from "@/lib/refresh-jobs-api";

const empty: RefreshJobFormInput = { name: "", sourceName: "", cronSchedule: "", status: "ACTIVE" };

export function RefreshJobForm({
  initial,
  loading,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<RefreshJobFormInput>;
  loading?: boolean;
  submitLabel: string;
  onSubmit: (values: RefreshJobFormInput) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<RefreshJobFormInput>({ ...empty, ...initial });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
      className="flex flex-col gap-4"
    >
      <Input
        label="Job name"
        value={values.name}
        onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        required
      />
      <Input
        label="Source name"
        value={values.sourceName}
        onChange={(e) => setValues((v) => ({ ...v, sourceName: e.target.value }))}
        required
      />
      <Input
        label="Cron schedule"
        placeholder="0 */6 * * *"
        value={values.cronSchedule}
        onChange={(e) => setValues((v) => ({ ...v, cronSchedule: e.target.value }))}
        required
      />
      <Select
        label="Status"
        value={values.status}
        onChange={(e) => setValues((v) => ({ ...v, status: e.target.value as RefreshJobStatus }))}
      >
        <option value="ACTIVE">Active</option>
        <option value="PAUSED">Paused</option>
        <option value="FAILED">Failed</option>
      </Select>
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
