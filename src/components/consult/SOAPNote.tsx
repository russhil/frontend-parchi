"use client";

import { useState } from "react";
import type { SOAPNote as SOAPNoteType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, User, HeartPulse, Brain, ClipboardList } from "lucide-react";

interface SOAPNoteProps {
  soap: SOAPNoteType;
}

const tabs = [
  { key: "subjective", label: "Subjective", icon: User },
  { key: "objective", label: "Objective", icon: HeartPulse },
  { key: "assessment", label: "Assessment", icon: Brain },
  { key: "plan", label: "Plan", icon: ClipboardList },
] as const;

export default function SOAPNote({ soap }: SOAPNoteProps) {
  const [activeTab, setActiveTab] = useState<keyof SOAPNoteType>("subjective");

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          SOAP Note
          <Badge variant="secondary" className="ml-auto text-[10px]">
            AI Generated
          </Badge>
        </CardTitle>
      </CardHeader>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition border-b-2 ${activeTab === tab.key
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <CardContent className="pt-4">
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {soap[activeTab]}
        </p>
      </CardContent>
    </Card>
  );
}
