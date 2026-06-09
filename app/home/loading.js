"use client"
export default function Loading() {
  return (
    <div className="dark-page app-gradient relative min-h-full flex-1 overflow-hidden flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 p-2 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        {/* <p className="text-sm text-muted">Loading your expenses...</p> */}
      </div>
    </div>
  )
}