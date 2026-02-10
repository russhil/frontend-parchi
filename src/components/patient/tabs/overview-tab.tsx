"use client";

import { usePatientData } from "@/components/providers/patient-data-provider";
import { DemographicsCard } from "@/components/patient/demographics-card";
import { MedicalProfileCard } from "@/components/patient/medical-profile-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MessageSquare } from "lucide-react";

export function OverviewTab() {
  const { data, loading } = usePatientData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { patient, ai_intake_summary } = data;
  const appointments = data.appointments_summary || data.appointments || [];
  const latestAppt = appointments[0];

  const hasSummary = ai_intake_summary && (
    ai_intake_summary.chief_complaint ||
    ai_intake_summary.onset ||
    (ai_intake_summary.findings?.length > 0)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* Left — 2/3 */}
      <div className="lg:col-span-2 space-y-4">
        <DemographicsCard patient={patient} />
        <MedicalProfileCard patient={patient} />

        {/* Latest Appointment */}
        {latestAppt && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Latest Appointment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{latestAppt.reason || "General consultation"}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(latestAppt.start_time).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Badge variant={latestAppt.status === "completed" ? "secondary" : "outline"} className="capitalize">
                  {latestAppt.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right — 1/3 */}
      <div className="space-y-4">
        {/* AI Summary Snapshot */}
        {hasSummary && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {ai_intake_summary.chief_complaint && (
                <div>
                  <p className="text-xs text-muted-foreground">Chief Complaint</p>
                  <p className="font-medium">{ai_intake_summary.chief_complaint}</p>
                </div>
              )}
              {ai_intake_summary.onset && (
                <div>
                  <p className="text-xs text-muted-foreground">Onset</p>
                  <p>{ai_intake_summary.onset}</p>
                </div>
              )}
              {ai_intake_summary.severity && (
                <div>
                  <p className="text-xs text-muted-foreground">Severity</p>
                  <p>{ai_intake_summary.severity}</p>
                </div>
              )}
              {ai_intake_summary.findings?.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Key Findings</p>
                  <ul className="list-disc list-inside text-sm space-y-0.5">
                    {ai_intake_summary.findings.slice(0, 4).map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
