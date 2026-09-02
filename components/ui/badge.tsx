const SUCCESS = "bg-[color-mix(in_srgb,var(--color-success)_15%,transparent)] text-[var(--color-success)]";
const DANGER = "bg-[color-mix(in_srgb,var(--color-danger)_15%,transparent)] text-[var(--color-danger)]";
const WARNING = "bg-[color-mix(in_srgb,var(--color-accent)_18%,transparent)] text-[var(--color-accent)]";
const NEUTRAL = "bg-[var(--color-border)] text-[var(--color-text-muted)]";

const VARIANTS: Record<string, string> = {
  ACTIVE: SUCCESS,
  HEALTHY: SUCCESS,
  CONVERTED: SUCCESS,
  RESOLVED: SUCCESS,
  PUBLISHED: SUCCESS,
  CLOSED: SUCCESS,

  SUSPENDED: DANGER,
  DOWN: DANGER,
  FAILED: DANGER,
  DELETED: DANGER,
  DISMISSED: DANGER,

  DEGRADED: WARNING,
  PAUSED: WARNING,
  PENDING: WARNING,
  OPEN: WARNING,
  IN_REVIEW: WARNING,
  IN_PROGRESS: WARNING,
  NEW: WARNING,
  DRAFT: WARNING,
  EXPIRED: WARNING,

  ARCHIVED: NEUTRAL,
  neutral: NEUTRAL,
};

export function Badge({ status }: { status: string }) {
  const className = VARIANTS[status] ?? VARIANTS.neutral;
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${className}`}>
      {status.toLowerCase()}
    </span>
  );
}
