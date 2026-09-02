"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { labelForSegment } from "@/lib/breadcrumb-labels";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;
  if (segments.length === 1 && segments[0] === "dashboard") return null;

  const crumbs = segments.map((segment, i) => ({
    label: labelForSegment(segment),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
      >
        <Home size={14} />
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight size={14} className="text-[var(--color-text-muted)]" />
          {crumb.isLast ? (
            <span className="font-medium text-[var(--color-text)]">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
