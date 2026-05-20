import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { AllData } from "@/types";
import ClientView from "@/components/ClientView";

async function getClientData(clientId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: clientRow, error: clientError } = await supabase
    .from("clients")
    .select("id, name")
    .eq("id", clientId)
    .single();

  if (clientError || !clientRow) return null;

  const { data: reports } = await supabase
    .from("monthly_reports")
    .select("*")
    .eq("client_id", clientId);

  const allData: AllData = {};
  for (const row of reports ?? []) {
    if (!allData[row.year]) allData[row.year] = {};
    allData[row.year][row.month] = {
      investimento: row.investimento ?? "",
      mensagens: row.mensagens ?? "",
      impressoes: row.impressoes ?? "",
      cliques: row.cliques ?? "",
      hookRate: row.hook_rate ?? "",
      faturamento: row.faturamento ?? "",
      vendas: row.vendas ?? "",
    };
  }

  return { name: clientRow.name as string, allData };
}

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getClientData(id);

  if (!result) notFound();

  return (
    <ClientView
      clientId={id}
      clientName={result.name}
      initialData={result.allData}
    />
  );
}
