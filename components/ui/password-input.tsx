"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const inputId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-text)]">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            className={`w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 pr-10 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] ${className}`}
            {...props}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {error && <span className="text-xs text-[var(--color-danger)]">{error}</span>}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
