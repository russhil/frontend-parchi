"use client";

import { usePatientData } from "@/components/providers/patient-data-provider";
import AIIntakeSummary from "@/components/patient/AIIntakeSummary";
import DifferentialDiagnosis from "@/components/patient/DifferentialDiagnosis";
import ReportInsights from "@/components/patient/ReportInsights";
import AskAIPanel from "@/components/patient/AskAIPanel";
import { Skeleton } from "@/components/ui/skeleton";

export function AIInsightsTab() {
  const { data, loading, refresh, patientId } = usePatientData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        <div className="lg:col-span-7 space-y-4">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
        </div>
        <div className="lg:col-span-5">
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const hasSummary = data.ai_intake_summary && (
    data.ai_intake_summary.chief_complaint ||
    data.ai_intake_summary.onset ||
    data.ai_intake_summary.severity ||
    (data.ai_intake_summary.findings?.length > 0)
  );

  const hasDifferential = data.differential_diagnosis?.filter(
    (item) => item.condition && item.condition.trim() !== ""
  ).length > 0;

  const hasDocuments = data.documents?.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
      {/* Left — AI analysis panels */}
      <div className="lg:col-span-7 space-y-5">
        {hasSummary && (
          <AIIntakeSummary
            summary={data.ai_intake_summary}
            patientId={patientId}
            onRefresh={refresh}
          />
        )}

        {hasDifferential && (
          <DifferentialDiagnosis
            items={data.differential_diagnosis}
            patientId={patientId}
          />
        )}

        {hasDocuments && (
          <ReportInsights
            insights={data.report_insights}
            documents={data.documents}
          />
        )}

        {!hasSummary && !hasDifferential && !hasDocuments && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No AI insights generated yet. Start a consult or upload documents to generate insights.</p>
          </div>
        )}
      </div>

      {/* Right — Chat */}
      <div className="lg:col-span-5">
        <AskAIPanel patientId={patientId} />
      </div>
    </div>
  );
}
