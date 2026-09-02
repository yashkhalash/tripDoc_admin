"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { authApi } from "@/lib/auth-api";
import { getApiErrorMessage } from "@/lib/api-client";

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await authApi.forgotPassword(email);
      showToast(result.message, "success");
      setSubmitted(true);
    } catch (err) {
      showToast(getApiErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <h2 className="text-lg font-semibold">Check your email</h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          If an account exists for {email}, a password reset link has been sent.
        </p>
        <Link href="/login" className="text-sm text-[var(--color-primary)] hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">Forgot password</h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="admin@tripdoc.app"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" loading={loading} className="w-full">
        Send reset link
      </Button>
      <Link href="/login" className="text-center text-sm text-[var(--color-primary)] hover:underline">
        Back to login
      </Link>
    </form>
  );
}
