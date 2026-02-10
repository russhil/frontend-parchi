"use client";

import type { TranscriptionStatus } from "@/hooks/useConsultTranscription";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";

interface RecordingControlsProps {
  transcriptionStatus: TranscriptionStatus;
  onToggle: () => void;
  elapsed: number;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default function RecordingControls({
  transcriptionStatus,
  onToggle,
  elapsed,
}: RecordingControlsProps) {
  const isRecording = transcriptionStatus === "recording";
  const isConnecting = transcriptionStatus === "connecting";
  const isStopping = transcriptionStatus === "stopping";

  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={onToggle}
        disabled={isConnecting || isStopping}
        variant={isRecording ? "destructive" : "default"}
        className="gap-2"
      >
        {isConnecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : isStopping ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Stopping...
          </>
        ) : (
          <>
            {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isRecording ? "Stop Recording" : "Start Recording"}
          </>
        )}
      </Button>

      <div className="flex items-center gap-2">
        {isRecording && (
          <span className="w-2.5 h-2.5 bg-destructive rounded-full animate-pulse" />
        )}
        <span className="text-lg font-mono font-bold tabular-nums">
          {formatTime(elapsed)}
        </span>
      </div>
    </div>
  );
}
