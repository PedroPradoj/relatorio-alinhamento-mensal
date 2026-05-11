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
} from "./calculations";

interface ComputedRow {
  month: string;
  investimento: number;
  mensagens: number;
  impressoes: number;
  cliques: number;
  hookRate: number;
  custoPorMensagem: number;
  cpc: number;
  taxaConversao: number;
  cpm: number;
  ctr: number;
  faturamento: number;
  vendas: number;
  taxaConversaoVendas: number;
  ticketMedio: number;
}

function buildRows(data: AllData, year: number): ComputedRow[] {
  return MONTH_NAMES.map((name, idx) => {
    const m: MonthData = data?.[year]?.[idx] ?? { ...EMPTY_MONTH };
    const inv = parseField(m.investimento);
    const msg = parseField(m.mensagens);
    const imp = parseField(m.impressoes);
    const clk = parseField(m.cliques);
    const hook = parseField(m.hookRate);
    const fat = parseField(m.faturamento);
    const ven = parseField(m.vendas);

    return {
      month: name,
      investimento: inv,
      mensagens: msg,
      impressoes: imp,
      cliques: clk,
      hookRate: hook,
      custoPorMensagem: calcCustoPorMensagem(inv, msg),
      cpc: calcCPC(inv, clk),
      taxaConversao: calcTaxaConversao(msg, clk),
      cpm: calcCPM(inv, imp),
      ctr: calcCTR(clk, imp),
      faturamento: fat,
      vendas: ven,
      taxaConversaoVendas: calcTaxaConversaoVendas(ven, msg),
      ticketMedio: calcTicketMedio(fat, ven),
    };
  });
}

function fmt(val: number, type: "currency" | "percent" | "number"): string {
  if (val === 0) return "—";
  if (type === "currency") {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  }
  if (type === "percent") {
    return (
      new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(val) + "%"
    );
  }
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
}

export async function exportToPDF(data: AllData, year: number): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const rows = buildRows(data, year);

  // Title
  doc.setFontSize(16);
  doc.setTextColor(79, 70, 229);
  doc.text(`Relatório Mensal — Meta Ads ${year}`, 14, 16);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em ${new Date().toLocaleDateString("pt-BR")}`, 14, 22);

  // Campaign table
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Campanhas Meta Ads", 14, 32);

  autoTable(doc, {
    startY: 36,
    head: [
      [
        "Mês",
        "Investimento",
        "Mensagens",
        "Impressões",
        "Cliques",
        "Hook Rate",
        "Custo/Msg",
        "CPC",
        "Taxa Conv.",
        "CPM",
        "CTR",
      ],
    ],
    body: rows.map((r) => [
      r.month,
      fmt(r.investimento, "currency"),
      fmt(r.mensagens, "number"),
      fmt(r.impressoes, "number"),
      fmt(r.cliques, "number"),
      r.hookRate > 0 ? fmt(r.hookRate, "percent") : "—",
      fmt(r.custoPorMensagem, "currency"),
      fmt(r.cpc, "currency"),
      fmt(r.taxaConversao, "percent"),
      fmt(r.cpm, "currency"),
      fmt(r.ctr, "percent"),
    ]),
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 243, 255] },
    theme: "grid",
  });

  const afterCampaign = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // Sales table
  doc.setFontSize(12);
  doc.text("Vendas", 14, afterCampaign);

  autoTable(doc, {
    startY: afterCampaign + 4,
    head: [
      [
        "Mês",
        "Faturamento",
        "Vendas",
        "Taxa Conv. Vendas",
        "Ticket Médio",
      ],
    ],
    body: rows.map((r) => [
      r.month,
      fmt(r.faturamento, "currency"),
      fmt(r.vendas, "number"),
      fmt(r.taxaConversaoVendas, "percent"),
      fmt(r.ticketMedio, "currency"),
    ]),
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [236, 253, 245] },
    theme: "grid",
  });

  doc.save(`relatorio-meta-ads-${year}.pdf`);
}

export async function exportToExcel(data: AllData, year: number): Promise<void> {
  const XLSX = await import("xlsx");
  const rows = buildRows(data, year);

  const headers = [
    "Mês",
    "Investimento (R$)",
    "Mensagens",
    "Impressões",
    "Cliques",
    "Hook Rate (%)",
    "Custo por Mensagem (R$)",
    "CPC (R$)",
    "Taxa de Conversão (%)",
    "CPM (R$)",
    "CTR (%)",
    "Faturamento (R$)",
    "Vendas",
    "Taxa de Conversão de Vendas (%)",
    "Ticket Médio (R$)",
  ];

  const sheetData = [
    headers,
    ...rows.map((r) => [
      r.month,
      r.investimento || "",
      r.mensagens || "",
      r.impressoes || "",
      r.cliques || "",
      r.hookRate || "",
      r.custoPorMensagem || "",
      r.cpc || "",
      r.taxaConversao || "",
      r.cpm || "",
      r.ctr || "",
      r.faturamento || "",
      r.vendas || "",
      r.taxaConversaoVendas || "",
      r.ticketMedio || "",
    ]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Column widths
  ws["!cols"] = [
    { wch: 14 },
    { wch: 16 },
    { wch: 12 },
    { wch: 12 },
    { wch: 10 },
    { wch: 12 },
    { wch: 22 },
    { wch: 12 },
    { wch: 20 },
    { wch: 12 },
    { wch: 10 },
    { wch: 16 },
    { wch: 10 },
    { wch: 28 },
    { wch: 16 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Relatório ${year}`);
  XLSX.writeFile(wb, `relatorio-meta-ads-${year}.xlsx`);
}
