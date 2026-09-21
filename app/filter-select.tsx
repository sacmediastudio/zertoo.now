"use client";

import { useEffect, useRef, useState } from "react";

export interface FilterOption {
  value: string;
  label: string;
}

// Versión web del selector con lista desplegable que usa la app móvil
// (CategorySelect/PriceRangeSelect) — acá en vez de un modal nativo es
// un panel flotante posicionado debajo del trigger, que se cierra solo
// al hacer click afuera.
export default function FilterSelect({
  options,
  value,
  onChange,
  allLabel,
  title,
}: {
  options: FilterOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  allLabel: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const selectedLabel = value ? options.find((o) => o.value === value)?.label ?? allLabel : allLabel;

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function select(next: string | null) {
    onChange(next);
    setOpen(false);
  }

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 bg-white shadow-[0_4px_20px_-8px_rgba(0,0,0,0.12)] rounded-full px-3.5 py-1.5 text-xs font-semibold text-graphite max-w-[160px]"
      >
        <span className="truncate">{selectedLabel}</span>
        <span className="text-graphite/40 text-[10px] shrink-0">▾</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-56 max-h-72 overflow-y-auto bg-white rounded-xl shadow-[0_8px_30px_-6px_rgba(0,0,0,0.25)] py-1.5">
          <p className="px-4 pt-1 pb-2 text-[11px] font-bold uppercase tracking-widest text-graphite/50">{title}</p>
          <button
            type="button"
            onClick={() => select(null)}
            className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-[#F7F8F4] ${
              !value ? "font-bold text-graphite" : "text-graphite/80"
            }`}
          >
            {allLabel}
            {!value && <span>✓</span>}
          </button>
          {options.map((o) => (
            <button
              type="button"
              key={o.value}
              onClick={() => select(o.value)}
              className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-[#F7F8F4] ${
                value === o.value ? "font-bold text-graphite" : "text-graphite/80"
              }`}
            >
              {o.label}
              {value === o.value && <span>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
