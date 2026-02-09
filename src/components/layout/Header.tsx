"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { search } from "@/lib/api";

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      const data = await search(query);
      if (data.results.length > 0) {
        router.push(`/patient/${data.results[0].patient_id}?search=${encodeURIComponent(query)}`);
      }
    } catch {
      // In demo mode, navigate to demo patient
      router.push(`/patient/p1?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="h-16 bg-surface border-b border-border-light flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-text-primary">Parchi.ai</h1>
        <span className="text-xs font-medium text-text-secondary bg-primary-light text-primary px-2 py-0.5 rounded-full">
          AI-Powered
        </span>
      </div>

      <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search patients, records, diagnoses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg rounded-xl border border-border-light text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
        </div>
      </form>

      <div className="flex items-center gap-4">
        <button className="relative text-text-secondary hover:text-text-primary transition">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">
            YC
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight">YC</p>
            <p className="text-xs text-text-secondary leading-tight">General Physician</p>
          </div>
        </div>
      </div>
    </header>
  );
}
