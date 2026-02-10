"use client";

import { useEffect, useState } from "react";
import { getPatients, getTodaysAppointments } from "@/lib/api";
import { useUser } from "@/components/providers/user-provider";
import { StatCard } from "@/components/dashboard/stat-card";
import { TodaysSchedule } from "@/components/dashboard/todays-schedule";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Users, CalendarCheck, CheckCircle } from "lucide-react";
import type { Patient, Appointment } from "@/types";

export default function HomePage() {
  const user = useUser();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [pData, aData] = await Promise.all([
          getPatients(),
          getTodaysAppointments(),
        ]);
        setPatients(pData.patients || []);
        setAppointments(aData.appointments || []);
      } catch {
        // Graceful degradation
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const completedToday = appointments.filter(
    (a) => a.status === "completed"
  ).length;

  const patientNames: Record<string, string> = {};
  for (const p of patients) {
    patientNames[p.id] = p.name;
  }

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">
          {greeting}, {user.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s your clinic overview for today
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Patients"
          value={loading ? "..." : patients.length}
          icon={Users}
        />
        <StatCard
          title="Today's Appointments"
          value={loading ? "..." : appointments.length}
          icon={CalendarCheck}
        />
        <StatCard
          title="Completed Today"
          value={loading ? "..." : completedToday}
          icon={CheckCircle}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TodaysSchedule
            appointments={appointments}
            patientNames={patientNames}
          />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
