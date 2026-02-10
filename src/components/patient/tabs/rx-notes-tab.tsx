"use client";

import { useEffect, useState } from "react";
import { usePatientData } from "@/components/providers/patient-data-provider";
import { getPrescriptions, getNotes } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pill, StickyNote, FileText } from "lucide-react";

export function RxNotesTab() {
  const { patientId, loading: patientLoading } = usePatientData();
  const [prescriptions, setPrescriptions] = useState<Record<string, unknown>[]>([]);
  const [notes, setNotes] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [rxData, notesData] = await Promise.all([
          getPrescriptions(patientId),
          getNotes(patientId),
        ]);
        setPrescriptions(rxData.prescriptions || []);
        setNotes(notesData.notes || []);
      } catch {
        // Graceful degradation
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [patientId]);

  if (loading || patientLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* Prescriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Pill className="h-5 w-5" />
            Prescriptions
            {prescriptions.length > 0 && (
              <Badge variant="secondary" className="ml-2">{prescriptions.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {prescriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Pill className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No prescriptions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {prescriptions.map((rx, i) => (
                <div key={String(rx.id || i)} className="p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">
                      {String(rx.medication_name || rx.drug_name || "Medication")}
                    </p>
                    {Boolean(rx.created_at) && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(String(rx.created_at)).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    )}
                  </div>
                  {Boolean(rx.dosage || rx.frequency) && (
                    <p className="text-xs text-muted-foreground">
                      {[rx.dosage, rx.frequency, rx.duration].filter(Boolean).map(String).join(" — ")}
                    </p>
                  )}
                  {Boolean(rx.notes) && (
                    <p className="text-xs text-muted-foreground mt-1">{String(rx.notes)}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <StickyNote className="h-5 w-5" />
            Clinical Notes
            {notes.length > 0 && (
              <Badge variant="secondary" className="ml-2">{notes.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No clinical notes yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note, i) => (
                <div key={String(note.id || i)} className="p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">
                      {String(note.title || note.type || "Note")}
                    </p>
                    {Boolean(note.created_at) && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(String(note.created_at)).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    )}
                  </div>
                  {Boolean(note.content) && (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {String(note.content).slice(0, 200)}
                      {String(note.content).length > 200 && "..."}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
