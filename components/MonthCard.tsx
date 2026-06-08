"use client";

import { useState } from "react";
import { MonthData, MONTH_NAMES, EMPTY_MONTH } from "@/types";
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
import MetricInput from "./MetricInput";
import ComparisonBadge from "./ComparisonBadge";

interface MonthCardProps {
  monthIndex: number;
  monthData: MonthData;
  previousMonthData: MonthData | null;
  year: number;
  onUpdate: (data: MonthData) => void;
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

export default function MonthCard({
  monthIndex,
  monthData,
  previousMonthData,
  onUpdate,
}: MonthCardProps) {
  const [adsOpen, setAdsOpen] = useState(true);
  const [salesOpen, setSalesOpen] = useState(true);

  const data = monthData ?? { ...EMPTY_MONTH };
  const prev = previousMonthData;

  function field(key: keyof MonthData) {
    return data[key] ?? "";
  }

  function update(key: keyof MonthData, val: string) {
    onUpdate({ ...data, [key]: val });
  }

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

  const monthName = MONTH_NAMES[monthIndex];
  const hasData = inv > 0 || msg > 0 || fat > 0 || ven > 0;

  return (
    <div
      className={`bg-white dark:bg-[#15151A] rounded-2xl border border-gray-100 dark:border-white/5 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col ${
        hasData ? "ring-1 ring-brand-200 dark:ring-brand-800/50" : ""
      }`}
    >
      {/* Month Header */}
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
        {/* Section 1 — Campanhas Meta Ads */}
        <div>
          <button
            onClick={() => setAdsOpen((v) => !v)}
            className="w-full flex items-center justify-between mb-3 group"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center">
                <svg className="w-3 h-3 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                Campanhas Meta Ads
              </span>
            </div>
            <span className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${adsOpen ? "rotate-180" : ""}`}>
              ▾
            </span>
          </button>

          {adsOpen && (
            <div className="flex flex-col gap-2.5">
              {/* Investimento — full width */}
              <MetricInput
                label="Investimento"
                value={field("investimento")}
                onChange={(v) => update("investimento", v)}
                prefix="R$"
                badge={
                  prevInv !== null ? (
                    <ComparisonBadge current={inv} previous={prevInv} invertColors />
                  ) : undefined
                }
              />

              {/* Mensagens + Impressões — 2 cols */}
              <div className="grid grid-cols-2 gap-2.5">
                <MetricInput
                  label="Mensagens"
                  value={field("mensagens")}
                  onChange={(v) => update("mensagens", v)}
                  badge={
                    prevMsg !== null ? (
                      <ComparisonBadge current={msg} previous={prevMsg} />
                    ) : undefined
                  }
                />
                <MetricInput
                  label="Impressões"
                  value={field("impressoes")}
                  onChange={(v) => update("impressoes", v)}
                  badge={
                    prevImp !== null ? (
                      <ComparisonBadge current={imp} previous={prevImp} />
                    ) : undefined
                  }
                />
              </div>

              {/* Cliques + Hook Rate — 2 cols */}
              <div className="grid grid-cols-2 gap-2.5">
                <MetricInput
                  label="Cliques"
                  value={field("cliques")}
                  onChange={(v) => update("cliques", v)}
                  badge={
                    prevClk !== null ? (
                      <ComparisonBadge current={clk} previous={prevClk} />
                    ) : undefined
                  }
                />
                <MetricInput
                  label="Hook Rate"
                  value={field("hookRate")}
                  onChange={(v) => update("hookRate", v)}
                  suffix="%"
                  badge={
                    prevHook !== null ? (
                      <ComparisonBadge current={parseField(data.hookRate)} previous={prevHook} />
                    ) : undefined
                  }
                />
              </div>

              {/* Calculated metrics */}
              {(inv > 0 || msg > 0 || clk > 0 || imp > 0) && (
                <div className="bg-brand-50 dark:bg-brand-950/40 rounded-2xl px-4 py-3 mt-0.5">
                  <p className="text-xs font-bold text-brand-600 dark:text-brand-500 uppercase tracking-wide mb-2">
                    Calculados
                  </p>
                  <CalcRow
                    label="Custo por Mensagem"
                    value={custoPorMensagem}
                    prevValue={prevCustoMsg}
                    formatted={custoPorMensagem > 0 ? formatCurrency(custoPorMensagem) : "—"}
                    invertColors
                  />
                  <CalcRow
                    label="CPC"
                    value={cpc}
                    prevValue={prevCPC}
                    formatted={cpc > 0 ? formatCurrency(cpc) : "—"}
                    invertColors
                  />
                  <CalcRow
                    label="Taxa de Conversão"
                    value={taxaConv}
                    prevValue={prevTaxaConv}
                    formatted={taxaConv > 0 ? formatPercent(taxaConv) : "—"}
                  />
                  <CalcRow
                    label="CPM"
                    value={cpm}
                    prevValue={prevCPM}
                    formatted={cpm > 0 ? formatCurrency(cpm) : "—"}
                    invertColors
                  />
                  <CalcRow
                    label="CTR"
                    value={ctr}
                    prevValue={prevCTR}
                    formatted={ctr > 0 ? formatPercent(ctr) : "—"}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-700/60" />

        {/* Section 2 — Vendas */}
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
            <span className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${salesOpen ? "rotate-180" : ""}`}>
              ▾
            </span>
          </button>

          {salesOpen && (
            <div className="flex flex-col gap-2.5">
              <MetricInput
                label="Faturamento"
                value={field("faturamento")}
                onChange={(v) => update("faturamento", v)}
                prefix="R$"
                badge={
                  prevFat !== null ? (
                    <ComparisonBadge current={fat} previous={prevFat} />
                  ) : undefined
                }
              />
              <MetricInput
                label="Vendas"
                value={field("vendas")}
                onChange={(v) => update("vendas", v)}
                badge={
                  prevVen !== null ? (
                    <ComparisonBadge current={ven} previous={prevVen} />
                  ) : undefined
                }
              />

              {(fat > 0 || ven > 0) && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl px-4 py-3 mt-0.5">
                  <p className="text-xs font-bold text-emerald-500 dark:text-emerald-600 uppercase tracking-wide mb-2">
                    Calculados
                  </p>
                  <CalcRow
                    label="Taxa Conv. de Vendas"
                    value={taxaConvVendas}
                    prevValue={prevTaxaConvVendas}
                    formatted={taxaConvVendas > 0 ? formatPercent(taxaConvVendas) : "—"}
                  />
                  <CalcRow
                    label="Ticket Médio"
                    value={ticketMedio}
                    prevValue={prevTicketMedio}
                    formatted={ticketMedio > 0 ? formatCurrency(ticketMedio) : "—"}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
