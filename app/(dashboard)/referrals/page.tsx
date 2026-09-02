"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { referralApi, ReferralStatus, Referral, InfluencerUpgrade } from "@/lib/referral-api";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { useToast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/api-client";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { ExportCsvButton } from "@/components/ui/export-csv-button";
import { CsvColumn } from "@/lib/csv-export";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

type Tab = "referrals" | "influencers";

export default function ReferralsPage() {
  const [tab, setTab] = useState<Tab>("referrals");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-[var(--color-text)]">Referral &amp; Influencer Management</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Track referral conversions and approve influencer upgrade requests.
        </p>
      </div>

      <div className="flex gap-2 border-b border-[var(--color-border)]">
        {(["referrals", "influencers"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize ${
              tab === t
                ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            {t === "referrals" ? "Referrals" : "Influencer Upgrades"}
          </button>
        ))}
      </div>

      {tab === "referrals" ? <ReferralsTab /> : <InfluencerUpgradesTab />}
    </div>
  );
}

function ReferralsTab() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ReferralStatus | "">("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["referrals", { search, status, page, pageSize }],
    queryFn: () =>
      referralApi.listReferrals({ page, limit: pageSize, search: search || undefined, status: status || undefined }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReferralStatus }) => referralApi.updateReferral(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
      showToast("Referral updated", "success");
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const csvColumns: CsvColumn<Referral>[] = [
    { header: "Code", accessor: (r) => r.code },
    { header: "Sender", accessor: (r) => r.sender.name },
    { header: "Sender Email", accessor: (r) => r.sender.email },
    { header: "Receiver", accessor: (r) => r.receiver?.name ?? "" },
    { header: "Reward", accessor: (r) => r.rewardAmount },
    { header: "Status", accessor: (r) => r.status },
    { header: "Created", accessor: (r) => formatDate(r.createdAt) },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <ExportCsvButton moduleName="Referrals" columns={csvColumns} rows={data?.data} />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="Search"
            placeholder="Search by code or sender name"
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
              setStatus(e.target.value as ReferralStatus | "");
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONVERTED">Converted</option>
            <option value="EXPIRED">Expired</option>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Sender</th>
              <th className="px-4 py-3 font-medium">Receiver</th>
              <th className="px-4 py-3 font-medium">Reward</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {isLoading && <TableSkeleton columns={7} />}
            {!isLoading && data?.data.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-[var(--color-text-muted)]">
                  No referrals found.
                </td>
              </tr>
            )}
            {data?.data.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-mono text-xs">{r.code}</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">{r.sender.name}</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">{r.receiver?.name ?? "—"}</td>
                <td className="px-4 py-3">${r.rewardAmount}</td>
                <td className="px-4 py-3">
                  <Badge status={r.status} />
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">{formatDate(r.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {r.status === "PENDING" && (
                      <>
                        <Button
                          variant="secondary"
                          loading={updateMutation.isPending}
                          onClick={() => updateMutation.mutate({ id: r.id, status: "CONVERTED" })}
                        >
                          Mark Converted
                        </Button>
                        <Button
                          variant="secondary"
                          loading={updateMutation.isPending}
                          onClick={() => updateMutation.mutate({ id: r.id, status: "EXPIRED" })}
                        >
                          Mark Expired
                        </Button>
                      </>
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
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
}

function InfluencerUpgradesTab() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [approvedFilter, setApprovedFilter] = useState<"" | "true" | "false">("");

  const { data, isLoading } = useQuery({
    queryKey: ["influencer-upgrades", { page, pageSize, approvedFilter }],
    queryFn: () =>
      referralApi.listInfluencerUpgrades({
        page,
        limit: pageSize,
        approved: approvedFilter === "" ? undefined : approvedFilter === "true",
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) =>
      referralApi.updateInfluencerUpgrade(id, approved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["influencer-upgrades"] });
      showToast("Influencer upgrade updated", "success");
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const csvColumns: CsvColumn<InfluencerUpgrade>[] = [
    { header: "User", accessor: (u) => u.user.name },
    { header: "Email", accessor: (u) => u.user.email },
    { header: "Tier", accessor: (u) => u.tier },
    { header: "Approved", accessor: (u) => (u.approved ? "Yes" : "No") },
    { header: "Requested", accessor: (u) => formatDate(u.createdAt) },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <ExportCsvButton moduleName="Influencer Upgrades" columns={csvColumns} rows={data?.data} />
      </div>
      <div className="w-full sm:w-48">
        <Select
          label="Approval status"
          value={approvedFilter}
          onChange={(e) => {
            setApprovedFilter(e.target.value as "" | "true" | "false");
            setPage(1);
          }}
        >
          <option value="">All</option>
          <option value="true">Approved</option>
          <option value="false">Pending approval</option>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Tier</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Requested</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {isLoading && <TableSkeleton columns={5} />}
            {!isLoading && data?.data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-[var(--color-text-muted)]">
                  No influencer upgrade requests.
                </td>
              </tr>
            )}
            {data?.data.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--color-text)]">{u.user.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{u.user.email}</p>
                </td>
                <td className="px-4 py-3 capitalize text-[var(--color-text-muted)]">{u.tier}</td>
                <td className="px-4 py-3">
                  <Badge status={u.approved ? "ACTIVE" : "PENDING"} />
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {!u.approved ? (
                      <Button
                        variant="primary"
                        loading={updateMutation.isPending}
                        onClick={() => updateMutation.mutate({ id: u.id, approved: true })}
                      >
                        Approve
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        loading={updateMutation.isPending}
                        onClick={() => updateMutation.mutate({ id: u.id, approved: false })}
                      >
                        Revoke
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
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
}
