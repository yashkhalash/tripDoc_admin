export function PageLoader() {
  return (
    <div className="flex min-h-screen w-full flex-1 items-center justify-center bg-[var(--color-bg)]">
      <div className="flex flex-col items-center gap-3">
        <span className="h-9 w-9 animate-spin rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-primary)]" />
        <span className="text-sm text-[var(--color-text-muted)]">Loading…</span>
      </div>
    </div>
  );
}
