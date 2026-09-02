"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/lib/settings-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/api-client";

function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ApiConfigurationPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [version, setVersion] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["api-version"],
    queryFn: settingsApi.getApiVersion,
  });

  useEffect(() => {
    if (data) setVersion(data.version);
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (version: string) => settingsApi.updateApiVersion(version),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["api-version"] });
      showToast(
        `API version updated to ${updated.version}. Update NEXT_PUBLIC_API_VERSION to match.`,
        "success"
      );
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--color-text)]">API Configuration</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Controls the active API version segment used by every backend route (
          <code className="font-mono">/&#123;api_version&#125;/&#123;role&#125;/...</code>).
        </p>
      </div>

      <div className="max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
        {isLoading ? (
          <p className="text-sm text-[var(--color-text-muted)]">Loading current configuration…</p>
        ) : (
          <>
            <p className="text-sm text-[var(--color-text-muted)]">
              Current version: <span className="font-mono text-[var(--color-text)]">{data?.version}</span>
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Last updated: {formatDateTime(data?.updatedAt ?? null)}
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateMutation.mutate(version);
              }}
              className="mt-4 flex flex-col gap-4"
            >
              <Input
                label="New API version"
                placeholder="v1"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                required
              />
              <div className="flex justify-end">
                <Button type="submit" loading={updateMutation.isPending}>
                  Update Version
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
