"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { startConsult, stopConsult } from "@/lib/api";
import type { ConsultInsights } from "@/types";
import RecordingControls from "@/components/consult/RecordingControls";
import TranscriptInput from "@/components/consult/TranscriptInput";
import ConsultResults from "@/components/consult/ConsultResults";

export default function ConsultPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [insights, setInsights] = useState<ConsultInsights | null>(null);
  const [processing, setProcessing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  // Start session on mount
  useEffect(() => {
    async function init() {
      try {
        const data = await startConsult(patientId);
        setSessionId(data.consult_session_id);
      } catch {
        // Session will work without backend for demo
        setSessionId("demo-session");
      }
    }
    init();
  }, [patientId]);

  // Timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleToggleRecording = useCallback(async () => {
    if (!isRecording) {
      setIsRecording(true);
      return;
    }

    // Stop recording → analyze
    setIsRecording(false);
    if (!transcript.trim()) return;

    setProcessing(true);
    try {
      const data = await stopConsult(sessionId || "demo", transcript);
      setInsights(data.insights);
    } catch {
      // Fallback for demo without backend
      setInsights({
        clean_transcript: transcript,
        soap: {
          subjective: "Unable to analyze — backend unavailable. Please ensure the backend is running.",
          objective: "N/A",
          assessment: "N/A",
          plan: "N/A",
        },
        extracted_facts: {
          symptoms: [],
          duration: "",
          medications_discussed: [],
          allergies_mentioned: [],
        },
        follow_up_questions: ["Connect to the backend API for full AI analysis."],
        differential_suggestions: [],
        disclaimer: "AI analysis was unavailable. Please document manually.",
      });
    } finally {
      setProcessing(false);
    }
  }, [isRecording, transcript, sessionId]);

  return (
    <div className="p-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/patient/${patientId}`)}
            className="flex items-center gap-1 text-text-secondary hover:text-text-primary transition text-sm"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Back
          </button>
          <div>
            <h1 className="text-lg font-bold text-text-primary">Consult Session</h1>
            <p className="text-xs text-text-secondary">Patient: Sarah Jenkins • Session: {sessionId || "..."}</p>
          </div>
        </div>

        <RecordingControls
          isRecording={isRecording}
          onToggle={handleToggleRecording}
          elapsed={elapsed}
        />
      </div>

      {/* Content */}
      <div className="grid grid-cols-2 gap-5">
        {/* Left: Transcript */}
        <TranscriptInput
          value={transcript}
          onChange={setTranscript}
          isRecording={isRecording}
        />

        {/* Right: Results */}
        <div>
          {processing ? (
            <div className="bg-surface rounded-2xl border border-border-light shadow-sm p-8 text-center">
              <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-sm font-semibold text-text-primary">Analyzing consultation...</p>
              <p className="text-xs text-text-secondary mt-1">Generating SOAP note and insights</p>
            </div>
          ) : insights ? (
            <ConsultResults insights={insights} />
          ) : (
            <div className="bg-surface rounded-2xl border border-border-light shadow-sm p-8 text-center h-full flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-gray-300 text-[48px] mb-3">
                {isRecording ? "graphic_eq" : "mic"}
              </span>
              <p className="text-sm font-semibold text-text-primary">
                {isRecording ? "Recording in progress..." : "Ready to start"}
              </p>
              <p className="text-xs text-text-secondary mt-1 max-w-xs">
                {isRecording
                  ? "AI analysis will begin when you stop the recording"
                  : "Click 'Start Recording' and speak or paste a transcript. Stop when done to see AI analysis."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Save & Return */}
      {insights && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => router.push(`/patient/${patientId}`)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-dark transition shadow-lg"
          >
            <span className="material-symbols-outlined text-[20px]">save</span>
            Save & Return to Patient
          </button>
        </div>
      )}
    </div>
  );
}
