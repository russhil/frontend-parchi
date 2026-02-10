"use client";

import { useEffect, useRef, useState } from "react";
import { usePatientData } from "@/components/providers/patient-data-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  FileText,
  Mic,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { Appointment, Visit, ConsultSession, AppointmentSummary } from "@/types";

type TimelineEvent = {
  id: string;
  type: "appointment" | "visit" | "consult";
  date: string;
  title: string;
  subtitle: string;
  status?: string;
  details?: Record<string, unknown>;
};

function buildTimeline(
  appointments: (Appointment | AppointmentSummary)[],
  visits: Visit[],
  consults: ConsultSession[]
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  for (const a of appointments) {
    events.push({
      id: `appt-${a.id}`,
      type: "appointment",
      date: a.start_time,
      title: a.reason || "General consultation",
      subtitle: `Appointment`,
      status: a.status,
      details: a as unknown as Record<string, unknown>,
    });
  }

  for (const v of visits) {
    events.push({
      id: `visit-${v.id}`,
      type: "visit",
      date: v.visit_time,
      title: v.summary_ai || "Visit",
      subtitle: "Visit Record",
      details: v as unknown as Record<string, unknown>,
    });
  }

  for (const c of consults) {
    events.push({
      id: `consult-${c.id}`,
      type: "consult",
      date: c.started_at,
      title: "Consult Session",
      subtitle: c.ended_at ? "Completed" : "In Progress",
      details: c as unknown as Record<string, unknown>,
    });
  }

  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return events;
}

const typeIcons = {
  appointment: Calendar,
  visit: FileText,
  consult: Mic,
};

const typeColors = {
  appointment: "bg-blue-500/10 text-blue-500",
  visit: "bg-green-500/10 text-green-500",
  consult: "bg-purple-500/10 text-purple-500",
};

interface TimelineTabProps {
  scrollToAppointment?: string;
}

export function TimelineTab({ scrollToAppointment }: TimelineTabProps) {
  const { data, loading } = usePatientData();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "appointment" | "visit" | "consult">("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const appointments = data.appointments_summary || data.appointments || [];
  const events = buildTimeline(appointments, data.visits || [], data.consult_sessions || []);
  const filtered = filter === "all" ? events : events.filter((e) => e.type === filter);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6">
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(["all", "appointment", "consult", "visit"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f === "all" ? "All" : `${f}s`}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No events to display</p>
        </div>
      ) : (
        <div className="space-y-3" ref={scrollRef}>
          {filtered.map((event) => {
            const Icon = typeIcons[event.type];
            const isOpen = expanded.has(event.id);
            const details = event.details || {};

            return (
              <Card key={event.id} id={event.id}>
                <button
                  onClick={() => toggleExpand(event.id)}
                  className="w-full text-left"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[event.type]}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.subtitle} &middot; {formatDate(event.date)} {formatTime(event.date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {event.status && (
                          <Badge variant="outline" className="capitalize text-xs">
                            {event.status}
                          </Badge>
                        )}
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {isOpen && (
                      <div className="mt-4 pt-3 border-t border-border text-sm space-y-2">
                        {event.type === "visit" && Boolean(details.soap_ai) && (
                          <div className="space-y-2">
                            {(["subjective", "objective", "assessment", "plan"] as const).map((k) => {
                              const val = (details.soap_ai as Record<string, string>)?.[k];
                              if (!val) return null;
                              return (
                                <div key={k}>
                                  <p className="text-xs font-medium text-muted-foreground uppercase">{k}</p>
                                  <p className="text-sm">{val}</p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {event.type === "consult" && Boolean(details.transcript_text) && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Transcript</p>
                            <p className="text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                              {String(details.transcript_text).slice(0, 500)}
                              {String(details.transcript_text).length > 500 && "..."}
                            </p>
                          </div>
                        )}
                        {event.type === "consult" && Boolean(details.soap_note) && (
                          <div className="space-y-2 mt-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase">SOAP Note</p>
                            {(["subjective", "objective", "assessment", "plan"] as const).map((k) => {
                              const val = (details.soap_note as Record<string, string>)?.[k];
                              if (!val) return null;
                              return (
                                <div key={k}>
                                  <p className="text-xs font-medium text-muted-foreground capitalize">{k}</p>
                                  <p className="text-sm">{val}</p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {event.type === "appointment" && (
                          <p className="text-muted-foreground text-sm">
                            Reason: {event.title}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
