import Link from "next/link";

export default function LandingNavbar() {
  return (
    <nav className="glass-panel sticky top-4 z-50 rounded-2xl px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20 text-lg font-bold text-accent ring-1 ring-accent/20 transition group-hover:bg-accent/30 group-hover:ring-accent/40">
            ₹
          </span>
          <span className="text-lg font-bold tracking-tight">Expense Tracker</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" className="btn-outline px-4 py-2 text-sm">
            Login
          </Link>
          <Link href="/signup" className="btn-primary px-4 py-2 text-sm shadow-glow">
            Signup
          </Link>
        </div>
      </div>
    </nav>
  );
}
