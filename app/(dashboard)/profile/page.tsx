"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/lib/profile-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/api-client";

export default function ProfilePage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["admin-profile-page"],
    queryFn: profileApi.get,
  });

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setAvatarUrl(profile.avatarUrl ?? "");
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: () => profileApi.update({ name, avatarUrl: avatarUrl || null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-profile-page"] });
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
      showToast("Profile updated", "success");
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordMutation = useMutation({
    mutationFn: () => profileApi.changePassword(currentPassword, newPassword),
    onSuccess: (result) => {
      showToast(result.message, "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err) => showToast(getApiErrorMessage(err), "error"),
  });

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }
    passwordMutation.mutate();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--color-text)]">My Profile</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Manage your admin account details and password.</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-[var(--color-text-muted)]">Loading profile…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Account Details</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateMutation.mutate();
              }}
              className="mt-4 flex flex-col gap-4"
            >
              <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Email" value={profile?.email ?? ""} disabled />
              <Input
                label="Avatar URL"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://…"
              />
              <div className="flex justify-end">
                <Button type="submit" loading={updateMutation.isPending}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="mt-4 flex flex-col gap-4">
              <Input
                label="Current password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <Input
                label="New password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Input
                label="Confirm new password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <div className="flex justify-end">
                <Button type="submit" loading={passwordMutation.isPending}>
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
