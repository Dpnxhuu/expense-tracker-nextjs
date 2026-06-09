import Link from "next/link";
import AuthNavbar from "@/components/auth/AuthNavbar";

export default function AuthShell({ children, title, subtitle }) {
  return (
    <div className="dark-page app-gradient relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div className="glow-orb glow-orb-accent -left-24 top-10 h-72 w-72" />
      <div className="glow-orb glow-orb-purple -right-24 bottom-20 h-64 w-64" />

      <AuthNavbar />

      <main className="relative flex flex-1 items-center justify-center px-4 pb-12 sm:px-6">
        <div className="w-full max-w-md">
          {(title || subtitle) && (
            <div className="mb-8 text-center">
              {title && (
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </div>
      </main>

      <p className="relative pb-6 text-center text-xs text-muted">
        <Link href="/" className="auth-link">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
