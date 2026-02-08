"use client";

import type { DifferentialItem } from "@/types";

interface DifferentialDiagnosisProps {
  items: DifferentialItem[];
}

export default function DifferentialDiagnosis({ items }: DifferentialDiagnosisProps) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-surface rounded-2xl border border-border-light shadow-sm p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    );
  }

  const getBarColor = (pct: number) => {
    if (pct >= 70) return "bg-primary";
    if (pct >= 40) return "bg-amber-400";
    return "bg-gray-300";
  };

  return (
    <div className="bg-surface rounded-2xl border border-border-light shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border-light flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[20px]">diagnosis</span>
        <h3 className="text-sm font-bold text-text-primary">Differential Diagnosis</h3>
        <span className="ml-auto px-2 py-0.5 bg-primary-light text-primary text-[10px] font-semibold rounded-full">
          AI Suggested
        </span>
      </div>

      <div className="px-5 py-4 space-y-3">
        {items.map((item, i) => (
          <div key={i} className="group">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-text-primary">{item.condition}</p>
              <span className={`text-xs font-bold ${item.match_pct >= 70 ? "text-primary" : item.match_pct >= 40 ? "text-amber-600" : "text-text-secondary"}`}>
                {item.match_pct}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full mb-1.5">
              <div
                className={`h-full rounded-full transition-all ${getBarColor(item.match_pct)}`}
                style={{ width: `${item.match_pct}%` }}
              />
            </div>
            <p className="text-xs text-text-secondary">{item.reasoning}</p>
          </div>
        ))}

        <div className="mt-3 pt-3 border-t border-border-light">
          <p className="text-[10px] text-text-secondary italic">
            AI-generated suggestions for reference only. Clinical judgment is required.
          </p>
        </div>
      </div>
    </div>
  );
}
