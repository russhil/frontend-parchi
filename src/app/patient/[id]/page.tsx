"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { getPatient } from "@/lib/api";
import type { PatientPageData } from "@/types";
import PatientProfile from "@/components/patient/PatientProfile";
import AIIntakeSummary from "@/components/patient/AIIntakeSummary";
import ReportInsights from "@/components/patient/ReportInsights";
import DifferentialDiagnosis from "@/components/patient/DifferentialDiagnosis";
import AskAIPanel from "@/components/patient/AskAIPanel";
import Link from "next/link";

export default function PatientPage() {
  const params = useParams();
  const patientId = params.id as string;
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-12 gap-5">
          {[4, 8].map((span) => (
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

  const appointments = data.appointments_summary || data.appointments || [];
  const hasSummary = data.ai_intake_summary && (
    data.ai_intake_summary.chief_complaint ||
    data.ai_intake_summary.onset ||
    data.ai_intake_summary.severity ||
    (data.ai_intake_summary.findings && data.ai_intake_summary.findings.length > 0)
  );
  const hasDocuments = data.documents && data.documents.length > 0;
  const hasDifferential = data.differential_diagnosis && data.differential_diagnosis.filter(
    item => item.condition && item.condition.trim() !== ""
  ).length > 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return { bg: "bg-green-100", text: "text-green-700", label: "Completed" };
      case "in-progress":
        return { bg: "bg-amber-100", text: "text-amber-700", label: "In Progress" };
      case "cancelled":
        return { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" };
      default:
        return { bg: "bg-primary-light", text: "text-primary", label: "Scheduled" };
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    } catch {
      return isoString;
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="p-6">
      {/* Page Title */}
      <div className="mb-5 flex items-center gap-3">
        <h1 className="text-lg font-bold text-text-primary">Patient Overview</h1>
        <span className="text-xs text-text-secondary">
          Last updated: {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left Sidebar — 4/12 */}
        <div className="col-span-12 lg:col-span-4 space-y-5">
          <PatientProfile patient={data.patient} />
        </div>

        {/* Main Content — 8/12 */}
        <div className="col-span-12 lg:col-span-8 space-y-5">
          {/* Appointments Card */}
          <div className="bg-surface rounded-2xl border border-border-light shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border-light flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
              <h3 className="text-sm font-bold text-text-primary">Appointments</h3>
              <span className="ml-auto text-xs text-text-secondary">{appointments.length} total</span>
            </div>
            {appointments.length > 0 ? (
              <div className="divide-y divide-border-light">
                {appointments.map((appt) => {
                  const badge = getStatusBadge(appt.status);
                  return (
                    <Link
                      key={appt.id}
                      href={`/appointment/${appt.id}`}
                      className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-primary text-[18px]">event</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate">
                            {appt.reason || "General consultation"}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {formatDate(appt.start_time)} {formatTime(appt.start_time) && `at ${formatTime(appt.start_time)}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                        <span className="material-symbols-outlined text-gray-300 text-[18px] group-hover:text-primary transition-colors">
                          chevron_right
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="px-5 py-8 text-center">
                <span className="material-symbols-outlined text-gray-300 text-[32px] mb-2 block">calendar_today</span>
                <p className="text-sm text-text-secondary">No appointments yet</p>
              </div>
            )}
          </div>

          {/* AI Intake Summary — only if data exists */}
          {hasSummary && (
            <AIIntakeSummary summary={data.ai_intake_summary} patientId={patientId} onRefresh={loadPatient} />
          )}

          {/* Report Insights — only if documents exist */}
          {hasDocuments && (
            <ReportInsights insights={data.report_insights} documents={data.documents} />
          )}

          {/* Differential Diagnosis — only if items exist */}
          {hasDifferential && (
            <DifferentialDiagnosis items={data.differential_diagnosis} patientId={patientId} />
          )}

          {/* Ask AI Panel */}
          <AskAIPanel patientId={patientId} />
        </div>
      </div>
    </div>
  );
}
