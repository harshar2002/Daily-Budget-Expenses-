import { Expense } from "./types";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

export const getMonthKey = (date: string) => date.slice(0, 7);

export const isInMonth = (expense: Expense, month: string) => getMonthKey(expense.date) === month;

export const downloadCSV = (expenses: Expense[]) => {
  const header = ["Date", "Category", "Amount", "Description"];
  const rows = expenses.map((item) => [
    item.date,
    item.category,
    item.amount.toFixed(2),
    `"${item.description.replace(/"/g, '""')}"`,
  ]);

  const csv = [header, ...rows].map((row) => row.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "expenses.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
