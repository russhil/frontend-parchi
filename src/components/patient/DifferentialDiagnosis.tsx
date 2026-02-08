"use client";
import { useState } from "react";
import type { DifferentialItem } from "@/types";

interface DifferentialDiagnosisProps {
  items: DifferentialItem[];
  patientId: string;
}

export default function DifferentialDiagnosis({ items: initialItems, patientId }: DifferentialDiagnosisProps) {
  const [items, setItems] = useState<DifferentialItem[]>(initialItems);
  const [loading, setLoading] = useState(false);

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/ai/generate-differential/${patientId}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.status === "success") {
        setItems(data.data);
      }
    } catch (e) {
      console.error("Failed to regenerate", e);
    } finally {
      setLoading(false);
    }
  };

  const currentItems = items || [];

  return (
    <div className="bg-surface rounded-2xl border border-border-light shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">lightbulb</span>
          <h3 className="text-[15px] font-bold text-text-primary">Differential Diagnosis</h3>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={loading}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          title="Regenerate with AI"
        >
          <span className={`material-symbols-outlined text-gray-400 text-[18px] ${loading ? 'animate-spin' : ''}`}>
            refresh
          </span>
        </button>
      </div>

      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        {currentItems.length === 0 && !loading ? (
          <div className="text-center py-6 text-text-secondary text-sm">
            No differential diagnosis generated yet.
            <button onClick={handleRegenerate} className="block mx-auto mt-2 text-primary font-medium hover:underline">
              Generate Now
            </button>
          </div>
        ) : (
          currentItems.map((item, i) => (
            <div key={i} className="border border-indigo-50 bg-indigo-50/30 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-[14px] font-semibold text-text-primary">
                    {item.condition_name || item.condition}
                  </span>
                </div>
                <span className={`text-[12px] font-bold ${item.match_pct >= 80 ? 'text-primary' : 'text-slate-500'}`}>
                  {item.match_pct >= 80 ? `${item.match_pct}% Match` : 'Low Match'}
                </span>
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed pl-4">
                {item.rationale}
              </p>
            </div>
          ))
        )}

        {loading && currentItems.length === 0 && (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-50 rounded-xl border border-gray-100" />
            ))}
          </div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-border-light bg-gray-50/50">
        <p className="text-[10px] text-slate-400 italic text-center">
          * Suggestions require clinical validation.
        </p>
      </div>
    </div>
  );
}
