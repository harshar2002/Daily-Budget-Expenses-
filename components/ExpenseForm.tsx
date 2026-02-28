"use client";

import { FormEvent, useMemo, useState } from "react";
import { CATEGORIES, Category, Expense } from "@/lib/types";

type ExpenseFormProps = {
  onAddExpense: (expense: Expense) => void;
  onClose: () => void;
};

const today = new Date().toISOString().split("T")[0];

export default function ExpenseForm({ onAddExpense, onClose }: ExpenseFormProps) {
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState<Category>("Food");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const amountValid = useMemo(() => Number(amount) > 0, [amount]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!amountValid) return;

    onAddExpense({
      id: crypto.randomUUID(),
      date,
      category,
      amount: Number(amount),
      description: description.trim() || "No details",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="card w-full max-w-lg animate-fadeIn">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Expense</h2>
          <button className="btn-secondary" onClick={onClose} type="button">
            Close
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Date</span>
            <input
              className="w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700"
              max={today}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              value={date}
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium">Category</span>
            <select
              className="w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700"
              onChange={(e) => setCategory(e.target.value as Category)}
              value={category}
            >
              {CATEGORIES.map((item) => (
                <option className="text-slate-900" key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium">Amount</span>
            <input
              className="w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700"
              min="0"
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              type="number"
              value={amount}
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium">Description</span>
            <textarea
              className="w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this expense for?"
              rows={3}
              value={description}
            />
          </label>

          <button className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50" disabled={!amountValid} type="submit">
            Save Expense
          </button>
        </form>
      </div>
    </div>
  );
}
