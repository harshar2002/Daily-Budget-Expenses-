import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Expense Tracker",
  description: "Track monthly spending, budgets, and category trends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
