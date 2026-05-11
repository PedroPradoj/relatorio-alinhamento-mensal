"use client";

import { calcPercentChange } from "@/lib/calculations";

interface ComparisonBadgeProps {
  current: number;
  previous: number | null;
  invertColors?: boolean;
}

export default function ComparisonBadge({
  current,
  previous,
  invertColors = false,
}: ComparisonBadgeProps) {
  if (previous === null || previous === undefined) return null;

  const change = calcPercentChange(current, previous);

  if (change === null) {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
        —
      </span>
    );
  }

  const isPositive = change > 0;
  const isNeutral = change === 0;
  const isGood = invertColors ? !isPositive : isPositive;

  if (isNeutral) {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
        0%
      </span>
    );
  }

  const formatted = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(Math.abs(change));

  return (
    <span
      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
        isGood
          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
          : "bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400"
      }`}
    >
      <span>{isPositive ? "▲" : "▼"}</span>
      <span>{formatted}%</span>
    </span>
  );
}
