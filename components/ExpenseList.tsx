import { Expense } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type ExpenseListProps = {
  expenses: Expense[];
  onDelete: (id: string) => void;
  overspendingCategories: Set<string>;
};

export default function ExpenseList({ expenses, onDelete, overspendingCategories }: ExpenseListProps) {
  if (!expenses.length) {
    return <div className="card text-sm text-slate-500 dark:text-slate-400">No expenses found for selected month.</div>;
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/80">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => {
              const isOver = overspendingCategories.has(expense.category);
              return (
                <tr className="border-t border-slate-200 dark:border-slate-800" key={expense.id}>
                  <td className="px-4 py-3">{expense.date}</td>
                  <td className={`px-4 py-3 ${isOver ? "font-semibold text-rose-500" : ""}`}>{expense.category}</td>
                  <td className="px-4 py-3">{expense.description}</td>
                  <td className="px-4 py-3">{formatCurrency(expense.amount)}</td>
                  <td className="px-4 py-3">
                    <button className="text-rose-500 transition hover:text-rose-400" onClick={() => onDelete(expense.id)} type="button">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
