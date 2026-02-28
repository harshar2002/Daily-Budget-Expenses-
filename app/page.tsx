"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Charts from "@/components/Charts";
import DashboardCards from "@/components/DashboardCards";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { CATEGORIES, Expense } from "@/lib/types";
import { downloadCSV, formatCurrency, getMonthKey, isInMonth } from "@/lib/utils";

const DEFAULT_MONTHLY_BUDGET = 3000;
const now = new Date();
const nowMonth = now.toISOString().slice(0, 7);

function createDemoExpenses(month: string): Expense[] {
  const [year, monthRaw] = month.split("-");
  const y = Number(year);
  const m = Number(monthRaw);

  return [
    { id: crypto.randomUUID(), date: `${month}-02`, category: "Food", amount: 36.9, description: "Lunch" },
    { id: crypto.randomUUID(), date: `${month}-04`, category: "Transport", amount: 12.5, description: "Cab fare" },
    { id: crypto.randomUUID(), date: `${month}-05`, category: "Shopping", amount: 124, description: "House items" },
    { id: crypto.randomUUID(), date: `${month}-08`, category: "Recharge", amount: 24.99, description: "Mobile recharge" },
    { id: crypto.randomUUID(), date: `${month}-10`, category: "Personal", amount: 42, description: "Gym" },
    { id: crypto.randomUUID(), date: `${month}-11`, category: "Emergency", amount: 180, description: "Medicine" },
    {
      id: crypto.randomUUID(),
      date: `${new Date(y, m - 2, 12).toISOString().slice(0, 10)}`,
      category: "Food",
      amount: 92,
      description: "Previous month groceries",
    },
  ];
}

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(nowMonth);

  const { value: darkMode, setValue: setDarkMode, hydrated: modeReady } = useLocalStorage<boolean>("expense-theme", false);
  const { value: expenses, setValue: setExpenses, hydrated } = useLocalStorage<Expense[]>("expenses", []);
  const { value: monthlyBudget, setValue: setMonthlyBudget } = useLocalStorage<number>("monthly-budget", DEFAULT_MONTHLY_BUDGET);

  useEffect(() => {
    if (!modeReady) return;
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode, modeReady]);

  const filteredExpenses = useMemo(
    () => expenses.filter((expense) => isInMonth(expense, selectedMonth)).sort((a, b) => b.date.localeCompare(a.date)),
    [expenses, selectedMonth],
  );

  const monthlyExpense = useMemo(() => filteredExpenses.reduce((sum, item) => sum + item.amount, 0), [filteredExpenses]);
  const remainingBudget = monthlyBudget - monthlyExpense;

  const isCurrentMonth = selectedMonth === nowMonth;
  const daysInMonth = new Date(Number(selectedMonth.slice(0, 4)), Number(selectedMonth.slice(5, 7)), 0).getDate();
  const dayDivisor = isCurrentMonth ? Math.max(1, now.getDate()) : daysInMonth;
  const dailyAverage = monthlyExpense / dayDivisor;

  const budgetUsageRaw = monthlyBudget ? (monthlyExpense / monthlyBudget) * 100 : 0;
  const budgetUsage = Number.isFinite(budgetUsageRaw) ? budgetUsageRaw : 0;

  const categoryTotals = useMemo(() => {
    const map = new Map<string, number>();
    filteredExpenses.forEach((item) => {
      map.set(item.category, (map.get(item.category) ?? 0) + item.amount);
    });
    return map;
  }, [filteredExpenses]);

  const overspendingCategories = useMemo(() => {
    const budgetPerCategory = monthlyBudget / CATEGORIES.length;
    const over = new Set<string>();
    categoryTotals.forEach((value, key) => {
      if (value > budgetPerCategory) over.add(key);
    });
    return over;
  }, [categoryTotals, monthlyBudget]);

  const categoryData = useMemo(
    () =>
      CATEGORIES.map((name) => ({
        name,
        value: categoryTotals.get(name) ?? 0,
        over: overspendingCategories.has(name),
      })).filter((item) => item.value > 0),
    [categoryTotals, overspendingCategories],
  );

  const monthlyData = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach((expense) => {
      const month = getMonthKey(expense.date);
      map.set(month, (map.get(month) ?? 0) + expense.amount);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const addExpense = useCallback((expense: Expense) => setExpenses((prev) => [expense, ...prev]), [setExpenses]);
  const deleteExpense = useCallback((id: string) => setExpenses((prev) => prev.filter((item) => item.id !== id)), [setExpenses]);

  const clearAll = useCallback(() => {
    if (window.confirm("Clear all expenses and reset budget?")) {
      setExpenses([]);
      setMonthlyBudget(DEFAULT_MONTHLY_BUDGET);
    }
  }, [setExpenses, setMonthlyBudget]);

  const resetSelectedMonth = useCallback(() => {
    if (window.confirm(`Delete all expenses for ${selectedMonth}?`)) {
      setExpenses((prev) => prev.filter((item) => !isInMonth(item, selectedMonth)));
    }
  }, [selectedMonth, setExpenses]);

  const loadDemo = useCallback(() => {
    if (expenses.length && !window.confirm("This will replace current data with demo data. Continue?")) return;
    setExpenses(createDemoExpenses(selectedMonth));
    setMonthlyBudget(DEFAULT_MONTHLY_BUDGET);
  }, [expenses.length, selectedMonth, setExpenses, setMonthlyBudget]);

  if (!hydrated) {
    return <main className="mx-auto max-w-7xl p-4">Loading...</main>;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
      <header className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Personal Expense Tracker</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Monitor your budget and spending trends in one place.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" onClick={() => setDarkMode(!darkMode)} type="button">
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button className="btn-secondary" onClick={loadDemo} type="button">
            Demo Data
          </button>
          <button className="btn-primary" onClick={() => setShowForm(true)} type="button">
            + Add Expense
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
        <div className="card flex flex-wrap items-end gap-3">
          <label className="space-y-1">
            <span className="text-sm font-medium">Monthly Budget</span>
            <input
              className="block rounded-xl border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700"
              min={0}
              onChange={(e) => setMonthlyBudget(Number(e.target.value) || 0)}
              type="number"
              value={monthlyBudget}
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Filter Month</span>
            <input
              className="block rounded-xl border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700"
              onChange={(e) => setSelectedMonth(e.target.value)}
              type="month"
              value={selectedMonth}
            />
          </label>

          <button className="btn-secondary" onClick={() => downloadCSV(filteredExpenses)} type="button">
            Export CSV
          </button>
          <button className="btn-secondary" onClick={resetSelectedMonth} type="button">
            Reset Month Data
          </button>
          <button
            className="rounded-xl border border-rose-300 px-4 py-2 font-medium text-rose-500 transition hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/30"
            onClick={clearAll}
            type="button"
          >
            Clear All Data
          </button>
        </div>

        <div className={`card flex items-center justify-center text-sm font-semibold ${remainingBudget < 0 ? "text-rose-500" : "text-emerald-500"}`}>
          {remainingBudget < 0 ? `Budget exceeded by ${formatCurrency(Math.abs(remainingBudget))}` : "Budget in control"}
        </div>
      </section>

      <section className="card">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">Budget utilization</span>
          <span className={budgetUsage > 100 ? "font-semibold text-rose-500" : "text-slate-600 dark:text-slate-300"}>{budgetUsage.toFixed(1)}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${budgetUsage > 100 ? "bg-rose-500" : "bg-brand-600"}`}
            style={{ width: `${Math.min(100, Math.max(0, budgetUsage))}%` }}
          />
        </div>
      </section>

      <DashboardCards
        budgetUsage={budgetUsage}
        dailyAverage={dailyAverage}
        monthlyExpense={monthlyExpense}
        remainingBudget={remainingBudget}
      />

      <Charts categoryData={categoryData} monthlyData={monthlyData} />

      <section>
        <h2 className="mb-3 text-lg font-semibold">Expense Entries</h2>
        <ExpenseList expenses={filteredExpenses} onDelete={deleteExpense} overspendingCategories={overspendingCategories} />
      </section>

      {showForm ? <ExpenseForm onAddExpense={addExpense} onClose={() => setShowForm(false)} /> : null}
    </main>
  );
}
