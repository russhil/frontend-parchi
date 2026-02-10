"use client";

import type { ConsultInsights } from "@/types";
import SOAPNote from "./SOAPNote";
import ExtractedFacts from "./ExtractedFacts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Stethoscope, Info, ChevronRight } from "lucide-react";

interface ConsultResultsProps {
  insights: ConsultInsights;
}

export default function ConsultResults({ insights }: ConsultResultsProps) {
  return (
    <div className="space-y-5">
      {/* SOAP Note */}
      <SOAPNote soap={insights.soap} />

      {/* Extracted Facts */}
      <ExtractedFacts facts={insights.extracted_facts} />

      {/* Follow-up Questions */}
      {insights.follow_up_questions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-amber-500" />
              Follow-up Questions You May Have Missed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.follow_up_questions.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <ChevronRight className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  {q}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Differential Suggestions */}
      {insights.differential_suggestions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              Differential Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.differential_suggestions.map((d, i) => (
              <div key={i} className="flex items-start gap-3">
                <Badge
                  variant={
                    d.likelihood === "high"
                      ? "default"
                      : d.likelihood === "medium"
                        ? "secondary"
                        : "outline"
                  }
                  className="text-[10px] mt-0.5"
                >
                  {d.likelihood.toUpperCase()}
                </Badge>
                <div>
                  <p className="text-sm font-semibold">{d.condition}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{d.reasoning}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3">
        <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
          <Info className="h-4 w-4 flex-shrink-0" />
          {insights.disclaimer}
        </p>
      </div>
    </div>
  );
}
