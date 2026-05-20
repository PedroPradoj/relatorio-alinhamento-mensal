"use client";

import { useEffect, useState } from "react";
import { Client, ClientsIndex } from "@/types";
import { generateClientId } from "@/lib/storage";
import { fetchClients, createClient_, removeClient } from "@/lib/supabase";
import ClientSelector from "@/components/ClientSelector";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [clients, setClients] = useState<ClientsIndex>({});
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    fetchClients().then((data) => {
      setClients(data);
      setHydrated(true);
    });
  }, []);

  async function handleCreate(name: string) {
    const client: Client = {
      id: generateClientId(),
      name,
      createdAt: new Date().toISOString(),
    };
    await createClient_(client);
    setClients((prev) => ({ ...prev, [client.id]: client }));
    setSelectedClient(client);
  }

  async function handleDelete(clientId: string) {
    await removeClient(clientId);
    setClients((prev) => {
      const next = { ...prev };
      delete next[clientId];
      return next;
    });
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (selectedClient) {
    return (
      <Dashboard
        clientId={selectedClient.id}
        clientName={selectedClient.name}
        onBack={() => setSelectedClient(null)}
      />
    );
  }

  return (
    <ClientSelector
      clients={clients}
      onSelect={setSelectedClient}
      onCreate={handleCreate}
      onDelete={handleDelete}
    />
  );
}
