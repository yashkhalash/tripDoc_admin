import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export type StatCardTone = "primary" | "blue" | "green" | "orange" | "purple" | "red" | "teal" | "pink";

const TONE_COLORS: Record<StatCardTone, string> = {
  primary: "var(--color-primary)",
  blue: "#3b82f6",
  green: "#22c55e",
  orange: "#f59e0b",
  purple: "#a855f7",
  red: "#ef4444",
  teal: "#14b8a6",
  pink: "#ec4899",
};

interface StatCardProps {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  tone?: StatCardTone;
}

export function StatCard({ icon: Icon, label, value, hint, href, tone = "primary" }: StatCardProps) {
  const accent = TONE_COLORS[tone];

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        {Icon && (
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
            style={{ backgroundColor: accent }}
          >
            <Icon size={18} />
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-[var(--color-text)]">{value}</p>
        {hint && <p className="mt-1 text-xs text-[var(--color-text-muted)]">{hint}</p>}
      </div>
    </>
  );

  const className =
    "relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 pb-6 shadow-sm transition-all";

  const accentBar = <span className="absolute inset-x-0 bottom-0 h-1" style={{ backgroundColor: accent }} />;

  if (href) {
    return (
      <Link href={href} className={`${className} hover:-translate-y-0.5 hover:shadow-md`}>
        {content}
        {accentBar}
      </Link>
    );
  }

  return (
    <div className={className}>
      {content}
      {accentBar}
    </div>
  );
}
