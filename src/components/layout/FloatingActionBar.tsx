"use client";

import { useRouter } from "next/navigation";

interface FloatingActionBarProps {
  patientId: string;
}

export default function FloatingActionBar({ patientId }: FloatingActionBarProps) {
  const router = useRouter();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-2 bg-surface rounded-full shadow-lg border border-border-light px-2 py-2">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-text-secondary hover:bg-gray-100 transition">
          <span className="material-symbols-outlined text-[20px]">edit_note</span>
          Manual Note
        </button>

        <button
          onClick={() => router.push(`/consult/${patientId}`)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition shadow-md"
        >
          <span className="material-symbols-outlined text-[20px]">mic</span>
          Start Voice Session
        </button>

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-text-secondary hover:bg-gray-100 transition">
          <span className="material-symbols-outlined text-[20px]">medication</span>
          Prescribe
        </button>

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-text-secondary hover:bg-gray-100 transition">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          Mark as Seen
        </button>
      </div>
    </div>
  );
}
