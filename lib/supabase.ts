import { createClient } from "@supabase/supabase-js";
import { AllData, Client, ClientsIndex, MonthData } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ── Clients ────────────────────────────────────────────────────────────────

export async function fetchClients(): Promise<ClientsIndex> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return {};

  return data.reduce<ClientsIndex>((acc, row) => {
    acc[row.id] = { id: row.id, name: row.name, createdAt: row.created_at };
    return acc;
  }, {});
}

export async function createClient_(client: Client): Promise<void> {
  const { error } = await supabase.from("clients").insert({
    id: client.id,
    name: client.name,
    created_at: client.createdAt,
  });
  if (error) console.error("createClient_ error:", error);
}


export async function removeClient(clientId: string): Promise<void> {
  await supabase.from("monthly_reports").delete().eq("client_id", clientId);
  await supabase.from("clients").delete().eq("id", clientId);
}

// ── Monthly reports ────────────────────────────────────────────────────────

export async function fetchClientData(clientId: string): Promise<AllData> {
  const { data, error } = await supabase
    .from("monthly_reports")
    .select("*")
    .eq("client_id", clientId);

  if (error || !data) return {};

  const result: AllData = {};
  for (const row of data) {
    if (!result[row.year]) result[row.year] = {};
    result[row.year][row.month] = {
      investimento: row.investimento ?? "",
      mensagens: row.mensagens ?? "",
      impressoes: row.impressoes ?? "",
      cliques: row.cliques ?? "",
      hookRate: row.hook_rate ?? "",
      faturamento: row.faturamento ?? "",
      vendas: row.vendas ?? "",
    };
  }
  return result;
}

export async function upsertMonth(
  clientId: string,
  year: number,
  month: number,
  data: MonthData
): Promise<void> {
  await supabase.from("monthly_reports").upsert(
    {
      client_id: clientId,
      year,
      month,
      investimento: data.investimento,
      mensagens: data.mensagens,
      impressoes: data.impressoes,
      cliques: data.cliques,
      hook_rate: data.hookRate,
      faturamento: data.faturamento,
      vendas: data.vendas,
    },
    { onConflict: "client_id,year,month" }
  );
}
