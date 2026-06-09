import Link from "next/link";

export default function AuthNavbar() {
  return (
    <nav className="px-4 py-5 sm:px-6">
      <div className="mx-auto flex max-w-md items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20 text-lg font-bold text-accent">
            ₹
          </span>
          <span className="text-lg font-bold tracking-tight">Expense Tracker</span>
        </Link>
      </div>
    </nav>
  );
}
