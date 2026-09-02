"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { refreshJobsApi, RefreshJob, RefreshJobStatus, RefreshJobFormInput } from "@/lib/refresh-jobs-api";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Modal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { RefreshJobForm } from "@/components/refresh-jobs/refresh-job-form";
import { useToast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/api-client";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { ExportCsvButton } from "@/components/ui/export-csv-button";
import { CsvColumn } from "@/lib/csv-export";

function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function RefreshJobsPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<RefreshJobStatus | "">("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<RefreshJob | null>(null);
  const [pendingDelete, setPendingDelete] = useState<RefreshJob | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["refresh-jobs", { search, status, page, pageSize }],
    queryFn: () => refreshJobsApi.list({ page, limit: pageSize, search: search || undefined, status: status || undefined }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["refresh-jobs"] });

  const createMutation = useMutation({
    mutationFn: (input: RefreshJobFormInput) => refreshJobsApi.create(input),
    onSuccess: () => {
      invalidate();
      showToast("Refresh job created", "success");
      setCreateOpen(false);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: RefreshJobFormInput }) => refreshJobsApi.update(id, input),
    onSuccess: () => {
      invalidate();
      showToast("Refresh job updated", "success");
      setEditing(null);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => refreshJobsApi.remove(id),
    onSuccess: () => {
      invalidate();
      showToast("Refresh job removed", "success");
      setPendingDelete(null);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const runMutation = useMutation({
    mutationFn: (id: string) => refreshJobsApi.runNow(id),
    onSuccess: () => {
      invalidate();
      showToast("Job triggered", "success");
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const csvColumns: CsvColumn<RefreshJob>[] = [
    { header: "Job", accessor: (j) => j.name },
    { header: "Source", accessor: (j) => j.sourceName },
    { header: "Schedule", accessor: (j) => j.cronSchedule },
    { header: "Status", accessor: (j) => j.status },
    { header: "Last Run", accessor: (j) => formatDateTime(j.lastRunAt) },
    { header: "Last Run Status", accessor: (j) => j.lastRunStatus ?? "" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text)]">Scheduled Refresh Jobs</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Configure automated refresh schedules for intelligence data sources.
          </p>
        </div>
        <div className="flex gap-2">
          <ExportCsvButton moduleName="Refresh Jobs" columns={csvColumns} rows={data?.data} />
          <Button onClick={() => setCreateOpen(true)}>Add Job</Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="Search"
            placeholder="Search by job or source name"
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
              setStatus(e.target.value as RefreshJobStatus | "");
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="FAILED">Failed</option>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Job</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Schedule</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last Run</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {isLoading && <TableSkeleton columns={6} />}
            {!isLoading && data?.data.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-[var(--color-text-muted)]">
                  No refresh jobs configured.
                </td>
              </tr>
            )}
            {data?.data.map((job) => (
              <tr key={job.id}>
                <td className="px-4 py-3 font-medium text-[var(--color-text)]">{job.name}</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">{job.sourceName}</td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-muted)]">{job.cronSchedule}</td>
                <td className="px-4 py-3">
                  <Badge status={job.status} />
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">{formatDateTime(job.lastRunAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" loading={runMutation.isPending} onClick={() => runMutation.mutate(job.id)}>
                      Run Now
                    </Button>
                    <Button variant="secondary" onClick={() => setEditing(job)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => setPendingDelete(job)}>
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

      <Modal open={createOpen} title="Add Refresh Job" onClose={() => setCreateOpen(false)}>
        <RefreshJobForm
          submitLabel="Add Job"
          loading={createMutation.isPending}
          onCancel={() => setCreateOpen(false)}
          onSubmit={(values) => createMutation.mutate(values)}
        />
      </Modal>

      <Modal open={!!editing} title="Edit Refresh Job" onClose={() => setEditing(null)}>
        {editing && (
          <RefreshJobForm
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
        title="Delete refresh job"
        description={pendingDelete ? `Are you sure you want to remove "${pendingDelete.name}"?` : ""}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
