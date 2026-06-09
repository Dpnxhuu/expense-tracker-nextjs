"use client";
import { CATEGORIES } from "@/lib/constants";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addExpense, updateExpense } from "@/app/actions/expenses";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useExpense } from "@/context/ExpenseContext";

export default function AddExpenseForm() {
  const { editData, setEditData } = useExpense();
  const amountRef = useRef("");
  const categoryRef = useRef("");
  const desRef = useRef("");

  const [date, setDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const [error, setError] = useState({
    amount: "idle",
    category: "idle",
    description: "idle",
    date: "idle",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (editData) {
      amountRef.current.value = editData.amount;
      categoryRef.current.value = editData.category;
      desRef.current.value = editData.description;
      setDate(new Date(editData.date));
      window.scrollTo({ top: 120, behavior: "smooth" });
    } else {
      amountRef.current.value = "";
      categoryRef.current.value = "";
      desRef.current.value = "";
      setDate(null);
    }
  }, [editData]);

  const handleExpense = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (!amountRef.current.value || amountRef.current.value < 0) {
      setError((prev) => ({ ...prev, amount: "error" }));
      hasError = true;
    } else {
      setError((prev) => ({ ...prev, amount: "valid" }));
    }

    if (!categoryRef.current.value) {
      setError((prev) => ({ ...prev, category: "error" }));
      hasError = true;
    } else {
      setError((prev) => ({ ...prev, category: "valid" }));
    }

    if (!desRef.current.value) {
      setError((prev) => ({ ...prev, description: "error" }));
      hasError = true;
    } else {
      setError((prev) => ({ ...prev, description: "valid" }));
    }

    if (!date) {
      setError((prev) => ({ ...prev, date: "error" }));
      hasError = true;
    } else {
      setError((prev) => ({ ...prev, date: "valid" }));
    }

    if (hasError) return;

    setLoading(true);
    try {
      if (editData) {
        await updateExpense({
          id: editData.id,
          amount: amountRef.current.value,
          category: categoryRef.current.value,
          description:
            desRef.current.value.charAt(0).toUpperCase() +
            desRef.current.value.slice(1),
          date: date.toISOString().split("T")[0],
        });
      } else {
        await addExpense({
          amount: amountRef.current.value,
          category: categoryRef.current.value,
          description:
            desRef.current.value.charAt(0).toUpperCase() +
            desRef.current.value.slice(1),
          date: date.toISOString().split("T")[0],
        });
      }

      // Reset
      setEditData(null);
      amountRef.current.value = "";
      categoryRef.current.value = "";
      desRef.current.value = "";
      setDate(null);

      setError({
        amount: "idle",
        category: "idle",
        description: "idle",
        date: "idle",
      });

      router.refresh();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (field) =>
    `input-base${error[field] === "error" ? " input-error" : ""}${
      error[field] === "valid" ? " input-valid" : ""
    }`;

  return (
    <section className="glass-panel h-full rounded-2xl p-6 sm:p-8">
      <div className="relative mb-6 border-b border-border/40 pb-5">
        <p className="section-label mb-1">New Entry</p>
        <h2 className="text-lg font-semibold">
          {editData ? "Edit Expense" : "Add Expense"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Record a new expense with amount, category, and date.
        </p>
      </div>

      <form onSubmit={handleExpense} className="grid gap-5 sm:grid-cols-2">
        {/* Amount */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="amount" className="text-sm font-medium">
            Amount <span className="text-red-400">*</span>
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            ref={amountRef}
            className={fieldClass("amount")}
          />
          {error.amount === "error" && (
            <p className="field-error">Enter a valid amount</p>
          )}
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-sm font-medium">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            id="category"
            name="category"
            className={fieldClass("category")}
            ref={categoryRef}
            defaultValue=""
          >
            <option value="" disabled>
              Select category
            </option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {error.category === "error" && (
            <p className="field-error">Please select a category</p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description <span className="text-red-400">*</span>
          </label>
          <input
            id="description"
            name="description"
            ref={desRef}
            type="text"
            placeholder="What was this expense for?"
            className={`${fieldClass("description")} capitalize`}
          />
          {error.description === "error" && (
            <p className="field-error">Description is required</p>
          )}
        </div>

        {/* Date */}
        <div className="relative flex flex-col gap-1.5">
          <label className="text-sm font-medium">
            Date <span className="text-red-400">*</span>
          </label>

          <button
            type="button"
            onClick={() => setShowCalendar((prev) => !prev)}
            className={fieldClass("date") + " text-left px-3 py-2"}
          >
            {date
              ? date.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Select a date"}
          </button>

          {error.date === "error" && (
            <p className="field-error">Date is required</p>
          )}

          {showCalendar && (
            <div className="absolute bottom-full left-0 z-[999] mt-1 rounded-xl border border-border/40 bg-surface p-3 shadow-lg">
              <DayPicker
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  setShowCalendar(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4 items-center sm:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-sm px-3 w-full py-3 shadow-glow sm:w-auto sm:px-6"
          >
            {loading
              ? editData
                ? "Updating"
                : "Adding"
              : editData
                ? "Update Expense"
                : "Add expense"}
          </button>
          {editData && (
            <button
              onClick={() => setEditData(null)}
              className="btn-outline w-full py-3 sm:w-auto sm:px-6"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
