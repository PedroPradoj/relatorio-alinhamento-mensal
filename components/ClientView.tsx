"use client";

import { useState, useEffect } from "react";
import { AllData, MonthData, MONTH_NAMES, EMPTY_MONTH } from "@/types";
import {
  parseField,
  calcCustoPorMensagem,
  calcCPC,
  calcTaxaConversao,
  calcCPM,
  calcCTR,
  calcTaxaConversaoVendas,
  calcTicketMedio,
  formatCurrency,
  formatPercent,
} from "@/lib/calculations";
import ComparisonBadge from "./ComparisonBadge";
import ThemeToggle from "./ThemeToggle";
import ExportButtons from "./ExportButtons";
import YearSelector from "./YearSelector";

interface ClientViewProps {
  clientId: string;
  clientName: string;
  initialData: AllData;
}

interface CalcRowProps {
  label: string;
  value: number;
  prevValue: number | null;
  formatted: string;
  invertColors?: boolean;
}

function CalcRow({ label, value, prevValue, formatted, invertColors }: CalcRowProps) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700/60 last:border-0">
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{formatted}</span>
        <ComparisonBadge current={value} previous={prevValue} invertColors={invertColors} />
      </div>
    </div>
  );
}

function ReadOnlyRow({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700/60 last:border-0">
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          {value || "—"}
        </span>
        {badge}
      </div>
    </div>
  );
}

