import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="relative mt-auto border-t border-border/30 bg-surface/20 py-10 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 text-sm font-bold text-accent">
            ₹
          </span>
          <div>
            <p className="text-sm font-semibold">Expense Tracker</p>
            <p className="text-xs text-muted">Manage money smarter</p>
          </div>
        </div>
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} Expense Tracker. All rights reserved.
        </p>
        <div className="flex gap-5 text-sm">
          <Link href="/login" className="text-muted transition hover:text-accent">
            Login
          </Link>
          <Link href="/signup" className="text-muted transition hover:text-accent">
            Sign Up
          </Link>
          <Link href="/home" className="text-muted transition hover:text-accent">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
