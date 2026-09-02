"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { NotificationChannel, TemplateFormInput } from "@/lib/notification-templates-api";

const empty: TemplateFormInput = { name: "", channel: "PUSH", subject: "", body: "", isActive: true };

export function TemplateForm({
  initial,
  loading,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<TemplateFormInput>;
  loading?: boolean;
  submitLabel: string;
  onSubmit: (values: TemplateFormInput) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<TemplateFormInput>({ ...empty, ...initial });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
      className="flex flex-col gap-4"
    >
      <Input
        label="Template name"
        value={values.name}
        onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        required
      />
      <Select
        label="Channel"
        value={values.channel}
        onChange={(e) => setValues((v) => ({ ...v, channel: e.target.value as NotificationChannel }))}
      >
        <option value="PUSH">Push</option>
        <option value="EMAIL">Email</option>
        <option value="SMS">SMS</option>
      </Select>
      {values.channel === "EMAIL" && (
        <Input
          label="Subject"
          value={values.subject}
          onChange={(e) => setValues((v) => ({ ...v, subject: e.target.value }))}
        />
      )}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--color-text)]">Body</label>
        <textarea
          value={values.body}
          onChange={(e) => setValues((v) => ({ ...v, body: e.target.value }))}
          required
          rows={4}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) => setValues((v) => ({ ...v, isActive: e.target.checked }))}
        />
        Active
      </label>
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
