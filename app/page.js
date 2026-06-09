import Link from "next/link";
import LandingNavbar from "@/components/landing/Navbar";
import LandingFooter from "@/components/landing/Footer";

const FEATURES = [
  {
    icon: "📊",
    title: "Track Every Expense",
    description:
      "Log daily spending with amount, category, and date — all in one place.",
  },
  {
    icon: "🏷️",
    title: "Category Breakdown",
    description:
      "See where your money goes with visual stats grouped by Food, Travel, and more.",
  },
  {
    icon: "✏️",
    title: "Edit & Manage",
    description:
      "Update or remove entries anytime. Your expense list stays clean and up to date.",
  },
  {
    icon: "📱",
    title: "Works Everywhere",
    description:
      "Responsive design that looks great on mobile, tablet, and desktop.",
  },
];

const STATS = [
  { value: "10K+", label: "Expenses tracked" },
  { value: "5", label: "Categories" },
  { value: "100%", label: "Free to use" },
];

export default function LandingPage() {
  return (
    <div className="dark-page app-gradient relative flex min-h-full flex-1 flex-col overflow-hidden">
      {/* Background glow */}
      <div className="glow-orb glow-orb-accent -left-32 top-20 h-96 w-96" />
      <div className="glow-orb glow-orb-purple -right-32 top-1/3 h-80 w-80" />
      <div className="glow-orb glow-orb-emerald bottom-0 left-1/3 h-72 w-72" />

      <div className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <LandingNavbar />

        {/* Hero */}
        <section className="flex flex-col items-center py-16 text-center sm:py-20 lg:py-28">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent ring-1 ring-accent/25">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Simple · Smart · Free
          </span>

          <h1 className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-gradient">Track Your Expenses</span>
            <br />
            <span className="text-muted/80">Effortlessly</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Take control of your finances. Record spending, categorize transactions,
            and understand your habits — so you can save smarter and spend wiser.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="btn-primary px-8 py-3.5 text-base shadow-glow"
            >
              Get Started →
            </Link>
            <Link href="/login" className="btn-outline px-8 py-3.5 text-base">
              I already have an account
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid w-full max-w-lg grid-cols-3 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="glass-panel rounded-xl px-3 py-4 text-center"
              >
                <p className="text-xl font-bold text-accent sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Preview mockup */}
        <section className="pb-16">
          <div className="glass-panel card-hover mx-auto max-w-3xl overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-border/40 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
              <span className="h-3 w-3 rounded-full bg-green-400/80" />
              <span className="ml-2 text-xs text-muted">expense-tracker.app/home</span>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
              <div className="rounded-xl bg-surface-elevated/60 p-4 sm:col-span-1">
                <p className="text-xs text-muted">Total Expenses</p>
                <p className="mt-1 text-2xl font-bold text-accent">₹1,700</p>
              </div>
              <div className="rounded-xl bg-surface-elevated/60 p-4 sm:col-span-2">
                <p className="mb-2 text-xs text-muted">Recent</p>
                <div className="space-y-2">
                  {[
                    ["Lunch", "Food", "₹500"],
                    ["Flight ticket", "Travel", "₹1,000"],
                    ["Movie", "Entertainment", "₹200"],
                  ].map(([desc, cat, amt]) => (
                    <div
                      key={desc}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{desc}</span>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs text-accent">
                          {cat}
                        </span>
                        <span className="font-semibold text-accent">{amt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="pb-20">
          <div className="mb-12 text-center">
            <p className="section-label mb-2">Features</p>
            <h2 className="text-2xl font-bold sm:text-3xl">Why Expense Tracker?</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Everything you need to manage personal spending, nothing you don&apos;t.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="glass-panel card-hover group rounded-2xl p-6"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-2xl ring-1 ring-accent/20 transition group-hover:bg-accent/20">
                  {feature.icon}
                </span>
                <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20">
          <div className="glass-panel relative overflow-hidden rounded-2xl px-6 py-12 text-center sm:px-12">
            <div className="glow-orb glow-orb-accent absolute -right-20 -top-20 h-60 w-60 opacity-60" />
            <div className="relative">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Ready to take control?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-muted">
                Start tracking your expenses today. It&apos;s free and takes less than
                a minute to set up.
              </p>
              <Link
                href="/signup"
                className="btn-primary mt-8 inline-flex px-8 py-3.5 text-base shadow-glow"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </section>
      </div>

      <LandingFooter />
    </div>
  );
}
