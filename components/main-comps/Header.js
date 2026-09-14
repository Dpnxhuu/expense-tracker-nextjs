"use client";
import { useState, useRef } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function Header({ session }) {
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  const dropdownRef = useRef(null);
  const [state, setState] = useState(false);
  // const [loading, setLoading] = useState(false);

  const handleMouseEnter = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), 50);
  };

  const handleMouseLeave = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 150);
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

  // if (loading)
  //   return (
  //     <div className="fixed inset-0 z-50 flex items-center justify-center dark-page app-gradient">
  //       <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
  //     </div>
  //   );

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
              <Image
                src={session?.user?.image}
                alt="Profile Picture"
                width={80}
                height={80}
                className="rounded-full border border-[#2e2e2e]"
                unoptimized
                priority // FIX: LCP image ko turant load karega, lazy nahi
              />
            </div>
            {open && (
              <div className="absolute right-0 top-[calc(100%+8px)] bg-[#1a1d27] border border-white/10 rounded-xl py-2 w-52 z-999">
                <div className="px-4 pt-3 pb-3">
                  <p className="text-sm font-medium text-white">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5 truncate">
                    {session?.user?.email}
                  </p>
                  <div className="mt-2">
                    {session?.user?.emailVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full ring-1 ring-green-400/20">
                        ✓ Verified
                      </span>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        <span className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full ring-1 ring-red-400/20">
                          ✗ Not Verified
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-px bg-white/8 mb-1" />

                <button
                  onClick={() => signOut()}
                  className=" mx-1 px-4 py-2 flex items-center gap-2 rounded-md cursor-pointer hover:bg-white/6"
                >
                  <span className="text-sm text-white/75">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
