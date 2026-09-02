"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CmsPageFormInput, CmsPageStatus } from "@/lib/cms-api";

const empty: CmsPageFormInput = { title: "", slug: "", content: "", status: "DRAFT" };

export function CmsPageForm({
  initial,
  loading,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<CmsPageFormInput>;
  loading?: boolean;
  submitLabel: string;
  onSubmit: (values: CmsPageFormInput) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<CmsPageFormInput>({ ...empty, ...initial });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
      className="flex flex-col gap-4"
    >
      <Input
        label="Title"
        value={values.title}
        onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
        required
      />
      <Input
        label="Slug"
        placeholder="about-us"
        value={values.slug}
        onChange={(e) => setValues((v) => ({ ...v, slug: e.target.value }))}
        required
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--color-text)]">Content</label>
        <textarea
          value={values.content}
          onChange={(e) => setValues((v) => ({ ...v, content: e.target.value }))}
          required
          rows={6}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]"
        />
      </div>
      <Select
        label="Status"
        value={values.status}
        onChange={(e) => setValues((v) => ({ ...v, status: e.target.value as CmsPageStatus }))}
      >
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
        <option value="ARCHIVED">Archived</option>
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
