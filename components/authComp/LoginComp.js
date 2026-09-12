"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import AuthShell from "../auth/AuthShell";
import { GoogleAuthButton } from "../auth/GoogleAuthButton";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect } from "react";

function LoginComp() {
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("code");

  const [error, setError] = useState(() =>
    errorCode ? decodeURIComponent(errorCode) : "",
  );

  useEffect(() => {
    if (error) {
      toast.error(error); // FIX: clean, non-blocking notification
    }
    if (searchParams.get("expired") === "1") {
      toast.error("Session expired, please login again.");
    }
  }, [error, searchParams]);

  const handleLoginUser = async (e) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      toast.error("Enter a valid email");
      return;
    }

    if (!credentials.email || !credentials.password) {
      toast.error("Please fill all the fields");
      return;
    }

    setError("");
    setLoading(true);
    await signIn("credentials", { ...credentials, callbackUrl: "/home" });
    setLoading(false);
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Expense Tracker account"
    >
      <div className="glass-panel rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleLoginUser} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="input-base"
              autoComplete="email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs auth-link">
                Forgot Password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="input-base"
              autoComplete="current-password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="btn-primary mt-2 w-full py-3 shadow-glow"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="auth-divider my-6">or</div>

        <GoogleAuthButton label={"Sign in with google"} />

        <p className="mt-8 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="auth-link">
            Sign Up
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

function Loading() {
  return (
    <div className="dark-page app-gradient relative min-h-full flex-1 overflow-hidden flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 p-2 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        {/* <p className="text-sm text-muted">Loading your expenses...</p> */}
      </div>
    </div>
  );
}

export default function LoginCompPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginComp />
    </Suspense>
  );
}
