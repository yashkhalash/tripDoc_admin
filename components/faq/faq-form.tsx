"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaqFormInput } from "@/lib/faq-api";

const empty: FaqFormInput = { question: "", answer: "", category: "", sortOrder: 0, isActive: true };

export function FaqForm({
  initial,
  loading,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<FaqFormInput>;
  loading?: boolean;
  submitLabel: string;
  onSubmit: (values: FaqFormInput) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<FaqFormInput>({ ...empty, ...initial });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
      className="flex flex-col gap-4"
    >
      <Input
        label="Question"
        value={values.question}
        onChange={(e) => setValues((v) => ({ ...v, question: e.target.value }))}
        required
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--color-text)]">Answer</label>
        <textarea
          value={values.answer}
          onChange={(e) => setValues((v) => ({ ...v, answer: e.target.value }))}
          required
          rows={4}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]"
        />
      </div>
      <Input
        label="Category"
        value={values.category}
        onChange={(e) => setValues((v) => ({ ...v, category: e.target.value }))}
      />
      <Input
        label="Sort order"
        type="number"
        value={values.sortOrder}
        onChange={(e) => setValues((v) => ({ ...v, sortOrder: Number(e.target.value) }))}
      />
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
