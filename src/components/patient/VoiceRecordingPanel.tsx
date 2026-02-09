"use client";

import { useState, useCallback } from "react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { startConsult, transcribeConsultAudio } from "@/lib/api";
import ConsultResults from "@/components/consult/ConsultResults";
import type { ConsultInsights } from "@/types";

type PanelPhase = "ready" | "recording" | "transcribing" | "analyzing" | "results";

interface VoiceRecordingPanelProps {
  patientId: string;
  patientName?: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function VoiceRecordingPanel({
  patientId,
  patientName = "Patient",
  isOpen,
  onClose,
  onComplete,
}: VoiceRecordingPanelProps) {
  const recorder = useAudioRecorder();
  const [phase, setPhase] = useState<PanelPhase>("ready");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [insights, setInsights] = useState<ConsultInsights | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = useCallback(async () => {
    setError(null);
    try {
      const { consult_session_id } = await startConsult(patientId);
      setSessionId(consult_session_id);
      await recorder.start();
      setPhase("recording");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start recording");
    }
  }, [patientId, recorder]);

  const handleStop = useCallback(async () => {
    recorder.stop();
    // The recorder.audioBlob will be set asynchronously via onstop
    // We handle the next step in a useEffect-like pattern by polling
    setPhase("transcribing");
  }, [recorder]);

  // Once recorder transitions to stopped and we have a blob + are in transcribing phase
  const handleTranscribe = useCallback(async () => {
    if (!sessionId || !recorder.audioBlob) return;

    setPhase("transcribing");
    try {
      setPhase("analyzing");
      const result = await transcribeConsultAudio(sessionId, recorder.audioBlob);
      setTranscript(result.transcript);
      setInsights(result.insights);
      setPhase("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transcription failed");
      setPhase("ready");
    }
  }, [sessionId, recorder.audioBlob]);

  // Trigger transcription when audioBlob becomes available during transcribing phase
  // We use a simpler approach: check in render cycle
  if (phase === "transcribing" && recorder.audioBlob && recorder.status === "stopped") {
    handleTranscribe();
  }

  const handleSaveAndClose = useCallback(() => {
    recorder.reset();
    setPhase("ready");
    setSessionId(null);
    setTranscript("");
    setInsights(null);
    setError(null);
    onComplete?.();
    onClose();
  }, [recorder, onComplete, onClose]);

  const handleCancel = useCallback(() => {
    if (recorder.status === "recording" || recorder.status === "paused") {
      recorder.stop();
    }
    recorder.reset();
    setPhase("ready");
    setSessionId(null);
    setTranscript("");
    setInsights(null);
    setError(null);
    onClose();
  }, [recorder, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/30 backdrop-blur-sm"
        onClick={phase === "results" || phase === "ready" ? handleCancel : undefined}
      />

      {/* Panel */}
      <div className="bg-surface border-t border-border-light shadow-2xl rounded-t-3xl max-h-[75vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-surface z-10 px-6 py-4 border-b border-border-light flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[24px]">mic</span>
            <div>
              <h2 className="text-base font-bold text-text-primary">Voice Consult</h2>
              <p className="text-xs text-text-secondary">{patientName}</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            disabled={phase === "transcribing" || phase === "analyzing"}
            className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px] text-text-secondary">close</span>
          </button>
        </div>

        <div className="px-6 py-6">
          {/* Error */}
          {(error || recorder.error) && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              {error || recorder.error}
            </div>
          )}

          {/* Ready State */}
          {phase === "ready" && (
            <div className="flex flex-col items-center gap-6 py-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[40px]">mic</span>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-text-primary">Ready to Record</p>
                <p className="text-sm text-text-secondary mt-1">
                  Click start to begin recording the consultation
                </p>
              </div>
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary-dark transition shadow-lg"
              >
                <span className="material-symbols-outlined text-[20px]">mic</span>
                Start Recording
              </button>
            </div>
          )}

          {/* Recording State */}
          {(phase === "recording") && (recorder.status === "recording" || recorder.status === "paused") && (
            <div className="flex flex-col items-center gap-6 py-8">
              {/* Pulsing indicator */}
              <div className="relative">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                  recorder.status === "recording"
                    ? "bg-red-500 animate-pulse"
                    : "bg-amber-500"
                }`}>
                  <span className="material-symbols-outlined text-white text-[40px]">
                    {recorder.status === "recording" ? "mic" : "pause"}
                  </span>
                </div>
                {recorder.status === "recording" && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20" />
                    <div className="absolute -inset-2 rounded-full border-2 border-red-300 animate-pulse opacity-40" />
                  </>
                )}
              </div>

              {/* Timer */}
              <div className="text-center">
                <p className="text-3xl font-mono font-bold text-text-primary">
                  {formatTime(recorder.elapsedSeconds)}
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  {recorder.status === "recording" ? "Recording..." : "Paused"}
                </p>
              </div>

              {/* Waveform visualization */}
              {recorder.status === "recording" && (
                <div className="flex items-center gap-[3px] h-8">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-red-400 rounded-full animate-pulse"
                      style={{
                        height: `${12 + Math.random() * 20}px`,
                        animationDelay: `${i * 0.05}s`,
                        animationDuration: `${0.4 + Math.random() * 0.4}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center gap-4">
                {recorder.status === "recording" ? (
                  <button
                    onClick={recorder.pause}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border-light text-text-secondary hover:bg-gray-100 transition"
                  >
                    <span className="material-symbols-outlined text-[18px]">pause</span>
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={recorder.resume}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border-light text-text-secondary hover:bg-gray-100 transition"
                  >
                    <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                    Resume
                  </button>
                )}

                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">stop</span>
                  Stop & Transcribe
                </button>
              </div>
            </div>
          )}

          {/* Transcribing / Analyzing State */}
          {(phase === "transcribing" || phase === "analyzing") && (
            <div className="flex flex-col items-center gap-6 py-12">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-primary text-[32px]">
                  {phase === "transcribing" ? "hearing" : "psychology"}
                </span>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-text-primary">
                  {phase === "transcribing" ? "Transcribing audio..." : "Generating SOAP note..."}
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  {phase === "transcribing"
                    ? "Converting speech to text with Whisper"
                    : "Analyzing transcript and extracting clinical insights"}
                </p>
              </div>
              {/* Spinner */}
              <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {/* Results State */}
          {phase === "results" && insights && (
            <div className="space-y-6">
              {/* Transcript */}
              <div className="bg-gray-50 rounded-2xl border border-border-light overflow-hidden">
                <div className="px-5 py-3 border-b border-border-light flex items-center gap-2">
                  <span className="material-symbols-outlined text-text-secondary text-[18px]">description</span>
                  <h3 className="text-sm font-bold text-text-primary">Transcript</h3>
                </div>
                <div className="px-5 py-4 max-h-48 overflow-y-auto">
                  <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
                    {transcript}
                  </p>
                </div>
              </div>

              {/* SOAP + Insights (reuse existing components) */}
              <ConsultResults insights={insights} />

              {/* Save button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveAndClose}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary-dark transition shadow-lg"
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Save & Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
