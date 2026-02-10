"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, CalendarCheck } from "lucide-react";
import type { Appointment } from "@/types";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  scheduled: "outline",
  completed: "secondary",
  cancelled: "destructive",
  "in-progress": "default",
};

interface TodaysScheduleProps {
  appointments: Appointment[];
  patientNames: Record<string, string>;
}

export function TodaysSchedule({ appointments, patientNames }: TodaysScheduleProps) {
  const router = useRouter();

  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarCheck className="h-5 w-5" />
            Today&apos;s Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <CalendarCheck className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm">No appointments scheduled for today</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarCheck className="h-5 w-5" />
          Today&apos;s Schedule
          <Badge variant="secondary" className="ml-2">{appointments.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {appointments.map((appt) => {
            const name = patientNames[appt.patient_id] || "Unknown";
            return (
              <button
                key={appt.id}
                onClick={() => router.push(`/patient/${appt.patient_id}`)}
                className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-accent/50 transition-colors text-left"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{name}</p>
                  <p className="text-xs text-muted-foreground truncate">{appt.reason || "General checkup"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {formatTime(appt.start_time)}
                  </span>
                  <Badge variant={statusVariant[appt.status] || "outline"} className="capitalize text-xs">
                    {appt.status}
                  </Badge>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
