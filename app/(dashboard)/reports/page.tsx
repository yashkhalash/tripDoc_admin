"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { feedbackApi, FeedbackReport, FeedbackStatus } from "@/lib/feedback-api";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Modal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useToast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/api-client";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function FeedbackReportsPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FeedbackStatus | "">("");
  const [page, setPage] = useState(1);

  const [viewing, setViewing] = useState<FeedbackReport | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [pendingDelete, setPendingDelete] = useState<FeedbackReport | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["feedback-reports", { search, status, page }],
    queryFn: () =>
      feedbackApi.list({ page, limit: 10, search: search || undefined, status: status || undefined }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: { status?: FeedbackStatus; adminNotes?: string } }) =>
      feedbackApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback-reports"] });
      showToast("Feedback updated", "success");
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => feedbackApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback-reports"] });
      showToast("Feedback report removed", "success");
      setPendingDelete(null);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  function openView(report: FeedbackReport) {
    setViewing(report);
    setNotesDraft(report.adminNotes ?? "");
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-[var(--color-text)]">Feedback &amp; Report Management</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Review and resolve traveler feedback and reports.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="Search"
            placeholder="Search by subject or message"
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
              setStatus(e.target.value as FeedbackStatus | "");
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="DISMISSED">Dismissed</option>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Reporter</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-[var(--color-text-muted)]">
                  Loading reports…
                </td>
              </tr>
            )}
            {!isLoading && data?.data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-[var(--color-text-muted)]">
                  No feedback reports found.
                </td>
              </tr>
            )}
            {data?.data.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-medium text-[var(--color-text)]">{r.subject}</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">{r.user.name}</td>
                <td className="px-4 py-3">
                  <Badge status={r.status} />
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">{formatDateTime(r.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => openView(r)}>
                      View
                    </Button>
                    <Button variant="danger" onClick={() => setPendingDelete(r)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data && (
          <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} total={data.pagination.total} onPageChange={setPage} />
        )}
      </div>

      <Modal open={!!viewing} title="Feedback Detail" onClose={() => setViewing(null)}>
        {viewing && (
          <div className="flex flex-col gap-4 text-sm">
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Reporter</p>
              <p>{viewing.user.name} ({viewing.user.email})</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Subject</p>
              <p>{viewing.subject}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Message</p>
              <p className="text-[var(--color-text-muted)]">{viewing.message}</p>
            </div>
            <Select
              label="Status"
              value={viewing.status}
              onChange={(e) => {
                const status = e.target.value as FeedbackStatus;
                setViewing((v) => (v ? { ...v, status } : v));
                updateMutation.mutate({ id: viewing.id, input: { status } });
              }}
            >
              <option value="OPEN">Open</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="RESOLVED">Resolved</option>
              <option value="DISMISSED">Dismissed</option>
            </Select>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--color-text)]">Admin notes</label>
              <textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                rows={3}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setViewing(null)}>
                Close
              </Button>
              <Button
                loading={updateMutation.isPending}
                onClick={() => updateMutation.mutate({ id: viewing.id, input: { adminNotes: notesDraft } })}
              >
                Save Notes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={!!pendingDelete}
        title="Delete feedback report"
        description={pendingDelete ? `Are you sure you want to delete "${pendingDelete.subject}"?` : ""}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
