import { AllData, MonthData, EMPTY_MONTH, Client, ClientsIndex } from "@/types";

const CLIENTS_KEY = "relatorio-clientes";

function clientDataKey(clientId: string) {
  return `relatorio-data-${clientId}`;
}

// ── Clients ────────────────────────────────────────────────────────────────

export function loadClients(): ClientsIndex {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CLIENTS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ClientsIndex;
  } catch {
    return {};
  }
}

export function saveClient(client: Client): void {
  if (typeof window === "undefined") return;
  try {
    const clients = loadClients();
    clients[client.id] = client;
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
  } catch {
    console.error("Failed to save client");
  }
}

export function deleteClient(clientId: string): void {
  if (typeof window === "undefined") return;
  try {
    const clients = loadClients();
    delete clients[clientId];
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
    localStorage.removeItem(clientDataKey(clientId));
  } catch {
    console.error("Failed to delete client");
  }
}

export function generateClientId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── Per-client report data ─────────────────────────────────────────────────

export function loadData(clientId: string): AllData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(clientDataKey(clientId));
    if (!raw) return {};
    return JSON.parse(raw) as AllData;
  } catch {
    return {};
  }
}

export function saveData(clientId: string, data: AllData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(clientDataKey(clientId), JSON.stringify(data));
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
  if (!updated[year]) updated[year] = {};
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
