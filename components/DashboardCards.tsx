import { formatCurrency } from "@/lib/utils";

type DashboardCardsProps = {
  monthlyExpense: number;
  remainingBudget: number;
  dailyAverage: number;
  budgetUsage: number;
};

export default function DashboardCards({ monthlyExpense, remainingBudget, dailyAverage, budgetUsage }: DashboardCardsProps) {
  const items = [
    { label: "Total Monthly Expense", value: formatCurrency(monthlyExpense) },
    {
      label: "Remaining Budget",
      value: formatCurrency(remainingBudget),
      highlight: remainingBudget < 0,
    },
    { label: "Daily Average Spend", value: formatCurrency(dailyAverage) },
    {
      label: "Budget Usage",
      value: `${budgetUsage.toFixed(1)}%`,
      highlight: budgetUsage > 100,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div className="card" key={item.label}>
          <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
          <p className={`mt-2 text-2xl font-semibold ${item.highlight ? "text-rose-500" : "text-slate-900 dark:text-slate-100"}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
