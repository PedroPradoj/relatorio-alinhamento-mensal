export interface MonthData {
  investimento: string;
  mensagens: string;
  impressoes: string;
  cliques: string;
  hookRate: string;
  faturamento: string;
  vendas: string;
}

export type YearData = Record<number, MonthData>; // key = 0-11 (month index)
export type AllData = Record<number, YearData>; // key = year

export const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const EMPTY_MONTH: MonthData = {
  investimento: "",
  mensagens: "",
  impressoes: "",
  cliques: "",
  hookRate: "",
  faturamento: "",
  vendas: "",
};
