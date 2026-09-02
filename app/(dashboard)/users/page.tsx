"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi, AdminUser, UserStatus } from "@/lib/user-api";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useToast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/api-client";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function UsersPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<UserStatus | "">("");
  const [page, setPage] = useState(1);
  const [pendingAction, setPendingAction] = useState<
    { type: "suspend" | "activate" | "delete"; user: AdminUser } | null
  >(null);

  const { data, isLoading } = useQuery({
    queryKey: ["users", { search, status, page }],
    queryFn: () =>
      userApi.list({
        page,
        limit: 10,
        search: search || undefined,
        status: status || undefined,
      }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) => userApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showToast("User status updated", "success");
      setPendingAction(null);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showToast("User deleted", "success");
      setPendingAction(null);
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  function confirmAction() {
    if (!pendingAction) return;
    if (pendingAction.type === "delete") {
      deleteMutation.mutate(pendingAction.user.id);
    } else {
      statusMutation.mutate({
        id: pendingAction.user.id,
        status: pendingAction.type === "suspend" ? "SUSPENDED" : "ACTIVE",
      });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-[var(--color-text)]">User Management</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Browse, search, and manage TripDoc member accounts.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="Search"
            placeholder="Search by name or email"
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
              setStatus(e.target.value as UserStatus | "");
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="DELETED">Deleted</option>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Trips</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-[var(--color-text-muted)]">
                  Loading users…
                </td>
              </tr>
            )}
            {!isLoading && data?.data.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-[var(--color-text-muted)]">
                  No users found.
                </td>
              </tr>
            )}
            {data?.data.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3">
                  <Link href={`/users/${user.id}`} className="font-medium text-[var(--color-primary)] hover:underline">
                    {user.name}
                  </Link>
                  {user.isInfluencer && <span className="ml-2 text-xs text-[var(--color-accent)]">Influencer</span>}
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge status={user.status} />
                </td>
                <td className="px-4 py-3">{user.tripCount ?? 0}</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {user.status === "ACTIVE" ? (
                      <Button
                        variant="secondary"
                        onClick={() => setPendingAction({ type: "suspend", user })}
                      >
                        Suspend
                      </Button>
                    ) : user.status === "SUSPENDED" ? (
                      <Button
                        variant="secondary"
                        onClick={() => setPendingAction({ type: "activate", user })}
                      >
                        Activate
                      </Button>
                    ) : null}
                    {user.status !== "DELETED" && (
                      <Button variant="danger" onClick={() => setPendingAction({ type: "delete", user })}>
                        Delete
                      </Button>
                    )}
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

      <ConfirmModal
        open={!!pendingAction}
        title={
          pendingAction?.type === "delete"
            ? "Delete user"
            : pendingAction?.type === "suspend"
            ? "Suspend user"
            : "Activate user"
        }
        description={
          pendingAction
            ? `Are you sure you want to ${pendingAction.type} ${pendingAction.user.name}?`
            : ""
        }
        confirmLabel={pendingAction?.type === "delete" ? "Delete" : "Confirm"}
        variant={pendingAction?.type === "delete" ? "danger" : "primary"}
        loading={statusMutation.isPending || deleteMutation.isPending}
        onConfirm={confirmAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
}
