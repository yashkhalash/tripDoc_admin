"use client";

import {
  Children,
  isValidElement,
  ReactNode,
  SelectHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronDown, Check } from "lucide-react";

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  children: ReactNode;
}

interface OptionData {
  value: string;
  label: string;
  disabled?: boolean;
}

function extractOptions(children: ReactNode): OptionData[] {
  const options: OptionData[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement<{ value?: string; children?: ReactNode; disabled?: boolean }>(child)) {
      const value = child.props.value != null ? String(child.props.value) : "";
      const label = typeof child.props.children === "string" ? child.props.children : value;
      options.push({ value, label, disabled: child.props.disabled });
    }
  });
  return options;
}

/**
 * Custom-styled dropdown that mirrors the native <select> API (value/onChange/children as
 * <option>) so existing call sites work unchanged, while rendering its own themed listbox.
 */
export function Select({ label, value, onChange, id, name, disabled, required, children, className = "" }: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectId = id ?? name;

  const options = extractOptions(children);
  const selected = options.find((o) => o.value === (value ?? ""));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectValue(v: string) {
    setOpen(false);
    onChange?.({ target: { value: v, name } } as unknown as React.ChangeEvent<HTMLSelectElement>);
  }

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-[var(--color-text)]">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          id={selectId}
          disabled={disabled}
          aria-required={required}
          onClick={() => setOpen((o) => !o)}
          className={`flex w-full items-center justify-between gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-left text-sm text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        >
          <span className="truncate">{selected?.label ?? ""}</span>
          <ChevronDown size={16} className={`shrink-0 text-[var(--color-text-muted)] transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <ul className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-lg">
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  disabled={opt.disabled}
                  onClick={() => selectValue(opt.value)}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-50 ${
                    opt.value === selected?.value ? "text-[var(--color-primary)]" : "text-[var(--color-text)]"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {opt.value === selected?.value && <Check size={14} />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
