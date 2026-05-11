export function calcCustoPorMensagem(inv: number, msg: number): number {
  return msg > 0 ? inv / msg : 0;
}

export function calcCPC(inv: number, clicks: number): number {
  return clicks > 0 ? inv / clicks : 0;
}

export function calcTaxaConversao(msg: number, clicks: number): number {
  return clicks > 0 ? (msg / clicks) * 100 : 0;
}

export function calcCPM(inv: number, imp: number): number {
  return imp > 0 ? (inv / imp) * 1000 : 0;
}

export function calcCTR(clicks: number, imp: number): number {
  return imp > 0 ? (clicks / imp) * 100 : 0;
}

export function calcTaxaConversaoVendas(vendas: number, msg: number): number {
  return msg > 0 ? (vendas / msg) * 100 : 0;
}

export function calcTicketMedio(fat: number, vendas: number): number {
  return vendas > 0 ? fat / vendas : 0;
}

export function calcPercentChange(
  current: number,
  previous: number
): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export function formatCurrency(value: number): string {
  if (value === 0) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  if (value === 0) return "—";
  return (
    new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value) + "%"
  );
}

export function formatNumber(value: number, decimals = 2): string {
  if (value === 0) return "—";
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function parseField(val: string): number {
  const cleaned = val.replace(",", ".");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
