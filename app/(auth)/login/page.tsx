"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { OtpInput } from "@/components/ui/otp-input";
import { useToast } from "@/components/ui/toast";
import { authApi } from "@/lib/auth-api";
import { getApiErrorMessage } from "@/lib/api-client";
import { tokenStore } from "@/lib/api-client";

type Step = "credentials" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [adminId, setAdminId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await authApi.login(email, password);
      setAdminId(result.adminId);
      setStep("otp");
      showToast(result.message, "success");
    } catch (err) {
      showToast(getApiErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!adminId) return;
    setLoading(true);
    try {
      const result = await authApi.verifyOtp(adminId, otp);
      tokenStore.setTokens(result.accessToken, result.refreshToken);
      showToast("Logged in successfully", "success");
      router.push("/dashboard");
    } catch (err) {
      showToast(getApiErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }

  if (step === "otp") {
    return (
      <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold">Enter OTP</h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            We sent a one-time code to your registered email.
          </p>
        </div>
        <OtpInput length={4} value={otp} onChange={setOtp} />
        <p className="-mt-2 text-xs text-[var(--color-text-muted)]">Test OTP: 1111</p>
        <Button type="submit" loading={loading} className="w-full" disabled={otp.length < 4}>
          Verify &amp; Sign in
        </Button>
        <button
          type="button"
          onClick={() => setStep("credentials")}
          className="text-sm text-[var(--color-primary)] hover:underline"
        >
          Back to login
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">Sign in</h2>
        <p className="text-sm text-[var(--color-text-muted)]">Access the TripDoc admin console.</p>
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
      <PasswordInput
        label="Password"
        name="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-sm text-[var(--color-primary)] hover:underline">
          Forgot password?
        </Link>
      </div>
      <Button type="submit" loading={loading} className="w-full">
        Continue
      </Button>
    </form>
  );
}
