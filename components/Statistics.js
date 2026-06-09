import { CATEGORY_COLORS } from "@/lib/constants";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Statistics({expenses}) {

  const grandTotal = expenses?.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const categoryMap = expenses.reduce((acc, curr) => {
  const cat = curr.category;
  if (!acc[cat]) {
    acc[cat] = { total: 0, count: 0, id: curr.id };
  }
  acc[cat].total += Number(curr.amount);
  acc[cat].count += 1;
  return acc;
}, {});

// Object to array — map karne ke liye
const categoryData = Object.entries(categoryMap).map(([category, values]) => ({
  category,
  total: values.total,
  count: values.count,
  id: values.id
}));

// console.log(categoryData)

  return (
    <section className="glass-panel h-full rounded-2xl p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-5">
          <p className="text-sm font-medium text-muted">Total Expenses</p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-accent sm:text-5xl">
            {formatCurrency(
              expenses.reduce((acc, curr) => acc + Number(curr.amount), 0),
            )}
          </p>
          <p className="mt-2 flex items-center gap-3 text-xs text-muted">
            <span className="inline-flex h-1 w-1.5 rounded-full bg-accent" />
            {`${expenses.length} transactions recorded`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="filter-pill filter-pill-active">
            All
          </button>
          {categoryData.map(({category, id}) => (
            <button
              key={id}
              type="button"
              className={`filter-pill transition hover:border-accent/40 ${CATEGORY_COLORS[category]}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="section-label">Category Breakdown</h3>
          <span className="text-xs text-muted">This month</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {categoryData.map(({category, total, count, id}) => (
            <div key={id} className="stat-card card-hover">
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${CATEGORY_COLORS[category]}`}
                >
                  {category}
                </span>
                <span className="rounded-md bg-surface-elevated/80 px-2 py-0.5 text-xs font-medium text-muted">
                  {((total / grandTotal) * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xl font-bold">{formatCurrency(total)}</p>
              <p className="mt-0.5 text-xs text-muted">
                {count} transaction{count !== 1 ? "s" : ""}
              </p>
              <div className="progress-bar mt-3">
                <div
                  className="progress-fill"
                  style={{ width: `${((total / grandTotal) * 100).toFixed(0)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
