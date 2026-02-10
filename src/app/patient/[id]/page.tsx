"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { PatientDataProvider } from "@/components/providers/patient-data-provider";
import { WorkspaceHeader } from "@/components/patient/workspace-header";
import { OverviewTab } from "@/components/patient/tabs/overview-tab";
import { TimelineTab } from "@/components/patient/tabs/timeline-tab";
import { DocumentsTab } from "@/components/patient/tabs/documents-tab";
import { AIInsightsTab } from "@/components/patient/tabs/ai-insights-tab";
import { RxNotesTab } from "@/components/patient/tabs/rx-notes-tab";
import PrescriptionModal from "@/components/patient/PrescriptionModal";
import ManualNoteModal from "@/components/patient/ManualNoteModal";
import DocumentUpload from "@/components/patient/DocumentUpload";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePatientData } from "@/components/providers/patient-data-provider";

function PatientWorkspaceContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);

  const { data, loading, error, refresh, patientId } = usePatientData();

  // Modal state
  const [showPrescription, setShowPrescription] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  if (loading) {
    return (
      <div className="space-y-0">
        {/* Header skeleton */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ))}
          </div>
        </div>
        <div className="p-6 space-y-4">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            Could not load patient data. Is the backend running?
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Run: cd backend && uvicorn main:app --reload
          </p>
        </div>
      </div>
    );
  }

  const patientName = data.patient.name;

  return (
    <div className="-m-6">
      {/* Workspace Header with tabs */}
      <WorkspaceHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenPrescription={() => setShowPrescription(true)}
        onOpenNote={() => setShowNote(true)}
        onOpenUpload={() => setShowUpload(true)}
      />

      {/* Tab content */}
      <div className="min-h-[calc(100vh-200px)]">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "timeline" && <TimelineTab />}
        {activeTab === "documents" && <DocumentsTab />}
        {activeTab === "ai" && <AIInsightsTab />}
        {activeTab === "rx" && <RxNotesTab />}
      </div>

      {/* Modals */}
      <PrescriptionModal
        patientId={patientId}
        patientName={patientName}
        isOpen={showPrescription}
        onClose={() => setShowPrescription(false)}
        onSuccess={refresh}
      />

      <ManualNoteModal
        patientId={patientId}
        patientName={patientName}
        isOpen={showNote}
        onClose={() => setShowNote(false)}
        onSuccess={refresh}
      />

      <DocumentUpload
        patientId={patientId}
        patientName={patientName}
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onSuccess={refresh}
      />
    </div>
  );
}

export default function PatientPage() {
  const params = useParams();
  const patientId = params.id as string;

  return (
    <PatientDataProvider patientId={patientId}>
      <PatientWorkspaceContent />
    </PatientDataProvider>
  );
}
