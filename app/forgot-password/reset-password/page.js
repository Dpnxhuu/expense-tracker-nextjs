"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";

const resetSchema = z
  .object({
    pass: z.string().min(8, "Password must be 8+ chars"),
    confirmPass: z.string(),
  })
  .refine((data) => data.pass === data.confirmPass, {
    message: "Passwords don't match",
    path: ["confirmPass"],
  });

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPass = async () => {
    if (!token) {
      alert("Invalid or missing reset token");
      return;
    }

    const result = resetSchema.safeParse({ pass, confirmPass });

    if (!result.success) {
      alert(result.error.issues[0]?.message);
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/forgot-password/reset", {
        token,
        pass: result.data.pass,
      });
      router.push("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <section className="glass-panel mx-auto w-full max-w-md rounded-2xl p-6 sm:p-8">
        <div className="mb-6 border-b border-border/40 pb-5">
          <p className="section-label mb-1">Reset Password</p>
          <h2 className="text-lg font-semibold">Reset your password</h2>
          <p className="mt-1 text-sm text-muted">
            Enter your new password below
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input-base"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input-base"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
          </div>
          <button
            onClick={handleResetPass}
            disabled={loading}
            type="button"
            className="btn-primary w-full py-3 shadow-glow"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </section>
    </div>
  );
}