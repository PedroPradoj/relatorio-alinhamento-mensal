"use client";

import { useState, useEffect, useCallback } from "react";
import { AllData, MonthData, EMPTY_MONTH } from "@/types";
import { updateMonth } from "@/lib/storage";
import { fetchClientData, upsertMonth } from "@/lib/supabase";
import MonthCard from "./MonthCard";
import YearSelector from "./YearSelector";
import ExportButtons from "./ExportButtons";
import ThemeToggle from "./ThemeToggle";

interface DashboardProps {
  clientId: string;
  clientName: string;
  onBack: () => void;
}

export default function Dashboard({ clientId, clientName, onBack }: DashboardProps) {
  const [allData, setAllData] = useState<AllData>({});
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    fetchClientData(clientId).then((data) => {
      setAllData(data);
      setHydrated(true);
    });
  }, [clientId]);

  const handleUpdate = useCallback(
    (monthIndex: number, data: MonthData) => {
      setAllData((prev) => {
        const updated = updateMonth(prev, year, monthIndex, data);
        return updated;
      });
      upsertMonth(clientId, year, monthIndex, data);
    },
    [year, clientId]
  );

  const getMonthData = (idx: number): MonthData =>
    allData?.[year]?.[idx] ?? { ...EMPTY_MONTH };

  const getPrevMonthData = (idx: number): MonthData | null => {
    if (idx === 0) return null;
    return allData?.[year]?.[idx - 1] ?? null;
  };

  function sumField(field: keyof MonthData) {
    return Array.from({ length: 12 }, (_, i) => {
      const v = allData?.[year]?.[i]?.[field];
      if (!v) return 0;
      return parseFloat(String(v).replace(",", ".")) || 0;
    }).reduce((a, b) => a + b, 0);
  }

  const totalInvestimento = sumField("investimento");
  const totalFaturamento = sumField("faturamento");
  const totalMensagens = sumField("mensagens");
  const totalVendas = sumField("vendas");

  const formatBRL = (val: number) =>
    val === 0
      ? "—"
      : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  const formatNum = (val: number) =>
    val === 0 ? "—" : new Intl.NumberFormat("pt-BR").format(val);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Back button */}
              <button
                onClick={onBack}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all shrink-0"
                aria-label="Voltar para clientes"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="w-px h-8 bg-white/20" />

              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-inner shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight tracking-tight">
                  {clientName}
                </h1>
                <p className="text-indigo-200 text-sm font-medium mt-0.5">
                  Relatório Mensal · Meta Ads
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <YearSelector year={year} onYearChange={setYear} />
              <ThemeToggle />
              <ExportButtons data={allData} year={year} />
            </div>
          </div>
        </div>
      </header>

      {/* Summary Bar */}
      {(totalInvestimento > 0 || totalFaturamento > 0) && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <SumCard label="Total Investido" value={formatBRL(totalInvestimento)} color="indigo" />
              <SumCard label="Total Faturamento" value={formatBRL(totalFaturamento)} color="emerald" />
              <SumCard label="Total Mensagens" value={formatNum(totalMensagens)} color="purple" />
              <SumCard label="Total Vendas" value={formatNum(totalVendas)} color="amber" />
            </div>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 12 }, (_, i) => (
            <MonthCard
              key={i}
              monthIndex={i}
              monthData={getMonthData(i)}
              previousMonthData={getPrevMonthData(i)}
              year={year}
              onUpdate={(data) => handleUpdate(i, data)}
            />
          ))}
        </div>

        <footer className="mt-12 text-center text-xs text-gray-400 dark:text-gray-600 pb-8">
          {clientName} · Dados salvos localmente no navegador · {year}
        </footer>
      </main>
    </div>
  );
}

function SumCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "indigo" | "emerald" | "purple" | "amber";
}) {
  const colorMap = {
    indigo: "from-indigo-50 to-indigo-100 dark:from-indigo-950/60 dark:to-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60",
    emerald: "from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    purple: "from-purple-50 to-purple-100 dark:from-purple-950/60 dark:to-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60",
    amber: "from-amber-50 to-amber-100 dark:from-amber-950/60 dark:to-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
  };

  return (
    <div className={`rounded-2xl bg-gradient-to-br border px-4 py-3 ${colorMap[color]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">{label}</p>
      <p className="text-lg font-extrabold leading-tight">{value}</p>
    </div>
  );
}
