"use client";

import { useState } from "react";
import { markPatientSeen } from "@/lib/api";
import PrescriptionModal from "@/components/patient/PrescriptionModal";
import ManualNoteModal from "@/components/patient/ManualNoteModal";
import DocumentUpload from "@/components/patient/DocumentUpload";
import VoiceRecordingPanel from "@/components/patient/VoiceRecordingPanel";

interface FloatingActionBarProps {
  patientId: string;
  patientName?: string;
  appointmentId?: string;
  onRefresh?: () => void;
}

export default function FloatingActionBar({
  patientId,
  patientName = "Patient",
  appointmentId,
  onRefresh
}: FloatingActionBarProps) {
  const [showPrescription, setShowPrescription] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showRecording, setShowRecording] = useState(false);
  const [markingAsSeen, setMarkingAsSeen] = useState(false);
  const [markedAsSeen, setMarkedAsSeen] = useState(false);

  const handleMarkAsSeen = async () => {
    if (!appointmentId || markingAsSeen) return;

    setMarkingAsSeen(true);
    try {
      await markPatientSeen(appointmentId);
      setMarkedAsSeen(true);
      onRefresh?.();
    } catch {
      // Handle error
    } finally {
      setMarkingAsSeen(false);
    }
  };

  return (
    <>
      {/* Hide floating bar when recording panel is open */}
      {!showRecording && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div className="flex items-center gap-2 bg-surface rounded-full shadow-lg border border-border-light px-2 py-2">
            {/* Manual Note */}
            <button
              onClick={() => setShowNote(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-text-secondary hover:bg-gray-100 transition"
            >
              <span className="material-symbols-outlined text-[20px]">edit_note</span>
              Manual Note
            </button>

            {/* Start Voice Session */}
            <button
              onClick={() => setShowRecording(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition shadow-md"
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
              Start Voice Session
            </button>

            {/* Prescribe */}
            <button
              onClick={() => setShowPrescription(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-text-secondary hover:bg-gray-100 transition"
            >
              <span className="material-symbols-outlined text-[20px]">medication</span>
              Prescribe
            </button>

            {/* Upload Document */}
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-text-secondary hover:bg-gray-100 transition"
            >
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
              Upload
            </button>

            {/* Mark as Seen */}
            <button
              onClick={handleMarkAsSeen}
              disabled={markingAsSeen || markedAsSeen || !appointmentId}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition ${markedAsSeen
                  ? "bg-green-100 text-green-700"
                  : "text-text-secondary hover:bg-gray-100"
                } ${!appointmentId ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {markedAsSeen ? "check_circle" : "check_circle"}
              </span>
              {markingAsSeen ? "Saving..." : markedAsSeen ? "Seen" : "Mark as Seen"}
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <PrescriptionModal
        patientId={patientId}
        patientName={patientName}
        isOpen={showPrescription}
        onClose={() => setShowPrescription(false)}
        onSuccess={onRefresh}
      />

      <ManualNoteModal
        patientId={patientId}
        patientName={patientName}
        isOpen={showNote}
        onClose={() => setShowNote(false)}
        onSuccess={onRefresh}
      />

      <DocumentUpload
        patientId={patientId}
        patientName={patientName}
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onSuccess={onRefresh}
      />

      {/* Voice Recording Panel */}
      <VoiceRecordingPanel
        patientId={patientId}
        patientName={patientName}
        appointmentId={appointmentId}
        isOpen={showRecording}
        onClose={() => setShowRecording(false)}
        onComplete={onRefresh}
      />
    </>
  );
}
