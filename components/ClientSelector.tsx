"use client";

import { useState } from "react";
import { Client, ClientsIndex } from "@/types";
import ThemeToggle from "./ThemeToggle";
import NewClientModal from "./NewClientModal";

interface ClientSelectorProps {
  clients: ClientsIndex;
  onSelect: (client: Client) => void;
  onCreate: (name: string) => void;
  onDelete: (clientId: string) => void;
}

const AVATAR_COLORS = [
  "from-brand-500 to-brand-700",
  "from-emerald-400 to-teal-500",
  "from-orange-400 to-rose-500",
  "from-sky-400 to-blue-500",
  "from-amber-400 to-brand-600",
  "from-amber-400 to-orange-500",
];

function getAvatarColor(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ClientSelector({
  clients,
  onSelect,
  onCreate,
  onDelete,
}: ClientSelectorProps) {
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopyLink(e: React.MouseEvent, clientId: string) {
    e.stopPropagation();
    const url = `${window.location.origin}/c/${clientId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(clientId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const clientList = Object.values(clients).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  function handleCreate(name: string) {
    onCreate(name);
    setShowModal(false);
  }

  function handleDelete(clientId: string) {
    onDelete(clientId);
    setDeleteConfirm(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50/20 to-stone-100 dark:from-[#0D0D0F] dark:via-[#101013] dark:to-[#0D0D0F] transition-colors duration-300">
      {/* Header */}
      <header className="bg-[#101013] border-b border-brand-700/50 shadow-2xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-inner shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight tracking-tight">
                  Relatório Mensal
                </h1>
                <p className="text-brand-300 text-sm font-medium mt-0.5">
                  Meta Ads · Social Media Manager
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-brand-700 text-sm font-bold hover:bg-brand-50 transition-all shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Novo Cliente
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {clientList.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-3xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Nenhum cliente ainda
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
              Crie o primeiro cliente para começar a registrar os relatórios mensais.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-brand-400 to-brand-500 text-[#1A1306] font-semibold hover:shadow-gold transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Criar primeiro cliente
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">
                {clientList.length} {clientList.length === 1 ? "cliente" : "clientes"}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientList.map((client) => (
                <div
                  key={client.id}
                  className="group bg-white dark:bg-[#15151A] rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 dark:border-white/5 hover:border-brand-300 dark:hover:border-brand-700/40"
                  onClick={() => onSelect(client)}
                >
                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      {/* Avatar */}
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getAvatarColor(client.name)} flex items-center justify-center shadow-lg shrink-0`}
                      >
                        <span className="text-white font-extrabold text-lg leading-none">
                          {getInitials(client.name)}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        {/* Copy link button */}
                        <button
                          onClick={(e) => handleCopyLink(e, client.id)}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                            copiedId === client.id
                              ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-500"
                              : "text-gray-300 dark:text-gray-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 hover:text-brand-500 dark:hover:text-brand-400"
                          }`}
                          aria-label="Copiar link do cliente"
                        >
                          {copiedId === client.id ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          )}
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm(client.id);
                          }}
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-300 dark:text-gray-600 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-500 dark:hover:text-red-400 transition-all"
                          aria-label="Excluir cliente"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 leading-tight mb-1">
                        {client.name}
                      </h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Criado em {formatDate(client.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-brand-500 dark:text-brand-400 text-xs font-semibold group-hover:gap-2.5 transition-all">
                      <span>Ver relatórios</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* New client modal */}
      {showModal && (
        <NewClientModal onConfirm={handleCreate} onClose={() => setShowModal(false)} />
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}
        >
          <div className="bg-white dark:bg-[#15151A] rounded-2xl border border-gray-100 dark:border-white/5 shadow-2xl w-full max-w-sm p-8 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Excluir cliente?</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Todos os dados de{" "}
                  <strong>{clients[deleteConfirm]?.name}</strong> serão apagados permanentemente.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
