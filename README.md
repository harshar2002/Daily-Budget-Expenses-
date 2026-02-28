# Personal Expense Tracker (Next.js 14)

Production-ready personal expense dashboard built with Next.js App Router, Tailwind CSS, and Recharts.

## Features

- Monthly dashboard cards: total expense, remaining budget, daily average, budget usage.
- Budget utilization progress bar with overspending warning color.
- Category-wise pie chart and monthly trend bar chart.
- Empty-state chart messaging for no-data scenarios.
- Expense entry modal with date/category/amount/description.
- LocalStorage persistence (no authentication).
- Month filtering.
- Budget warnings when overspent.
- Dark mode toggle.
- **Demo Data** button for fast preview/testing.
- CSV export for filtered month.
- Reset current month or clear all data.
- Overspending category highlighting.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build for production

```bash
npm run build
npm run start
```

## Deploy on Vercel

1. Push repository to GitHub.
2. Import project in Vercel.
3. Framework preset: **Next.js**.
4. No additional env vars required.
