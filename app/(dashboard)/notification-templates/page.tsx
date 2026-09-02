"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  notificationTemplatesApi,
  NotificationTemplate,
  NotificationChannel,
  TemplateFormInput,
} from "@/lib/notification-templates-api";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Modal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { TemplateForm } from "@/components/notification-templates/template-form";
import { useToast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/api-client";

export default function NotificationTemplatesPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState<NotificationChannel | "">("");
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<NotificationTemplate | null>(null);
  const [viewing, setViewing] = useState<NotificationTemplate | null>(null);
  const [pendingDelete, setPendingDelete] = useState<NotificationTemplate | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["notification-templates", { search, channel, page }],
    queryFn: () =>
      notificationTemplatesApi.list({ page, limit: 10, search: search || undefined, channel: channel || undefined }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["notification-templates"] });

  const createMutation = useMutation({
    mutationFn: (input: TemplateFormInput) => notificationTemplatesApi.create(input),
    onSuccess: () => {
      invalidate();
      showToast("Template created", "success");
      setCreateOpen(false);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: TemplateFormInput }) =>
      notificationTemplatesApi.update(id, input),
    onSuccess: () => {
      invalidate();
      showToast("Template updated", "success");
      setEditing(null);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationTemplatesApi.remove(id),
    onSuccess: () => {
      invalidate();
      showToast("Template removed", "success");
      setPendingDelete(null);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text)]">Notification Template Management</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Manage push, email, and SMS templates sent to travelers.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Add Template</Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="Search"
            placeholder="Search by template name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            label="Channel"
            value={channel}
            onChange={(e) => {
              setChannel(e.target.value as NotificationChannel | "");
              setPage(1);
            }}
          >
            <option value="">All channels</option>
            <option value="PUSH">Push</option>
            <option value="EMAIL">Email</option>
            <option value="SMS">SMS</option>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Channel</th>
              <th className="px-4 py-3 font-medium">Active</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-[var(--color-text-muted)]">
                  Loading templates…
                </td>
              </tr>
            )}
            {!isLoading && data?.data.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-[var(--color-text-muted)]">
                  No templates found.
                </td>
              </tr>
            )}
            {data?.data.map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-3 font-medium text-[var(--color-text)]">{t.name}</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">{t.channel}</td>
                <td className="px-4 py-3">
                  <Badge status={t.isActive ? "ACTIVE" : "PAUSED"} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setViewing(t)}>
                      View
                    </Button>
                    <Button variant="secondary" onClick={() => setEditing(t)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => setPendingDelete(t)}>
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

      <Modal open={createOpen} title="Add Notification Template" onClose={() => setCreateOpen(false)}>
        <TemplateForm
          submitLabel="Add Template"
          loading={createMutation.isPending}
          onCancel={() => setCreateOpen(false)}
          onSubmit={(values) => createMutation.mutate(values)}
        />
      </Modal>

      <Modal open={!!editing} title="Edit Notification Template" onClose={() => setEditing(null)}>
        {editing && (
          <TemplateForm
            initial={{ ...editing, subject: editing.subject ?? "" }}
            submitLabel="Save Changes"
            loading={updateMutation.isPending}
            onCancel={() => setEditing(null)}
            onSubmit={(values) => updateMutation.mutate({ id: editing.id, input: values })}
          />
        )}
      </Modal>

      <Modal open={!!viewing} title="Template Detail" onClose={() => setViewing(null)}>
        {viewing && (
          <div className="flex flex-col gap-3 text-sm">
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Channel</p>
              <p>{viewing.channel}</p>
            </div>
            {viewing.subject && (
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Subject</p>
                <p>{viewing.subject}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Body</p>
              <p className="whitespace-pre-wrap text-[var(--color-text-muted)]">{viewing.body}</p>
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
        title="Delete template"
        description={pendingDelete ? `Are you sure you want to delete "${pendingDelete.name}"?` : ""}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
