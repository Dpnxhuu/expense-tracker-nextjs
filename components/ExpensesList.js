"use client"
import { deleteExpense } from "@/app/actions/expenses";
import { useExpense } from "@/context/ExpenseContext";
import { CATEGORY_COLORS } from "@/lib/constants";
import { useRouter } from "next/navigation";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ExpensesList({ expenses }) {

  const {setEditData} = useExpense();
    
  const router = useRouter();

  const handleExpenseDelete = async (id) => {
  const confirmation = confirm(
    "Are you sure you want to delete this expense??",
  );

  if (!confirmation) return;

  try {
    const res = await deleteExpense(id);
    router.refresh();
  } catch (error) {
    alert(error.message);
  }
};

return (
    <>
    {expenses.length > 0 && (
      <section className="glass-panel rounded-2xl p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Expenses List</h2>
          <p className="mt-1 text-sm text-muted">
            View, edit, or remove your recorded expenses.
          </p>
        </div>
        <span className="mt-2 inline-flex w-fit rounded-full bg-surface-elevated/80 px-3 py-1 text-xs font-medium text-muted ring-1 ring-border sm:mt-0">
          {expenses.length} entries
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-border/40 md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-surface-elevated/30 text-xs uppercase tracking-wider text-muted">
              <th className="px-4 py-3 font-semibold">Amount</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Description</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {expenses.map((expense) => (
              <tr key={expense.id} className="table-row-hover">
                <td className="px-4 py-4 font-semibold text-accent">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${CATEGORY_COLORS[expense.category]}`}
                  >
                    {expense.category}
                  </span>
                </td>
                <td className="px-4 py-4 text-muted">{expense.description}</td>
                <td className="px-4 py-4 whitespace-nowrap text-muted">
                  {formatDate(expense.date)}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="inline-flex gap-2">
                    <button onClick={()=> setEditData(expense)} type="button" className="btn-ghost">
                      Edit
                    </button>
                    <button
                      onClick={() => handleExpenseDelete(expense.id)}
                      type="button"
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-4 md:hidden">
        {expenses.map((expense) => (
          <article key={expense.id} className="stat-card card-hover">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-accent">
                  {formatCurrency(expense.amount)}
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  {expense.description}
                </p>
              </div>
              <span
                className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${CATEGORY_COLORS[expense.category]}`}
              >
                {expense.category}
              </span>
            </div>
            <p className="mb-4 text-xs text-muted">
              {formatDate(expense.date)}
            </p>
            <div className="flex gap-2">
              <button type="button" className="btn-ghost flex-1 py-2">
                Edit
              </button>
              <button type="button" className="btn-danger flex-1 py-2">
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Empty state — visible when no data (hidden for now with sample data) */}
      {/* Uncomment when INITIAL_EXPENSES is empty:
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-16 text-center">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-2xl ring-1 ring-accent/20">📋</span>
        <p className="text-base font-medium">No expenses yet</p>
        <p className="mt-1 max-w-sm text-sm text-muted">Add your first expense using the form above.</p>
      </div>
      */}
    </section>
    )}
    </>
  );
}
