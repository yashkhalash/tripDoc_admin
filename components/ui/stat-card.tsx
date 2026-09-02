import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
}

export function StatCard({ icon: Icon, label, value, hint, href }: StatCardProps) {
  const content = (
    <>
      <div>
        <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-[var(--color-text)]">{value}</p>
        {hint && <p className="mt-1 text-xs text-[var(--color-text-muted)]">{hint}</p>}
      </div>
      {Icon && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] text-[var(--color-primary)]">
          <Icon size={18} />
        </span>
      )}
    </>
  );

  const className =
    "flex items-start justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm transition-shadow";

  if (href) {
    return (
      <Link href={href} className={`${className} hover:shadow-md hover:border-[var(--color-primary)]`}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
