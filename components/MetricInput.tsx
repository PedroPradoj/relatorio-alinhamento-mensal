"use client";

import { ReactNode } from "react";

interface MetricInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  badge?: ReactNode;
}

export default function MetricInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder = "0",
  badge,
}: MetricInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between min-h-[18px]">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-none">
          {label}
        </label>
        {badge && <span className="shrink-0">{badge}</span>}
      </div>
      <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 focus-within:border-brand-400 dark:focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 dark:focus-within:ring-brand-900/50 transition-all">
        {prefix && (
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 shrink-0">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm font-medium text-gray-800 dark:text-gray-100 outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 min-w-0"
        />
        {suffix && (
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 shrink-0">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
