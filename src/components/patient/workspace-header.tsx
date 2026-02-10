"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePatientData } from "@/components/providers/patient-data-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mic,
  MoreHorizontal,
  FileText,
  StickyNote,
  Upload,
  CheckCircle,
} from "lucide-react";
import { completeAppointment } from "@/lib/api";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface WorkspaceHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenPrescription?: () => void;
  onOpenNote?: () => void;
  onOpenUpload?: () => void;
}

export function WorkspaceHeader({
  activeTab,
  onTabChange,
  onOpenPrescription,
  onOpenNote,
  onOpenUpload,
}: WorkspaceHeaderProps) {
  const { data, refresh } = usePatientData();
  const router = useRouter();

  if (!data) return null;

  const { patient } = data;
  const latestAppt = data.appointments_summary?.[0] || data.appointments?.[0];

  const handleMarkSeen = async () => {
    if (latestAppt) {
      try {
        await completeAppointment(latestAppt.id);
        refresh();
      } catch (e) {
        console.error("Failed to mark complete:", e);
      }
    }
  };

  return (
    <div className="border-b border-border bg-card">
      {/* Row 1: Patient identity + actions */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4 min-w-0">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {getInitials(patient.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold truncate">{patient.name}</h1>
              <span className="text-sm text-muted-foreground">
                {patient.age ? `${patient.age}y` : ""}{patient.gender ? ` ${patient.gender}` : ""}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {patient.conditions?.filter(Boolean).slice(0, 3).map((c) => (
                <Badge key={c} variant="secondary" className="text-xs">
                  {c}
                </Badge>
              ))}
              {patient.conditions?.filter(Boolean).length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{patient.conditions.filter(Boolean).length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push(`/consult/${data.patient.id}`)}
            className="gap-2"
          >
            <Mic className="h-4 w-4" />
            Start Consult
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {onOpenPrescription && (
                <DropdownMenuItem onClick={onOpenPrescription}>
                  <FileText className="mr-2 h-4 w-4" />
                  Write Prescription
                </DropdownMenuItem>
              )}
              {onOpenNote && (
                <DropdownMenuItem onClick={onOpenNote}>
                  <StickyNote className="mr-2 h-4 w-4" />
                  Add Note
                </DropdownMenuItem>
              )}
              {onOpenUpload && (
                <DropdownMenuItem onClick={onOpenUpload}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </DropdownMenuItem>
              )}
              {latestAppt && latestAppt.status !== "completed" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleMarkSeen}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Seen
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Row 2: Tabs */}
      <div className="px-6">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="bg-transparent border-b-0 p-0 h-auto gap-0">
            {[
              { value: "overview", label: "Overview" },
              { value: "timeline", label: "Timeline" },
              { value: "documents", label: "Documents" },
              { value: "ai", label: "AI Insights" },
              { value: "rx", label: "Rx & Notes" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-1 text-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
