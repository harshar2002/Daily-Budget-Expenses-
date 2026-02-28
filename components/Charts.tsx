"use client";

import { memo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartDatum = {
  name: string;
  value: number;
  over?: boolean;
};

type ChartsProps = {
  categoryData: ChartDatum[];
  monthlyData: ChartDatum[];
};

const COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#06b6d4", "#ef4444", "#64748b"];

function EmptyChartState({ text }: { text: string }) {
  return <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">{text}</div>;
}

function Charts({ categoryData, monthlyData }: ChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <div className="card h-[340px]">
        <h3 className="mb-4 font-semibold">Category-wise Breakdown</h3>
        {categoryData.length ? (
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={110}>
                {categoryData.map((entry, index) => (
                  <Cell fill={entry.over ? "#ef4444" : COLORS[index % COLORS.length]} key={entry.name} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartState text="Add some expenses to view category distribution." />
        )}
      </div>

      <div className="card h-[340px]">
        <h3 className="mb-4 font-semibold">Monthly Trend</h3>
        {monthlyData.length ? (
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {monthlyData.map((item, index) => (
                  <Cell fill={COLORS[index % COLORS.length]} key={`${item.name}-${item.value}`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartState text="No monthly trend yet. Start adding expenses." />
        )}
      </div>
    </div>
  );
}

export default memo(Charts);
