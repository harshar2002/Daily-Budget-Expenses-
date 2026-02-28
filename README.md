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


## Troubleshooting

- If Vercel/CI reports `Failed to load config "next/typescript"`, ensure `.eslintrc.json` extends only `next/core-web-vitals` for this setup.
- If TypeScript reports `MapIterator` iteration errors, ensure `tsconfig.json` targets `es2015` or newer (this project uses `es2017`).


## Update on GitHub

Use this workflow to publish the latest local changes to your GitHub repository:

```bash
git add .
git commit -m "Your message"
git push origin <branch-name>
```

If no remote is configured yet:

```bash
git remote add origin <your-github-repo-url>
git push -u origin <branch-name>
```
