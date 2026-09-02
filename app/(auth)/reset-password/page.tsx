"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/components/ui/toast";
import { authApi } from "@/lib/auth-api";
import { getApiErrorMessage } from "@/lib/api-client";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const token = searchParams.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (!token) {
      showToast("Missing or invalid reset token", "error");
      return;
    }
    setLoading(true);
    try {
      const result = await authApi.resetPassword(token, newPassword);
      showToast(result.message, "success");
      router.push("/login");
    } catch (err) {
      showToast(getApiErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">Reset password</h2>
        <p className="text-sm text-[var(--color-text-muted)]">Choose a new password for your account.</p>
      </div>
      {!token && (
        <p className="text-xs text-[var(--color-danger)]">
          No reset token found in the URL. Use the link from your email.
        </p>
      )}
      <PasswordInput
        label="New password"
        name="newPassword"
        placeholder="••••••••"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <PasswordInput
        label="Confirm password"
        name="confirmPassword"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <Button type="submit" loading={loading} className="w-full">
        Reset password
      </Button>
      <Link href="/login" className="text-center text-sm text-[var(--color-primary)] hover:underline">
        Back to login
      </Link>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
