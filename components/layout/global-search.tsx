"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav-items";

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goTo(href: string) {
    router.push(href);
    setQuery("");
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      goTo(results[activeIndex].href);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative hidden max-w-sm flex-1 md:block" ref={containerRef}>
      <div className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 transition-colors focus-within:border-[var(--color-primary)]">
        <Search size={16} className="shrink-0 text-[var(--color-text-muted)]" />
        <input
          type="search"
          placeholder="Search pages…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
        />
      </div>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 z-30 mt-1 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg">
          {results.length === 0 ? (
            <p className="px-3 py-3 text-sm text-[var(--color-text-muted)]">No pages match &quot;{query}&quot;.</p>
          ) : (
            <ul className="max-h-72 overflow-y-auto py-1">
              {results.map((item, i) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => goTo(item.href)}
                      className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm ${
                        i === activeIndex
                          ? "bg-[var(--color-bg)] text-[var(--color-primary)]"
                          : "text-[var(--color-text)]"
                      }`}
                    >
                      <Icon size={16} className="shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
