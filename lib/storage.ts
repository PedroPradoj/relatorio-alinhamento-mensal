import { AllData, MonthData, EMPTY_MONTH } from "@/types";

const STORAGE_KEY = "relatorio-mensal-data";

export function loadData(): AllData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as AllData;
  } catch {
    return {};
  }
}

export function saveData(data: AllData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.error("Failed to save data to localStorage");
  }
}

export function updateMonth(
  data: AllData,
  year: number,
  month: number,
  monthData: MonthData
): AllData {
  const updated: AllData = { ...data };
  if (!updated[year]) {
    updated[year] = {};
  }
  updated[year] = { ...updated[year], [month]: monthData };
  return updated;
}

export function getMonthData(
  data: AllData,
  year: number,
  month: number
): MonthData {
  return data?.[year]?.[month] ?? { ...EMPTY_MONTH };
}

export function getYearData(data: AllData, year: number): Record<number, MonthData> {
  return data?.[year] ?? {};
}
