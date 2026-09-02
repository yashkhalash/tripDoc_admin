export function TableSkeleton({ columns, rows = 6 }: { columns: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: columns }).map((_, c) => (
            <td key={c} className="px-4 py-3">
              <div
                className="h-4 animate-pulse rounded bg-[var(--color-border)]"
                style={{ width: c === 0 ? "70%" : `${45 + ((r + c) % 3) * 15}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
