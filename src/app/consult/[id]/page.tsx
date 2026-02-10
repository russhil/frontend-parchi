"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { startConsult, saveConsultDump } from "@/lib/api";
import { useConsultTranscription } from "@/hooks/useConsultTranscription";
import type { ConsultInsights } from "@/types";
import RecordingControls from "@/components/consult/RecordingControls";
import TranscriptInput from "@/components/consult/TranscriptInput";
import ConsultResults from "@/components/consult/ConsultResults";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Brain, Save, AlertCircle } from "lucide-react";

export default function ConsultPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = params.id as string;
  const appointmentId = searchParams.get("appointment") || undefined;

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [manualNotes, setManualNotes] = useState("");
  const [insights, setInsights] = useState<ConsultInsights | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transcription = useConsultTranscription();

  // Start consult session on mount
  useEffect(() => {
    async function init() {
      try {
        const data = await startConsult(patientId);
        setSessionId(data.consult_session_id);
      } catch {
        setSessionId("demo-session");
      }
    }
    init();
  }, [patientId]);

  const handleToggleRecording = useCallback(async () => {
    if (transcription.status === "idle" || transcription.status === "error") {
      if (!sessionId) return;
      setError(null);
      await transcription.start(sessionId);
    } else if (transcription.status === "recording") {
      transcription.stop();
    }
  }, [transcription, sessionId]);

  const handleSaveAndAnalyze = useCallback(async () => {
    if (!sessionId || !transcription.dumpId) return;
    const hasContent = transcription.transcript.trim() || manualNotes.trim();
    if (!hasContent) return;

    setSaving(true);
    setError(null);
    try {
      const result = await saveConsultDump(
        sessionId,
        transcription.dumpId,
        manualNotes,
        appointmentId,
        true
      );
      if (result.insights) {
        setInsights(result.insights);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save and analyze"
      );
    } finally {
      setSaving(false);
    }
  }, [sessionId, transcription.dumpId, transcription.transcript, manualNotes, appointmentId]);

  const isRecording = transcription.status === "recording";
  const canSave =
    transcription.status === "idle" &&
    transcription.dumpId &&
    (transcription.transcript.trim() || manualNotes.trim()) &&
    !insights;

  return (
    <div className="-m-6">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => router.push(`/patient/${patientId}`)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-lg font-bold">Consult Session</h1>
              <p className="text-xs text-muted-foreground">
                Patient: {patientId} &bull; Session: {sessionId || "..."}
              </p>
            </div>
          </div>

          <RecordingControls
            transcriptionStatus={transcription.status}
            onToggle={handleToggleRecording}
            elapsed={transcription.elapsedSeconds}
          />
        </div>
      </div>

      {/* Error display */}
      {(error || transcription.error) && (
        <div className="mx-6 mt-4 bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error || transcription.error}
        </div>
      )}

      {/* Content */}
      <div className="grid grid-cols-2 gap-5 p-6">
        {/* Left: Transcript + Notes */}
        <TranscriptInput
          transcript={transcription.transcript}
          manualNotes={manualNotes}
          onManualNotesChange={setManualNotes}
          isRecording={isRecording}
        />

        {/* Right: Results */}
        <div>
          {saving ? (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-sm font-semibold">
                Analyzing consultation...
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Generating SOAP note and insights
              </p>
            </div>
          ) : insights ? (
            <ConsultResults insights={insights} />
          ) : (
            <div className="bg-card rounded-xl border border-border p-8 text-center h-full flex flex-col items-center justify-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                {isRecording ? (
                  <div className="flex items-center gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-primary rounded-full animate-pulse"
                        style={{
                          height: `${12 + Math.random() * 16}px`,
                          animationDelay: `${i * 150}ms`,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <Brain className="h-7 w-7 text-primary" />
                )}
              </div>
              <p className="text-sm font-semibold">
                {isRecording
                  ? "Recording in progress..."
                  : transcription.transcript
                    ? "Recording complete"
                    : "Ready to start"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                {isRecording
                  ? "Live transcript appears on the left. Stop recording when done."
                  : transcription.transcript
                    ? "Add manual notes if needed, then click Save & Analyze."
                    : "Click 'Start Recording' to begin live transcription via Gemini."}
              </p>

              {canSave && (
                <Button onClick={handleSaveAndAnalyze} className="mt-6 gap-2">
                  <Brain className="h-4 w-4" />
                  Save & Analyze
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Save & Return */}
      {insights && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <Button
            onClick={() => router.push(`/patient/${patientId}`)}
            className="gap-2 shadow-lg"
            size="lg"
          >
            <Save className="h-4 w-4" />
            Save & Return to Patient
          </Button>
        </div>
      )}
    </div>
  );
}
