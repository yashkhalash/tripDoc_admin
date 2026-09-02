"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}) {
  const rangeStart = total === 0 ? 0 : (page - 1) * (pageSize ?? 10) + 1;
  const rangeEnd = pageSize ? Math.min(page * pageSize, total) : total;

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--color-border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span className="text-xs text-[var(--color-text-muted)]">
          Showing <span className="font-medium text-[var(--color-text)]">{rangeStart}-{rangeEnd}</span> of{" "}
          <span className="font-medium text-[var(--color-text)]">{total}</span>
        </span>

        {pageSize !== undefined && onPageSizeChange && (
          <label className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            Rows per page
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-xs text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--color-text-muted)]">
          Page {totalPages === 0 ? 0 : page} of {totalPages}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Previous page"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            aria-label="Next page"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
