import Link from "next/link";
import AuthShell from "../auth/AuthShell";
import { GoogleAuthButton } from "../auth/GoogleAuthButton";

export default function SignupComp() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Choose how you'd like to sign up"
    >
      <div className="glass-panel rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col gap-4">
          <Link
            href="/signup/email"
            className="group flex w-full items-center gap-4 rounded-xl border border-border/60 bg-surface-elevated/40 p-4 transition hover:border-accent/40 hover:bg-surface-elevated/70"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-xl ring-1 ring-accent/20 transition group-hover:bg-accent/25">
              ✉️
            </span>
            <div className="text-left">
              <p className="font-semibold">Sign Up with Email</p>
              <p className="text-xs text-muted">Create account using your email</p>
            </div>
            <span className="ml-auto text-muted transition group-hover:text-accent">
              →
            </span>
          </Link>

          <div className="auth-divider">or</div>
          <GoogleAuthButton label={"Sign up with google"}/>
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="auth-link">
            Log In
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
