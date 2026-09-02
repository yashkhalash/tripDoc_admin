export interface CsvColumn<T> {
  header: string;
  accessor: (row: T) => string | number | boolean | null | undefined;
}

function escapeCsvCell(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Builds a CSV string for `rows` using `columns`, prefixed with a title line naming the
 * source module so exports are traceable back to where they came from.
 */
export function buildCsv<T>(moduleName: string, columns: CsvColumn<T>[], rows: T[]): string {
  const generatedAt = new Date().toLocaleString();
  const lines: string[] = [];

  lines.push(escapeCsvCell(`${moduleName} Export`));
  lines.push(escapeCsvCell(`Generated: ${generatedAt}`));
  lines.push("");
  lines.push(columns.map((c) => escapeCsvCell(c.header)).join(","));

  for (const row of rows) {
    lines.push(columns.map((c) => escapeCsvCell(c.accessor(row))).join(","));
  }

  return lines.join("\n");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function downloadCsv<T>(moduleName: string, columns: CsvColumn<T>[], rows: T[]) {
  const csv = buildCsv(moduleName, columns, rows);
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStamp = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `${slugify(moduleName)}-${dateStamp}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