function MonthViewCard({
  monthIndex,
  monthData,
  previousMonthData,
}: {
  monthIndex: number;
  monthData: MonthData;
  previousMonthData: MonthData | null;
}) {
  const [adsOpen, setAdsOpen] = useState(true);
  const [salesOpen, setSalesOpen] = useState(true);

  const data = monthData;
  const prev = previousMonthData;

  const inv = parseField(data.investimento);
  const msg = parseField(data.mensagens);
  const imp = parseField(data.impressoes);
  const clk = parseField(data.cliques);
  const fat = parseField(data.faturamento);
  const ven = parseField(data.vendas);

  const prevInv = prev ? parseField(prev.investimento) : null;
  const prevMsg = prev ? parseField(prev.mensagens) : null;
  const prevImp = prev ? parseField(prev.impressoes) : null;
  const prevClk = prev ? parseField(prev.cliques) : null;
  const prevHook = prev ? parseField(prev.hookRate) : null;
  const prevFat = prev ? parseField(prev.faturamento) : null;
  const prevVen = prev ? parseField(prev.vendas) : null;

  const custoPorMensagem = calcCustoPorMensagem(inv, msg);
  const cpc = calcCPC(inv, clk);
  const taxaConv = calcTaxaConversao(msg, clk);
  const cpm = calcCPM(inv, imp);
  const ctr = calcCTR(clk, imp);
  const taxaConvVendas = calcTaxaConversaoVendas(ven, msg);
  const ticketMedio = calcTicketMedio(fat, ven);

  const prevCustoMsg = prev ? calcCustoPorMensagem(prevInv!, prevMsg!) : null;
  const prevCPC = prev ? calcCPC(prevInv!, prevClk!) : null;
  const prevTaxaConv = prev ? calcTaxaConversao(prevMsg!, prevClk!) : null;
  const prevCPM = prev ? calcCPM(prevInv!, prevImp!) : null;
  const prevCTR = prev ? calcCTR(prevClk!, prevImp!) : null;
  const prevTaxaConvVendas = prev ? calcTaxaConversaoVendas(prevVen!, prevMsg!) : null;
  const prevTicketMedio = prev ? calcTicketMedio(prevFat!, prevVen!) : null;

  const hasData = inv > 0 || msg > 0 || fat > 0 || ven > 0;
  const monthName = MONTH_NAMES[monthIndex];

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col ${
        hasData ? "ring-1 ring-brand-200 dark:ring-brand-900/60" : ""
      }`}
    >
      <div className="bg-[#16161A] border-b border-brand-600/40 px-5 py-4 flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-lg leading-none">{monthName}</h3>
          {hasData && (
            <p className="text-brand-300 text-xs mt-1">
              Investimento: {inv > 0 ? formatCurrency(inv) : "—"}
            </p>
          )}
        </div>
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            hasData
              ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
              : "bg-white/30"
          }`}
        />
      </div>

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Campanhas Meta Ads */}
        <div>
          <button
            onClick={() => setAdsOpen((v) => !v)}
            className="w-full flex items-center justify-between mb-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center">
                <svg className="w-3 h-3 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Campanhas Meta Ads</span>
            </div>
            <span className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${adsOpen ? "rotate-180" : ""}`}>▾</span>
          </button>

          {adsOpen && (
            <div className="flex flex-col gap-1">
              <ReadOnlyRow
                label="Investimento"
                value={inv > 0 ? formatCurrency(inv) : ""}
                badge={prevInv !== null ? <ComparisonBadge current={inv} previous={prevInv} invertColors /> : undefined}
              />
              <ReadOnlyRow
                label="Mensagens"
                value={data.mensagens}
                badge={prevMsg !== null ? <ComparisonBadge current={msg} previous={prevMsg} /> : undefined}
              />
              <ReadOnlyRow
                label="Impressões"
                value={data.impressoes}
                badge={prevImp !== null ? <ComparisonBadge current={imp} previous={prevImp} /> : undefined}
              />
              <ReadOnlyRow
                label="Cliques"
                value={data.cliques}
                badge={prevClk !== null ? <ComparisonBadge current={clk} previous={prevClk} /> : undefined}
              />
              <ReadOnlyRow
                label="Hook Rate"
                value={data.hookRate ? `${data.hookRate}%` : ""}
                badge={prevHook !== null ? <ComparisonBadge current={parseField(data.hookRate)} previous={prevHook} /> : undefined}
              />

              {(inv > 0 || msg > 0 || clk > 0 || imp > 0) && (
                <div className="bg-brand-50 dark:bg-brand-950/40 rounded-2xl px-4 py-3 mt-2">
                  <p className="text-xs font-bold text-brand-600 dark:text-brand-500 uppercase tracking-wide mb-2">Calculados</p>
                  <CalcRow label="Custo por Mensagem" value={custoPorMensagem} prevValue={prevCustoMsg} formatted={custoPorMensagem > 0 ? formatCurrency(custoPorMensagem) : "—"} invertColors />
                  <CalcRow label="CPC" value={cpc} prevValue={prevCPC} formatted={cpc > 0 ? formatCurrency(cpc) : "—"} invertColors />
                  <CalcRow label="Taxa de Conversão" value={taxaConv} prevValue={prevTaxaConv} formatted={taxaConv > 0 ? formatPercent(taxaConv) : "—"} />
                  <CalcRow label="CPM" value={cpm} prevValue={prevCPM} formatted={cpm > 0 ? formatCurrency(cpm) : "—"} invertColors />
                  <CalcRow label="CTR" value={ctr} prevValue={prevCTR} formatted={ctr > 0 ? formatPercent(ctr) : "—"} />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700/60" />

        {/* Vendas */}
        <div>
          <button
            onClick={() => setSalesOpen((v) => !v)}
            className="w-full flex items-center justify-between mb-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Vendas</span>
            </div>
            <span className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${salesOpen ? "rotate-180" : ""}`}>▾</span>
          </button>

          {salesOpen && (
            <div className="flex flex-col gap-1">
              <ReadOnlyRow
                label="Faturamento"
                value={fat > 0 ? formatCurrency(fat) : ""}
                badge={prevFat !== null ? <ComparisonBadge current={fat} previous={prevFat} /> : undefined}
              />
              <ReadOnlyRow
                label="Vendas"
                value={data.vendas}
                badge={prevVen !== null ? <ComparisonBadge current={ven} previous={prevVen} /> : undefined}
              />

              {(fat > 0 || ven > 0) && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl px-4 py-3 mt-2">
                  <p className="text-xs font-bold text-emerald-500 dark:text-emerald-600 uppercase tracking-wide mb-2">Calculados</p>
                  <CalcRow label="Taxa Conv. de Vendas" value={taxaConvVendas} prevValue={prevTaxaConvVendas} formatted={taxaConvVendas > 0 ? formatPercent(taxaConvVendas) : "—"} />
                  <CalcRow label="Ticket Médio" value={ticketMedio} prevValue={prevTicketMedio} formatted={ticketMedio > 0 ? formatCurrency(ticketMedio) : "—"} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SumCard({ label, value, color }: { label: string; value: string; color: "brand" | "emerald" | "amber" }) {
  const colorMap = {
    brand: "from-brand-50 to-brand-100 dark:from-brand-950/60 dark:to-brand-900/40 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800/60",
    emerald: "from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    amber: "from-amber-50 to-amber-100 dark:from-amber-950/60 dark:to-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
  };
  return (
    <div className={`rounded-2xl bg-gradient-to-br border px-4 py-3 ${colorMap[color]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">{label}</p>
      <p className="text-lg font-extrabold leading-tight">{value}</p>
    </div>
  );
}

export default function ClientView({ clientName, initialData }: ClientViewProps) {
  const [year, setYear] = useState(new Date().getFullYear());
  const allData = initialData;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50/20 to-stone-100 dark:from-[#0B0B0D] dark:via-[#101013] dark:to-[#0B0B0D] transition-colors duration-300">
      <header className="bg-[#101013] border-b border-brand-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-inner shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight tracking-tight">
                  {clientName}
                </h1>
                <p className="text-brand-300 text-sm font-medium mt-0.5">
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

      {(totalInvestimento > 0 || totalFaturamento > 0) && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <SumCard label="Total Investido" value={formatBRL(totalInvestimento)} color="brand" />
              <SumCard label="Total Faturamento" value={formatBRL(totalFaturamento)} color="emerald" />
              <SumCard label="Total Mensagens" value={formatNum(totalMensagens)} color="brand" />
              <SumCard label="Total Vendas" value={formatNum(totalVendas)} color="amber" />
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 12 }, (_, i) => (
            <MonthViewCard
              key={i}
              monthIndex={i}
              monthData={getMonthData(i)}
              previousMonthData={getPrevMonthData(i)}
            />
          ))}
        </div>

        <footer className="mt-12 text-center text-xs text-gray-400 dark:text-gray-600 pb-8">
          {clientName} · Relatório de desempenho · {year}
        </footer>
      </main>
    </div>
  );
}
