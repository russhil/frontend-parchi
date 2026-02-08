"use client";

import { useRouter } from "next/navigation";

const demoAppointments = [
  {
    id: "a1",
    patientId: "p1",
    patientName: "Sarah Jenkins",
    time: "9:30 AM",
    reason: "Follow-up: Migraine",
    status: "scheduled",
    initials: "SJ",
  },
  {
    id: "a2",
    patientId: "p1",
    patientName: "Sarah Jenkins",
    time: "11:00 AM",
    reason: "Routine check",
    status: "tomorrow",
    initials: "SJ",
  },
];

export default function TodayAppointments() {
  const router = useRouter();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-surface rounded-2xl border border-border-light shadow-sm">
        <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
          <h3 className="text-sm font-bold text-text-primary">Today&apos;s Appointments</h3>
          <span className="text-xs text-text-secondary font-medium">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
          </span>
        </div>

        <div className="divide-y divide-border-light">
          {demoAppointments.map((apt) => (
            <button
              key={apt.id}
              onClick={() => router.push(`/patient/${apt.patientId}`)}
              className="w-full text-left px-5 py-4 hover:bg-gray-50 transition flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-sm">
                {apt.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">{apt.patientName}</p>
                <p className="text-xs text-text-secondary mt-0.5">{apt.reason}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-text-primary">{apt.time}</p>
                <span
                  className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 ${
                    apt.status === "scheduled"
                      ? "bg-primary-light text-primary"
                      : "bg-gray-100 text-text-secondary"
                  }`}
                >
                  {apt.status === "scheduled" ? "Today" : "Tomorrow"}
                </span>
              </div>
              <span className="material-symbols-outlined text-text-secondary text-[20px]">chevron_right</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
