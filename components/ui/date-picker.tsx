"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseIsoDate(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatDisplay(value: string): string {
  const date = parseIsoDate(value);
  if (!date) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = "Select date",
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedDate = parseIsoDate(value);
  const [viewDate, setViewDate] = useState(selectedDate ?? new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedDate) setViewDate(selectedDate);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function pick(day: number) {
    const picked = new Date(year, month, day);
    onChange(toIsoDate(picked));
    setOpen(false);
  }

  function isSelected(day: number) {
    return !!selectedDate && selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === day;
  }

  function isToday(day: number) {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  }

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      {label && <label className="text-sm font-medium text-[var(--color-text)]">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-left text-sm text-[var(--color-text)]"
        >
          <span className={value ? "" : "text-[var(--color-text-muted)]"}>
            {value ? formatDisplay(value) : placeholder}
          </span>
          <CalendarIcon size={16} className="shrink-0 text-[var(--color-text-muted)]" />
        </button>

        {open && (
          <div className="absolute z-30 mt-1 w-64 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-lg">
            <div className="flex items-center justify-between pb-2">
              <button
                type="button"
                onClick={() => setViewDate(new Date(year, month - 1, 1))}
                className="rounded p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]"
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium text-[var(--color-text)]">
                {viewDate.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
              </span>
              <button
                type="button"
                onClick={() => setViewDate(new Date(year, month + 1, 1))}
                className="rounded p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]"
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs text-[var(--color-text-muted)]">
              {WEEKDAYS.map((w) => (
                <span key={w} className="py-1">
                  {w}
                </span>
              ))}
              {cells.map((day, i) =>
                day === null ? (
                  <span key={`empty-${i}`} />
                ) : (
                  <button
                    key={day}
                    type="button"
                    onClick={() => pick(day)}
                    className={`rounded-full py-1 text-sm hover:bg-[var(--color-bg)] ${
                      isSelected(day)
                        ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]"
                        : isToday(day)
                        ? "font-semibold text-[var(--color-primary)]"
                        : "text-[var(--color-text)]"
                    }`}
                  >
                    {day}
                  </button>
                )
              )}
            </div>

            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="mt-2 w-full rounded-md py-1.5 text-center text-xs text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
