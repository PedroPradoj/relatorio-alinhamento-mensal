"use client";

import { useState } from "react";
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

interface Props {
  allData: AllData;
  year: number;
}

function getData(allData: AllData, year: number, month: number): MonthData {
  return allData?.[year]?.[month] ?? { ...EMPTY_MONTH };
}

function metrics(d: MonthData) {
  const inv = parseField(d.investimento);
  const msg = parseField(d.mensagens);
  const imp = parseField(d.impressoes);
  const clk = parseField(d.cliques);
  const fat = parseField(d.faturamento);
  const ven = parseField(d.vendas);
  const hook = parseField(d.hookRate);
  return {
    inv, msg, imp, clk, fat, ven, hook,
    cpm: calcCPM(inv, imp),
    cpc: calcCPC(inv, clk),
    custoMsg: calcCustoPorMensagem(inv, msg),
    taxaConv: calcTaxaConversao(msg, clk),
    ctr: calcCTR(clk, imp),
    taxaConvVendas: calcTaxaConversaoVendas(ven, msg),
    ticketMedio: calcTicketMedio(fat, ven),
    roi: inv > 0 && fat > 0 ? fat / inv : 0,
  };
}

function pct(a: number, b: number): number | null {
  if (b <= 0) return null;
  return ((a - b) / b) * 100;
}

function fmt(n: number): string {
  return new Intl.NumberFormat("pt-BR").format(n);
}

// ── KPI Card ──────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  change,
  invertColors = false,
  empty = false,
}: {
  label: string;
  value: string;
  change: number | null;
  invertColors?: boolean;
  empty?: boolean;
}) {
  const isPositive = change !== null && change > 0;
  const isGood = change !== null ? (invertColors ? !isPositive : isPositive) : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-card flex flex-col gap-2">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        {label}
      </p>
      <p className="font-display text-2xl font-bold text-gray-900 dark:text-gray-50 leading-none">
        {empty ? "—" : value}
      </p>
      {!empty && change !== null && (
        <span
          className={`self-start inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            isGood
              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
              : "bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400"
          }`}
        >
          <span>{isPositive ? "▲" : "▼"}</span>
          <span>{Math.abs(change).toFixed(1)}%</span>
        </span>
      )}
      {!empty && change === null && (
        <span className="text-[11px] text-gray-300 dark:text-gray-600">sem comparativo</span>
      )}
    </div>
  );
}

// ── Year Chart (SVG) ──────────────────────────────────────────────────────────

function YearChart({
  allData,
  year,
  primary,
  compare,
}: {
  allData: AllData;
  year: number;
  primary: number;
  compare: number;
}) {
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = getData(allData, year, i);
    return { fat: parseField(d.faturamento), inv: parseField(d.investimento) };
  });

  const maxFat = Math.max(...months.map((m) => m.fat), 1);
  const maxInv = Math.max(...months.map((m) => m.inv), 1);
  const maxVal = Math.max(maxFat, maxInv * 1.2);

  const W = 800, H = 180, PAD_X = 10, PAD_Y = 20, BAR_W = 36;
  const slotW = (W - PAD_X * 2) / 12;
  const cx = (i: number) => PAD_X + i * slotW + slotW / 2;
  const cy = (v: number) => H - PAD_Y - (v / maxVal) * (H - PAD_Y * 2);

  const linePts = months
    .map((m, i) => (m.inv > 0 ? `${cx(i)},${cy(m.inv)}` : null))
    .filter(Boolean);

  const hasLine = months.some((m) => m.inv > 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-card">
      <h3 className="font-display text-base font-bold text-gray-700 dark:text-gray-200 mb-4">
        Evolução Anual · {year}
      </h3>

      <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {months.map((m, i) => {
          const barH = Math.max(m.fat > 0 ? (m.fat / maxVal) * (H - PAD_Y * 2) : 0, m.fat > 0 ? 3 : 0);
          const isPrimary = i === primary;
          const isCompare = i === compare && compare !== primary;
          const barFill = isPrimary ? "#C9973A" : isCompare ? "#AC7F2E" : "#E8D29F";
          const barOp = isPrimary ? 1 : isCompare ? 0.7 : 0.35;

          return (
            <g key={i}>
              {barH > 0 && (
                <rect
                  x={cx(i) - BAR_W / 2}
                  y={cy(m.fat)}
                  width={BAR_W}
                  height={barH}
                  rx={4}
                  fill={barFill}
                  opacity={barOp}
                />
              )}
              {barH === 0 && (
                <rect
                  x={cx(i) - BAR_W / 2}
                  y={H - PAD_Y - 1}
                  width={BAR_W}
                  height={1}
                  fill="#e5e7eb"
                  opacity={0.5}
                />
              )}
              <text
                x={cx(i)}
                y={H + 16}
                textAnchor="middle"
                fontSize={9}
                fill={isPrimary || isCompare ? "#C9973A" : "#9ca3af"}
                fontWeight={isPrimary || isCompare ? "700" : "400"}
              >
                {MONTH_NAMES[i].slice(0, 3)}
              </text>
            </g>
          );
        })}

        {hasLine && (
          <>
            <polyline
              points={linePts.join(" ")}
              fill="none"
              stroke="#10b981"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="5 3"
            />
            {months.map((m, i) =>
              m.inv > 0 ? (
                <circle key={i} cx={cx(i)} cy={cy(m.inv)} r={3} fill="#10b981" />
              ) : null
            )}
          </>
        )}
      </svg>

      <div className="flex flex-wrap items-center gap-5 mt-1">
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="w-3 h-3 rounded-sm inline-block bg-brand-500" />
          Faturamento (mês selecionado)
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="w-3 h-3 rounded-sm inline-block bg-brand-600 opacity-70" />
          Faturamento (comparado)
        </div>
        {hasLine && (
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
            <span className="w-5 inline-block border-t-2 border-dashed border-emerald-500" />
            Investimento
          </div>
        )}
      </div>
    </div>
  );
}

