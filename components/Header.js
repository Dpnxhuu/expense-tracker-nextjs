"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import useResendVerification from "@/hooks/useResendVerification";

export default function Header({ userData }) {
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const [state, setState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonLoad, setButtonLoad] = useState(false);
  const [status, setStatus] = useState(() => {
    if (typeof window === "undefined") return false;
    const sentAt = localStorage.getItem("sentAt");
    if (!sentAt) return false;
    const elapsed = Date.now() - parseInt(sentAt);
    return elapsed < 60000;
  });

  const { resendVerification } = useResendVerification();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        clearTimeout(timer.current);
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(timer.current);
    if (state) return;
    timer.current = setTimeout(() => setOpen(true), 400);
  };

  const handleMouseLeave = () => {
    clearTimeout(timer.current);
    if (state) return;
    timer.current = setTimeout(() => setOpen(false), 800);
  };

  const handleClick = () => {
    if (open) {
      setOpen(!open);
      setState(false);
      clearTimeout(timer.current);
    } else {
      setOpen(!open);
      setState(true);
      clearTimeout(timer.current);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        router.replace("/login");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      setButtonLoad(true);
      await resendVerification();
      setStatus(true);
      localStorage.setItem("sentAt", Date.now().toString());
      setTimeout(() => {
        setStatus(false);
        localStorage.removeItem("sentAt");
      }, 60000);
    } catch (error) {
      alert(error.message);
    } finally {
      setButtonLoad(false);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center dark-page app-gradient">
        <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );

  return (
    <header className="glass-panel rounded-2xl px-6 py-5 sm:px-8">
      <div className="flex gap-10 sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-lg font-bold text-accent ring-1 ring-accent/20">
            ₹
          </span>
          <div>
            <p className="section-label">Personal Finance</p>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Expense Tracker
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-border/60 bg-surface-elevated/50 px-3 py-2 sm:flex">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-muted">Synced</span>
          </div>
          <div
            ref={dropdownRef}
            className="relative cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              onClick={handleClick}
              className="uppercase flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent ring-1 ring-accent/25"
            >
              {userData?.email?.[0]}
            </div>
            {open && (
              <div className="absolute right-0 top-[calc(100%+8px)] bg-[#1a1d27] border border-white/10 rounded-xl py-2 w-52 z-999">
                <div className="px-4 pt-3 pb-3">
                  <p className="text-sm font-medium text-white">
                    {userData?.name}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5 truncate">
                    {userData?.email}
                  </p>
                  <div className="mt-2">
                    {userData?.is_verified ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full ring-1 ring-green-400/20">
                        ✓ Verified
                      </span>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        <span className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full ring-1 ring-red-400/20">
                          ✗ Not Verified
                        </span>
                        <button
                          onClick={resend}
                          disabled={status}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-accent/10 hover:bg-accent/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${status ? "text-green-400 bg-green-400/10" : "text-accent"}`}
                        >
                          {buttonLoad
                            ? "Sending..."
                            : status
                              ? "Success"
                              : "Resend Email →"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-px bg-white/8 mb-1" />

                <button
                  onClick={handleLogout}
                  className=" mx-1 px-4 py-2 flex items-center gap-2 rounded-md cursor-pointer hover:bg-white/6"
                >
                  <span className="text-sm text-white/75">Sign Out</span>
                </button>
              </div>
            )}
          </div>
          {/* <button
            type="button"
            className="btn-outline px-3 py-2 text-xs sm:text-sm"
          >
            Logout
          </button> */}
        </div>
      </div>
    </header>
  );
}
