"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Mic, PenLine } from "lucide-react";

interface TranscriptInputProps {
  transcript: string;
  manualNotes: string;
  onManualNotesChange: (val: string) => void;
  isRecording: boolean;
}

export default function TranscriptInput({
  transcript,
  manualNotes,
  onManualNotesChange,
  isRecording,
}: TranscriptInputProps) {
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRecording && transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcript, isRecording]);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Live Transcript */}
      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-primary" />
              Live Transcript
            </span>
            {isRecording && (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                <span className="text-xs text-destructive font-medium">Recording</span>
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto min-h-[200px] max-h-[300px]">
          {transcript ? (
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {transcript}
              <div ref={transcriptEndRef} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              {isRecording ? (
                <div className="text-center">
                  <div className="flex justify-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-primary rounded-full animate-pulse"
                        style={{
                          height: `${16 + Math.random() * 24}px`,
                          animationDelay: `${i * 100}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Listening for speech...</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Speak naturally, transcript will appear here
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Transcript will appear here during recording
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <PenLine className="h-4 w-4" />
            Manual Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={manualNotes}
            onChange={(e) => onManualNotesChange(e.target.value)}
            placeholder="Add any additional notes here..."
            rows={5}
            className="resize-none"
          />
        </CardContent>
      </Card>
    </div>
  );
}
