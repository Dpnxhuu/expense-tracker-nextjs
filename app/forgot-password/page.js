"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { z } from "zod";

const emailSchema = z.string().email("Invalid email");

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleForgotPass = async () => {
    const result = emailSchema.safeParse(email);

    if (!result.success) {
      alert(result.error.issues[0]?.message);
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/forgot-password", { email: result.data });
      setSent(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
      <section className="glass-panel mx-auto w-full max-w-md rounded-2xl p-6 sm:p-8">
        <div className="mb-6 border-b border-border/40 pb-5">
          <h2 className="text-lg font-semibold">Check your email!</h2>
          <p className="mt-1 text-sm text-muted">
            Reset link sent to {email}
          </p>
        </div>
        <Link
          href="/login"
          className="text-sm font-medium text-accent transition-colors hover:opacity-80"
        >
          Back to login
        </Link>
      </section>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
    <section className="glass-panel mx-auto w-full max-w-md rounded-2xl p-6 sm:p-8">
      <div className="mb-6 border-b border-border/40 pb-5">
        <p className="section-label mb-1">Reset Password</p>
        <h2 className="text-lg font-semibold">Forgot the password</h2>
        <p className="mt-1 text-sm text-muted">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <div
        className="space-y-5"
        role="form"
        aria-label="Forgot password form"
      >
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="input-base"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          onClick={handleForgotPass}
          disabled={loading}
          type="button"
          className="btn-primary w-full py-3 shadow-glow"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </div>

      <div className="mt-6 text-center text-sm text-muted">
        Remember your password?{" "}
        <Link href="/login" className="font-medium text-accent hover:opacity-80">
          Login
        </Link>
        <br />
        <span className="mt-2 inline-block">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-accent hover:opacity-80"
          >
            Sign up
          </Link>
        </span>
      </div>
    </section>
    </div>
  );
}