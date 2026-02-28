export const CATEGORIES = [
  "Food",
  "Transport",
  "Personal",
  "Shopping",
  "Recharge",
  "Emergency",
  "Others",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Expense = {
  id: string;
  date: string;
  category: Category;
  amount: number;
  description: string;
};
