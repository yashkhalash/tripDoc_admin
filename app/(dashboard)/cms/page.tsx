"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cmsApi, CmsPage, CmsPageStatus, CmsPageFormInput } from "@/lib/cms-api";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Modal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { CmsPageForm } from "@/components/cms/cms-page-form";
import { useToast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/api-client";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { ExportCsvButton } from "@/components/ui/export-csv-button";
import { CsvColumn } from "@/lib/csv-export";

export default function CmsPagesPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CmsPageStatus | "">("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<CmsPage | null>(null);
  const [viewing, setViewing] = useState<CmsPage | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CmsPage | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["cms-pages", { search, status, page, pageSize }],
    queryFn: () => cmsApi.list({ page, limit: pageSize, search: search || undefined, status: status || undefined }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["cms-pages"] });

  const createMutation = useMutation({
    mutationFn: (input: CmsPageFormInput) => cmsApi.create(input),
    onSuccess: () => {
      invalidate();
      showToast("Page created", "success");
      setCreateOpen(false);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CmsPageFormInput }) => cmsApi.update(id, input),
    onSuccess: () => {
      invalidate();
      showToast("Page updated", "success");
      setEditing(null);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => cmsApi.remove(id),
    onSuccess: () => {
      invalidate();
      showToast("Page removed", "success");
      setPendingDelete(null);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const csvColumns: CsvColumn<CmsPage>[] = [
    { header: "Title", accessor: (p) => p.title },
    { header: "Slug", accessor: (p) => p.slug },
    { header: "Status", accessor: (p) => p.status },
    { header: "Content", accessor: (p) => p.content },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text)]">CMS Management</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Manage static content pages shown in the app.</p>
        </div>
        <div className="flex gap-2">
          <ExportCsvButton moduleName="CMS Management" columns={csvColumns} rows={data?.data} />
          <Button onClick={() => setCreateOpen(true)}>Add Page</Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="Search"
            placeholder="Search by title or slug"
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
              setStatus(e.target.value as CmsPageStatus | "");
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {isLoading && <TableSkeleton columns={4} />}
            {!isLoading && data?.data.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-[var(--color-text-muted)]">
                  No CMS pages found.
                </td>
              </tr>
            )}
            {data?.data.map((p) => (
              <tr key={p.id} className="hover:bg-[var(--color-bg)] transition-colors">
                <td className="px-4 py-3 font-medium text-[var(--color-text)]">{p.title}</td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-muted)]">{p.slug}</td>
                <td className="px-4 py-3">
                  <Badge status={p.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setViewing(p)}>
                      View
                    </Button>
                    <Button variant="secondary" onClick={() => setEditing(p)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => setPendingDelete(p)}>
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

      <Modal open={createOpen} title="Add CMS Page" onClose={() => setCreateOpen(false)}>
        <CmsPageForm
          submitLabel="Add Page"
          loading={createMutation.isPending}
          onCancel={() => setCreateOpen(false)}
          onSubmit={(values) => createMutation.mutate(values)}
        />
      </Modal>

      <Modal open={!!editing} title="Edit CMS Page" onClose={() => setEditing(null)}>
        {editing && (
          <CmsPageForm
            initial={editing}
            submitLabel="Save Changes"
            loading={updateMutation.isPending}
            onCancel={() => setEditing(null)}
            onSubmit={(values) => updateMutation.mutate({ id: editing.id, input: values })}
          />
        )}
      </Modal>

      <Modal open={!!viewing} title="Page Detail" onClose={() => setViewing(null)}>
        {viewing && (
          <div className="flex flex-col gap-3 text-sm">
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Slug</p>
              <p className="font-mono">{viewing.slug}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Content</p>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: viewing.content }}
              />
            </div>
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
        title="Delete CMS page"
        description={pendingDelete ? `Are you sure you want to delete "${pendingDelete.title}"?` : ""}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
