"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getPatient } from "@/lib/api";
import type { PatientPageData } from "@/types";
import PatientProfile from "@/components/patient/PatientProfile";
import AIIntakeSummary from "@/components/patient/AIIntakeSummary";
import ReportInsights from "@/components/patient/ReportInsights";
import DifferentialDiagnosis from "@/components/patient/DifferentialDiagnosis";
import AskAIPanel from "@/components/patient/AskAIPanel";
import FloatingActionBar from "@/components/layout/FloatingActionBar";

export default function PatientPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const patientId = params.id as string;
  const appointmentId = searchParams.get("appointment") || undefined;
  const [data, setData] = useState<PatientPageData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPatient = useCallback(async () => {
    try {
      const result = await getPatient(patientId);
      setData(result);
    } catch {
      // Fallback will show error message
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    loadPatient();
  }, [loadPatient]);

  // Get the first today's appointment ID if none provided
  const currentAppointmentId = appointmentId ||
    data?.appointments?.find(a => a.status === "scheduled")?.id;

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-12 gap-5">
          {[3, 5, 4].map((span) => (
            <div key={span} className={`col-span-${span}`}>
              <div className="bg-surface rounded-2xl border border-border-light shadow-sm p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <span className="material-symbols-outlined text-gray-300 text-[48px] mb-3 block">error</span>
          <p className="text-text-secondary">Could not load patient data. Is the backend running?</p>
          <p className="text-xs text-text-secondary mt-1">Run: cd backend && uvicorn main:app --reload</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24">
      {/* Page Title */}
      <div className="mb-5 flex items-center gap-3">
        <h1 className="text-lg font-bold text-text-primary">Patient Overview</h1>
        <span className="text-xs text-text-secondary">
          Last updated: {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {/* 12-Column Grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left Column — 3/12 */}
        <div className="col-span-3">
          <PatientProfile patient={data.patient} />
        </div>

        {/* Center Column — 5/12 */}
        <div className="col-span-5 space-y-5">
          <AIIntakeSummary summary={data.ai_intake_summary} patientId={patientId} onRefresh={loadPatient} />
          <ReportInsights insights={data.report_insights} documents={data.documents} />
        </div>

        {/* Right Column — 4/12 */}
        <div className="col-span-4 space-y-5">
          <DifferentialDiagnosis items={data.differential_diagnosis} patientId={patientId} />
          <AskAIPanel patientId={patientId} />
        </div>
      </div>

      {/* Floating Action Bar */}
      <FloatingActionBar
        patientId={patientId}
        patientName={data.patient.name}
        appointmentId={currentAppointmentId}
        onRefresh={loadPatient}
      />
    </div>
  );
}
