"use client";

import { Download } from "lucide-react";
import { Button } from "./button";
import { useToast } from "./toast";
import { CsvColumn, downloadCsv } from "@/lib/csv-export";

interface ExportCsvButtonProps<T> {
  moduleName: string;
  columns: CsvColumn<T>[];
  rows: T[] | undefined;
}

/**
 * Themed "Export CSV" button reused across every table view. Exports the currently loaded
 * rows, prefixing the file with the module name so exports stay traceable.
 */
export function ExportCsvButton<T>({ moduleName, columns, rows }: ExportCsvButtonProps<T>) {
  const { showToast } = useToast();
  const hasRows = !!rows && rows.length > 0;

  function handleExport() {
    if (!rows || rows.length === 0) {
      showToast("Nothing to export yet", "error");
      return;
    }
    downloadCsv(moduleName, columns, rows);
    showToast(`Exported ${rows.length} row${rows.length === 1 ? "" : "s"} to CSV`, "success");
  }

  return (
    <Button type="button" variant="secondary" onClick={handleExport} disabled={!hasRows}>
      <Download size={16} />
      Export CSV
    </Button>
  );
}
