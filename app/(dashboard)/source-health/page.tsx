"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  sourceHealthApi,
  SourceHealth,
  SourceHealthStatus,
  SourceHealthFormInput,
} from "@/lib/source-health-api";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Modal } from "@/components/ui/modal";
import { SourceHealthForm } from "@/components/source-health/source-health-form";
import { useToast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/api-client";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SourceHealthPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SourceHealthStatus | "">("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SourceHealth | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SourceHealth | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["source-health", { search, status, page }],
    queryFn: () =>
      sourceHealthApi.list({
        page,
        limit: 10,
        search: search || undefined,
        status: status || undefined,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (input: SourceHealthFormInput) => sourceHealthApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["source-health"] });
      showToast("Source added", "success");
      setFormOpen(false);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: SourceHealthFormInput }) =>
      sourceHealthApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["source-health"] });
      showToast("Source updated", "success");
      setEditing(null);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => sourceHealthApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["source-health"] });
      showToast("Source removed", "success");
      setPendingDelete(null);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text)]">Source Health Monitoring</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Track the health of external data sources powering trip intelligence.
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>Add Source</Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="Search"
            placeholder="Search by source name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            label="Status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as SourceHealthStatus | "");
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            <option value="HEALTHY">Healthy</option>
            <option value="DEGRADED">Degraded</option>
            <option value="DOWN">Down</option>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Response Time</th>
              <th className="px-4 py-3 font-medium">Last Checked</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-[var(--color-text-muted)]">
                  Loading sources…
                </td>
              </tr>
            )}
            {!isLoading && data?.data.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-[var(--color-text-muted)]">
                  No sources found.
                </td>
              </tr>
            )}
            {data?.data.map((source) => (
              <tr key={source.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--color-text)]">{source.sourceName}</p>
                  {source.message && (
                    <p className="text-xs text-[var(--color-text-muted)]">{source.message}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">{source.category}</td>
                <td className="px-4 py-3">
                  <Badge status={source.status} />
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">
                  {source.responseTimeMs !== null ? `${source.responseTimeMs} ms` : "—"}
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">
                  {formatDateTime(source.lastCheckedAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setEditing(source)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => setPendingDelete(source)}>
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
          />
        )}
      </div>

      <Modal open={formOpen} title="Add Source" onClose={() => setFormOpen(false)}>
        <SourceHealthForm
          submitLabel="Add Source"
          loading={createMutation.isPending}
          onCancel={() => setFormOpen(false)}
          onSubmit={(values) => createMutation.mutate(values)}
        />
      </Modal>

      <Modal open={!!editing} title="Edit Source" onClose={() => setEditing(null)}>
        {editing && (
          <SourceHealthForm
            initial={editing}
            submitLabel="Save Changes"
            loading={updateMutation.isPending}
            onCancel={() => setEditing(null)}
            onSubmit={(values) => updateMutation.mutate({ id: editing.id, input: values })}
          />
        )}
      </Modal>

      <ConfirmModal
        open={!!pendingDelete}
        title="Delete source"
        description={
          pendingDelete ? `Are you sure you want to remove "${pendingDelete.sourceName}"?` : ""
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
