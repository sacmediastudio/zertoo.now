"use client";

import { useState } from "react";
import { SOFT_SHADOW } from "@/lib/eats-ui";

export interface SheetOption {
  value: string;
  label: string;
}

// Selector que abre una "hoja" desde abajo — equivalente a
// CategorySelect / PriceRangeSelect de la app nativa.
export default function SelectSheet({
  options,
  value,
  onChange,
  allLabel,
  title,
  grow,
}: {
  options: SheetOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  allLabel: string;
  title: string;
  grow?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selectedLabel = value ? options.find((o) => o.value === value)?.label ?? allLabel : allLabel;

  function select(next: string | null) {
    onChange(next);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex items-center justify-between gap-1.5 rounded-[14px] bg-white px-3.5 py-[11px] text-[13px] font-semibold text-graphite ${SOFT_SHADOW} ${grow ? "flex-1 min-w-0" : "min-w-[58px] justify-center"}`}
      >
        <span className={grow ? "flex-1 truncate text-left" : ""}>{selectedLabel}</span>
        <span className="text-xs text-graphite/50">▾</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-xl rounded-t-[20px] bg-white px-5 pb-8 pt-[18px]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-2 text-[13px] font-bold uppercase tracking-wider text-graphite/50">{title}</p>
            <div className="max-h-[360px] overflow-y-auto">
              {[{ value: "", label: allLabel }, ...options].map((o) => {
                const active = o.value === "" ? !value : value === o.value;
                return (
                  <button
                    key={o.value || "all"}
                    type="button"
                    onClick={() => select(o.value === "" ? null : o.value)}
                    className="flex w-full items-center justify-between border-b border-graphite/10 py-3.5 text-left text-[15px] text-graphite"
                  >
                    <span className={active ? "font-bold" : ""}>{o.label}</span>
                    {active && <span className="font-bold">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
