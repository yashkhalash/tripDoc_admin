"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enquiriesApi, ContactEnquiry, EnquiryStatus } from "@/lib/enquiries-api";
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

export default function EnquiriesPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<EnquiryStatus | "">("");
  const [page, setPage] = useState(1);

  const [viewing, setViewing] = useState<ContactEnquiry | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ContactEnquiry | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["enquiries", { search, status, page }],
    queryFn: () => enquiriesApi.list({ page, limit: 10, search: search || undefined, status: status || undefined }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: EnquiryStatus }) => enquiriesApi.update(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      setViewing(updated);
      showToast("Enquiry updated", "success");
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => enquiriesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      showToast("Enquiry removed", "success");
      setPendingDelete(null);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-[var(--color-text)]">Contact Enquiries Management</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Respond to and track inbound contact form submissions.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="Search"
            placeholder="Search by name, email, or subject"
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
              setStatus(e.target.value as EnquiryStatus | "");
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            <option value="NEW">New</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed</option>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Received</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-[var(--color-text-muted)]">
                  Loading enquiries…
                </td>
              </tr>
            )}
            {!isLoading && data?.data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-[var(--color-text-muted)]">
                  No enquiries found.
                </td>
              </tr>
            )}
            {data?.data.map((e) => (
              <tr key={e.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--color-text)]">{e.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{e.email}</p>
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">{e.subject}</td>
                <td className="px-4 py-3">
                  <Badge status={e.status} />
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">{formatDateTime(e.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setViewing(e)}>
                      View
                    </Button>
                    <Button variant="danger" onClick={() => setPendingDelete(e)}>
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

      <Modal open={!!viewing} title="Enquiry Detail" onClose={() => setViewing(null)}>
        {viewing && (
          <div className="flex flex-col gap-4 text-sm">
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">From</p>
              <p>{viewing.name} ({viewing.email})</p>
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
              onChange={(e) => updateMutation.mutate({ id: viewing.id, status: e.target.value as EnquiryStatus })}
            >
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
            </Select>
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
        title="Delete enquiry"
        description={pendingDelete ? `Are you sure you want to delete the enquiry from "${pendingDelete.name}"?` : ""}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
