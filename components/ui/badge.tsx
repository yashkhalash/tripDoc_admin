const VARIANTS: Record<string, string> = {
  ACTIVE: "bg-[color-mix(in_srgb,var(--color-success)_15%,transparent)] text-[var(--color-success)]",
  SUSPENDED: "bg-[color-mix(in_srgb,var(--color-danger)_15%,transparent)] text-[var(--color-danger)]",
  DELETED: "bg-[var(--color-border)] text-[var(--color-text-muted)]",
  neutral: "bg-[var(--color-border)] text-[var(--color-text)]",
};

export function Badge({ status }: { status: string }) {
  const className = VARIANTS[status] ?? VARIANTS.neutral;
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${className}`}>
      {status.toLowerCase()}
    </span>
  );
}
