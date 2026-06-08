"use client";

import { useState } from "react";
import { AllData } from "@/types";

interface ExportButtonsProps {
  data: AllData;
  year: number;
}

export default function ExportButtons({ data, year }: ExportButtonsProps) {
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);

  async function handlePDF() {
    setLoadingPDF(true);
    try {
      const { exportToPDF } = await import("@/lib/export");
      await exportToPDF(data, year);
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setLoadingPDF(false);
    }
  }

  async function handleExcel() {
    setLoadingExcel(true);
    try {
      const { exportToExcel } = await import("@/lib/export");
      await exportToExcel(data, year);
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar Excel. Tente novamente.");
    } finally {
      setLoadingExcel(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handlePDF}
        disabled={loadingPDF}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-400 to-brand-500 text-[#1A1306] text-sm font-semibold hover:shadow-gold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loadingPDF ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
        PDF
      </button>

      <button
        onClick={handleExcel}
        disabled={loadingExcel}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed border border-white/20"
      >
        {loadingExcel ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
        Excel
      </button>
    </div>
  );
}
