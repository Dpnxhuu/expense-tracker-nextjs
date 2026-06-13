"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export function VerifyPage({ success, error }) {
  if (success)
    return (
      <div className="relative dark-page app-gradient min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="glow-orb glow-orb-accent -left-32 top-0 h-80 w-80 opacity-60" />
        <div className="glow-orb glow-orb-purple -right-32 top-1/2 h-72 w-72 opacity-50" />
        <div className="glass-panel relative rounded-2xl p-8 max-w-md w-full text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20 mx-auto mb-5">
            <span className="text-2xl">✅</span>
          </div>
          <p className="section-label mb-2">All Done</p>
          <h2 className="text-lg font-semibold mb-2">Email Verified</h2>
          <p className="text-sm text-muted mb-6">
            Your account has been successfully verified.
          </p>
          <h3 className="text-lg font-semibold mb-2">
            Redirecting you to home page...
          </h3>
        </div>
      </div>
    );

  return (
    <div className="relative dark-page app-gradient min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="glow-orb glow-orb-accent -left-32 top-0 h-80 w-80 opacity-60" />
      <div className="glow-orb glow-orb-purple -right-32 top-1/2 h-72 w-72 opacity-50" />
      <div className="glass-panel relative rounded-2xl p-8 max-w-md w-full text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20 mx-auto mb-5">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="section-label mb-2">Verification Failed</p>
        <h2 className="text-lg font-semibold mb-2">Invalid or Expired Link</h2>
        <p className="text-sm text-muted mb-6">
          {error ||
            "This verification link is invalid or has expired. Please request a new one."}
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/signup" className="btn-primary px-5 py-2.5 text-sm">
            Sign Up Again
          </Link>
          <Link href="/login" className="btn-outline px-5 py-2.5 text-sm">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Verify() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState("invalid");
  const [loading, setLoading] = useState(true)

    const token = searchParams.get("token");
    if (!token) {
      setLoading(false)
      return;
    }

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/auth/email-verification?token=${token}`);
        const data = await res.json(); // ✅ await fix

        if (res.ok) {
          setState("success");
          setTimeout(() => {
            router.replace("/home"); // ✅ redirect fix
          }, 3000);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        setState("failed");
      }finally{
        setLoading(false)
      }
    })();
  }, []);

  if(loading) return <LoadingSpinner/>

  if(state === "success") return <VerifyPage success={true} error={false}/>
  if(state === "failed") return <VerifyPage success={false} error={true}/>

  return (
    <div className="relative dark-page app-gradient min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="glow-orb glow-orb-accent -left-32 top-0 h-80 w-80 opacity-60" />
      <div className="glow-orb glow-orb-purple -right-32 top-1/2 h-72 w-72 opacity-50" />
      <div className="glass-panel relative rounded-2xl p-8 max-w-md w-full text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20 mx-auto mb-5">
          <span className="text-2xl">🚫</span>
        </div>
        <p className="section-label mb-2">Access Denied</p>
        <h2 className="text-lg font-semibold mb-2">
          Invalid Verification Link
        </h2>
        <p className="text-sm text-muted mb-6">
          No verification token found. Please use the link sent to your email.
        </p>
        <Link href="/signup" className="btn-primary px-6 py-2.5 text-sm">
          Back to Sign Up
        </Link>
      </div>
    </div>
  );
}