// ── Comparison Table ──────────────────────────────────────────────────────────

function CompRow({
  label,
  v1,
  v2,
  f1,
  f2,
  invert = false,
}: {
  label: string;
  v1: number;
  v2: number;
  f1: string;
  f2: string;
  invert?: boolean;
}) {
  const change = pct(v1, v2);
  const isPositive = change !== null && change > 0;
  const isGood = change !== null ? (invert ? !isPositive : isPositive) : null;

  return (
    <tr className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
      <td className="py-2.5 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {label}
      </td>
      <td className="py-2.5 px-4 text-sm font-semibold text-gray-800 dark:text-gray-100 text-right tabular-nums">
        {f1 || "—"}
      </td>
      <td className="py-2.5 px-4 text-sm font-semibold text-gray-400 dark:text-gray-500 text-right tabular-nums">
        {f2 || "—"}
      </td>
      <td className="py-2.5 px-4 text-right">
        {change !== null ? (
          <span
            className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
              isGood
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                : "bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400"
            }`}
          >
            <span>{isPositive ? "▲" : "▼"}</span>
            <span>{Math.abs(change).toFixed(1)}%</span>
          </span>
        ) : (
          <span className="text-[10px] text-gray-300 dark:text-gray-600">—</span>
        )}
      </td>
    </tr>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AnalyticsDashboard({ allData, year }: Props) {
  const today = new Date().getMonth();
  const [primary, setPrimary] = useState(today);
  const [compare, setCompare] = useState(today > 0 ? today - 1 : 0);

  const pd = getData(allData, year, primary);
  const cd = getData(allData, year, compare);
  const pm = metrics(pd);
  const cm = metrics(cd);

  const hasData = pm.inv > 0 || pm.fat > 0 || pm.msg > 0;

  return (
    <div className="flex flex-col gap-6">

      {/* Month selectors */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Mês principal
          </label>
          <select
            value={primary}
            onChange={(e) => setPrimary(Number(e.target.value))}
            className="bg-white dark:bg-gray-800 border-2 border-brand-400 dark:border-brand-600 text-gray-800 dark:text-gray-100 text-sm font-semibold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-900/50 transition-all cursor-pointer"
          >
            {MONTH_NAMES.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
        </div>

        <div className="pb-2 text-gray-300 dark:text-gray-600 font-bold text-xl select-none">vs</div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Comparar com
          </label>
          <select
            value={compare}
            onChange={(e) => setCompare(Number(e.target.value))}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 text-sm font-semibold rounded-xl px-4 py-2 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/50 transition-all cursor-pointer"
          >
            {MONTH_NAMES.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty state */}
      {!hasData && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="font-display text-xl font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Sem dados para {MONTH_NAMES[primary]}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Insira os dados na aba Dados para visualizar o dashboard.
          </p>
        </div>
      )}

      {hasData && (
        <>
          {/* KPI grid */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
              Indicadores · {MONTH_NAMES[primary]}
              {" "}<span className="font-normal text-gray-300 dark:text-gray-600">vs {MONTH_NAMES[compare]}</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <KpiCard
                label="Investimento"
                value={formatCurrency(pm.inv)}
                change={pct(pm.inv, cm.inv)}
                invertColors
                empty={pm.inv === 0}
              />
              <KpiCard
                label="Faturamento"
                value={formatCurrency(pm.fat)}
                change={pct(pm.fat, cm.fat)}
                empty={pm.fat === 0}
              />
              <KpiCard
                label="ROI"
                value={pm.roi > 0 ? `${pm.roi.toFixed(1)}×` : "—"}
                change={pct(pm.roi, cm.roi)}
                empty={pm.roi === 0}
              />
              <KpiCard
                label="Mensagens"
                value={pm.msg > 0 ? fmt(pm.msg) : "—"}
                change={pct(pm.msg, cm.msg)}
                empty={pm.msg === 0}
              />
              <KpiCard
                label="CPM"
                value={pm.cpm > 0 ? formatCurrency(pm.cpm) : "—"}
                change={pct(pm.cpm, cm.cpm)}
                invertColors
                empty={pm.cpm === 0}
              />
              <KpiCard
                label="CPC"
                value={pm.cpc > 0 ? formatCurrency(pm.cpc) : "—"}
                change={pct(pm.cpc, cm.cpc)}
                invertColors
                empty={pm.cpc === 0}
              />
              <KpiCard
                label="Custo / Mensagem"
                value={pm.custoMsg > 0 ? formatCurrency(pm.custoMsg) : "—"}
                change={pct(pm.custoMsg, cm.custoMsg)}
                invertColors
                empty={pm.custoMsg === 0}
              />
              <KpiCard
                label="Taxa de Conversão"
                value={pm.taxaConv > 0 ? formatPercent(pm.taxaConv) : "—"}
                change={pct(pm.taxaConv, cm.taxaConv)}
                empty={pm.taxaConv === 0}
              />
              {(pm.ticketMedio > 0 || cm.ticketMedio > 0) && (
                <KpiCard
                  label="Ticket Médio"
                  value={pm.ticketMedio > 0 ? formatCurrency(pm.ticketMedio) : "—"}
                  change={pct(pm.ticketMedio, cm.ticketMedio)}
                  empty={pm.ticketMedio === 0}
                />
              )}
              {(pm.taxaConvVendas > 0 || cm.taxaConvVendas > 0) && (
                <KpiCard
                  label="Conv. em Vendas"
                  value={pm.taxaConvVendas > 0 ? formatPercent(pm.taxaConvVendas) : "—"}
                  change={pct(pm.taxaConvVendas, cm.taxaConvVendas)}
                  empty={pm.taxaConvVendas === 0}
                />
              )}
              {(pm.hook > 0 || cm.hook > 0) && (
                <KpiCard
                  label="Hook Rate"
                  value={pm.hook > 0 ? formatPercent(pm.hook) : "—"}
                  change={pct(pm.hook, cm.hook)}
                  empty={pm.hook === 0}
                />
              )}
              {(pm.ctr > 0 || cm.ctr > 0) && (
                <KpiCard
                  label="CTR"
                  value={pm.ctr > 0 ? formatPercent(pm.ctr) : "—"}
                  change={pct(pm.ctr, cm.ctr)}
                  empty={pm.ctr === 0}
                />
              )}
            </div>
          </div>

          {/* Year chart */}
          <YearChart allData={allData} year={year} primary={primary} compare={compare} />

          {/* Comparison table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center gap-3">
              <h3 className="font-display text-base font-bold text-gray-700 dark:text-gray-200 flex-1">
                Comparativo Detalhado
              </h3>
              <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2.5 py-1 rounded-full">
                {MONTH_NAMES[primary]}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">vs</span>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">
                {MONTH_NAMES[compare]}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/40">
                    <th className="py-2.5 px-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 text-left w-1/3">
                      Métrica
                    </th>
                    <th className="py-2.5 px-4 text-[11px] font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400 text-right">
                      {MONTH_NAMES[primary]}
                    </th>
                    <th className="py-2.5 px-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 text-right">
                      {MONTH_NAMES[compare]}
                    </th>
                    <th className="py-2.5 px-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 text-right">
                      Variação
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {/* Inputs */}
                  <tr className="bg-brand-50/40 dark:bg-brand-950/20">
                    <td colSpan={4} className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-500 dark:text-brand-600">
                      Dados de Entrada
                    </td>
                  </tr>
                  <CompRow label="Investimento" v1={pm.inv} v2={cm.inv} f1={pm.inv > 0 ? formatCurrency(pm.inv) : ""} f2={cm.inv > 0 ? formatCurrency(cm.inv) : ""} invert />
                  <CompRow label="Mensagens" v1={pm.msg} v2={cm.msg} f1={pm.msg > 0 ? fmt(pm.msg) : ""} f2={cm.msg > 0 ? fmt(cm.msg) : ""} />
                  <CompRow label="Impressões" v1={pm.imp} v2={cm.imp} f1={pm.imp > 0 ? fmt(pm.imp) : ""} f2={cm.imp > 0 ? fmt(cm.imp) : ""} />
                  <CompRow label="Cliques" v1={pm.clk} v2={cm.clk} f1={pm.clk > 0 ? fmt(pm.clk) : ""} f2={cm.clk > 0 ? fmt(cm.clk) : ""} />
                  <CompRow label="Hook Rate" v1={pm.hook} v2={cm.hook} f1={pm.hook > 0 ? formatPercent(pm.hook) : ""} f2={cm.hook > 0 ? formatPercent(cm.hook) : ""} />
                  <CompRow label="Faturamento" v1={pm.fat} v2={cm.fat} f1={pm.fat > 0 ? formatCurrency(pm.fat) : ""} f2={cm.fat > 0 ? formatCurrency(cm.fat) : ""} />
                  <CompRow label="Vendas" v1={pm.ven} v2={cm.ven} f1={pm.ven > 0 ? fmt(pm.ven) : ""} f2={cm.ven > 0 ? fmt(cm.ven) : ""} />

                  {/* Calculated */}
                  <tr className="bg-brand-50/40 dark:bg-brand-950/20">
                    <td colSpan={4} className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-500 dark:text-brand-600">
                      Calculados
                    </td>
                  </tr>
                  <CompRow label="CPM" v1={pm.cpm} v2={cm.cpm} f1={pm.cpm > 0 ? formatCurrency(pm.cpm) : ""} f2={cm.cpm > 0 ? formatCurrency(cm.cpm) : ""} invert />
                  <CompRow label="CPC" v1={pm.cpc} v2={cm.cpc} f1={pm.cpc > 0 ? formatCurrency(pm.cpc) : ""} f2={cm.cpc > 0 ? formatCurrency(cm.cpc) : ""} invert />
                  <CompRow label="Custo / Mensagem" v1={pm.custoMsg} v2={cm.custoMsg} f1={pm.custoMsg > 0 ? formatCurrency(pm.custoMsg) : ""} f2={cm.custoMsg > 0 ? formatCurrency(cm.custoMsg) : ""} invert />
                  <CompRow label="Taxa de Conversão" v1={pm.taxaConv} v2={cm.taxaConv} f1={pm.taxaConv > 0 ? formatPercent(pm.taxaConv) : ""} f2={cm.taxaConv > 0 ? formatPercent(cm.taxaConv) : ""} />
                  <CompRow label="CTR" v1={pm.ctr} v2={cm.ctr} f1={pm.ctr > 0 ? formatPercent(pm.ctr) : ""} f2={cm.ctr > 0 ? formatPercent(cm.ctr) : ""} />
                  <CompRow label="Taxa Conv. Vendas" v1={pm.taxaConvVendas} v2={cm.taxaConvVendas} f1={pm.taxaConvVendas > 0 ? formatPercent(pm.taxaConvVendas) : ""} f2={cm.taxaConvVendas > 0 ? formatPercent(cm.taxaConvVendas) : ""} />
                  <CompRow label="Ticket Médio" v1={pm.ticketMedio} v2={cm.ticketMedio} f1={pm.ticketMedio > 0 ? formatCurrency(pm.ticketMedio) : ""} f2={cm.ticketMedio > 0 ? formatCurrency(cm.ticketMedio) : ""} />
                  <CompRow label="ROI" v1={pm.roi} v2={cm.roi} f1={pm.roi > 0 ? `${pm.roi.toFixed(1)}×` : ""} f2={cm.roi > 0 ? `${cm.roi.toFixed(1)}×` : ""} />
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
