"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { faqApi, Faq, FaqFormInput } from "@/lib/faq-api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Modal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { FaqForm } from "@/components/faq/faq-form";
import { useToast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/api-client";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { ExportCsvButton } from "@/components/ui/export-csv-button";
import { CsvColumn } from "@/lib/csv-export";

export default function FaqPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Faq | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["faqs", { search, page, pageSize }],
    queryFn: () => faqApi.list({ page, limit: pageSize, search: search || undefined }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["faqs"] });

  const createMutation = useMutation({
    mutationFn: (input: FaqFormInput) => faqApi.create(input),
    onSuccess: () => {
      invalidate();
      showToast("FAQ created", "success");
      setCreateOpen(false);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: FaqFormInput }) => faqApi.update(id, input),
    onSuccess: () => {
      invalidate();
      showToast("FAQ updated", "success");
      setEditing(null);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => faqApi.remove(id),
    onSuccess: () => {
      invalidate();
      showToast("FAQ removed", "success");
      setPendingDelete(null);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const csvColumns: CsvColumn<Faq>[] = [
    { header: "Question", accessor: (f) => f.question },
    { header: "Answer", accessor: (f) => f.answer },
    { header: "Category", accessor: (f) => f.category ?? "" },
    { header: "Sort Order", accessor: (f) => f.sortOrder },
    { header: "Active", accessor: (f) => (f.isActive ? "Yes" : "No") },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text)]">FAQ Management</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Manage frequently asked questions shown in the app.</p>
        </div>
        <div className="flex gap-2">
          <ExportCsvButton moduleName="FAQ Management" columns={csvColumns} rows={data?.data} />
          <Button onClick={() => setCreateOpen(true)}>Add FAQ</Button>
        </div>
      </div>

      <div className="max-w-sm">
        <Input
          label="Search"
          placeholder="Search question or answer"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Question</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {isLoading && <TableSkeleton columns={4} />}
            {!isLoading && data?.data.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-[var(--color-text-muted)]">
                  No FAQs found.
                </td>
              </tr>
            )}
            {data?.data.map((f) => (
              <tr key={f.id}>
                <td className="px-4 py-3 font-medium text-[var(--color-text)]">{f.question}</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">{f.category ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge status={f.isActive ? "ACTIVE" : "PAUSED"} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setEditing(f)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => setPendingDelete(f)}>
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

      <Modal open={createOpen} title="Add FAQ" onClose={() => setCreateOpen(false)}>
        <FaqForm
          submitLabel="Add FAQ"
          loading={createMutation.isPending}
          onCancel={() => setCreateOpen(false)}
          onSubmit={(values) => createMutation.mutate(values)}
        />
      </Modal>

      <Modal open={!!editing} title="Edit FAQ" onClose={() => setEditing(null)}>
        {editing && (
          <FaqForm
            initial={{ ...editing, category: editing.category ?? "" }}
            submitLabel="Save Changes"
            loading={updateMutation.isPending}
            onCancel={() => setEditing(null)}
            onSubmit={(values) => updateMutation.mutate({ id: editing.id, input: values })}
          />
        )}
      </Modal>

      <ConfirmModal
        open={!!pendingDelete}
        title="Delete FAQ"
        description={pendingDelete ? `Are you sure you want to delete "${pendingDelete.question}"?` : ""}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
