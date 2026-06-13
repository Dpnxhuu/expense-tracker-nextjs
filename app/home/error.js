"use client"
import { useRouter } from "next/navigation"

export default function Error({ error, reset }) {
  const router = useRouter()

  return (
    <div className="dark-page app-gradient min-h-screen flex items-center justify-center px-4">
      <div className="glass-panel rounded-2xl p-8 max-w-md w-full text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20 mx-auto mb-5">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="section-label mb-2">Something went wrong</p>
        <h2 className="text-lg font-semibold mb-2">Unable to load expenses</h2>
        <p className="text-sm text-muted mb-6 break-all">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => window.location.reload()} className="btn-primary px-5 py-2.5 text-sm">
            Try Again
          </button>
          {/* <button onClick={() => router.push("/login")} className="btn-outline px-5 py-2.5 text-sm">
            Go to Login
          </button> */}
        </div>
      </div>
    </div>
  )
}