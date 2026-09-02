"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contentOverridesApi, ContentOverride } from "@/lib/content-overrides-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Modal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { OverrideForm } from "@/components/content-overrides/override-form";
import { useToast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/api-client";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { ExportCsvButton } from "@/components/ui/export-csv-button";
import { CsvColumn } from "@/lib/csv-export";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ContentOverridesPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<ContentOverride | null>(null);
  const [viewing, setViewing] = useState<ContentOverride | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ContentOverride | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["content-overrides", { search, page, pageSize }],
    queryFn: () => contentOverridesApi.list({ page, limit: pageSize, search: search || undefined }),
  });

  const createMutation = useMutation({
    mutationFn: (input: { snapshotId: string; overrideText: string; reason?: string }) =>
      contentOverridesApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content-overrides"] });
      queryClient.invalidateQueries({ queryKey: ["available-snapshots"] });
      showToast("Content override added", "success");
      setCreateOpen(false);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: { overrideText: string; reason?: string } }) =>
      contentOverridesApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content-overrides"] });
      showToast("Content override updated", "success");
      setEditing(null);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contentOverridesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content-overrides"] });
      queryClient.invalidateQueries({ queryKey: ["available-snapshots"] });
      showToast("Content override removed", "success");
      setPendingDelete(null);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const csvColumns: CsvColumn<ContentOverride>[] = [
    { header: "Trip", accessor: (o) => o.snapshot.trip.title },
    { header: "Destination", accessor: (o) => o.snapshot.trip.destination },
    { header: "Category", accessor: (o) => o.snapshot.category.name },
    { header: "Override Text", accessor: (o) => o.overrideText },
    { header: "Reason", accessor: (o) => o.reason ?? "" },
    { header: "Updated", accessor: (o) => formatDateTime(o.updatedAt) },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text)]">Manual Content Overrides</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Replace an auto-generated intelligence snapshot with a manually verified version.
          </p>
        </div>
        <div className="flex gap-2">
          <ExportCsvButton moduleName="Content Overrides" columns={csvColumns} rows={data?.data} />
          <Button onClick={() => setCreateOpen(true)}>Add Override</Button>
        </div>
      </div>

      <div className="max-w-sm">
        <Input
          label="Search"
          placeholder="Search override text or destination"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Trip / Destination</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Override Text</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {isLoading && <TableSkeleton columns={5} />}
            {!isLoading && data?.data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-[var(--color-text-muted)]">
                  No content overrides yet.
                </td>
              </tr>
            )}
            {data?.data.map((override) => (
              <tr key={override.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--color-text)]">{override.snapshot.trip.destination}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{override.snapshot.trip.title}</p>
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">{override.snapshot.category.name}</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">
                  {override.overrideText.slice(0, 60)}
                  {override.overrideText.length > 60 ? "…" : ""}
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">{formatDateTime(override.updatedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setViewing(override)}>
                      View
                    </Button>
                    <Button variant="secondary" onClick={() => setEditing(override)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => setPendingDelete(override)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data && (
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            total={data.pagination.total}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        )}
      </div>

      <Modal open={createOpen} title="Add Content Override" onClose={() => setCreateOpen(false)}>
        <OverrideForm
          mode="create"
          loading={createMutation.isPending}
          onCancel={() => setCreateOpen(false)}
          onSubmit={(values) =>
            createMutation.mutate({
              snapshotId: values.snapshotId,
              overrideText: values.overrideText,
              reason: values.reason || undefined,
            })
          }
        />
      </Modal>

      <Modal open={!!editing} title="Edit Content Override" onClose={() => setEditing(null)}>
        {editing && (
          <OverrideForm
            mode="edit"
            initial={{ overrideText: editing.overrideText, reason: editing.reason ?? "" }}
            snapshotLabel={`${editing.snapshot.trip.destination} · ${editing.snapshot.category.name}`}
            loading={updateMutation.isPending}
            onCancel={() => setEditing(null)}
            onSubmit={(values) =>
              updateMutation.mutate({
                id: editing.id,
                input: { overrideText: values.overrideText, reason: values.reason || undefined },
              })
            }
          />
        )}
      </Modal>

      <Modal open={!!viewing} title="Content Override Detail" onClose={() => setViewing(null)}>
        {viewing && (
          <div className="flex flex-col gap-3 text-sm">
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Trip</p>
              <p>{viewing.snapshot.trip.destination} — {viewing.snapshot.trip.title}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Category</p>
              <p>{viewing.snapshot.category.name}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Original Summary</p>
              <p className="text-[var(--color-text-muted)]">{viewing.snapshot.summary}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Override Text</p>
              <p>{viewing.overrideText}</p>
            </div>
            {viewing.reason && (
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Reason</p>
                <p>{viewing.reason}</p>
              </div>
            )}
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setViewing(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={!!pendingDelete}
        title="Delete content override"
        description={
          pendingDelete
            ? `This restores the auto-generated summary for ${pendingDelete.snapshot.trip.destination}. Continue?`
            : ""
        }
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
