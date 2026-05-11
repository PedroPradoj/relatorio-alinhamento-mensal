"use client";

interface YearSelectorProps {
  year: number;
  onYearChange: (year: number) => void;
}

export default function YearSelector({ year, onYearChange }: YearSelectorProps) {
  const currentYear = new Date().getFullYear();
  const minYear = 2020;
  const maxYear = currentYear + 2;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => year > minYear && onYearChange(year - 1)}
        disabled={year <= minYear}
        className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold transition-all text-sm"
        aria-label="Ano anterior"
      >
        ‹
      </button>

      <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-1.5">
        <span className="text-white font-bold text-lg leading-none">{year}</span>
        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="sr-only"
          aria-label="Selecionar ano"
        >
          {Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).map(
            (y) => (
              <option key={y} value={y}>
                {y}
              </option>
            )
          )}
        </select>
      </div>

      <button
        onClick={() => year < maxYear && onYearChange(year + 1)}
        disabled={year >= maxYear}
        className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold transition-all text-sm"
        aria-label="Próximo ano"
      >
        ›
      </button>
    </div>
  );
}
