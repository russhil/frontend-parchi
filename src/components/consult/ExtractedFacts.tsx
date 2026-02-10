"use client";

import type { ExtractedFacts as ExtractedFactsType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, AlertTriangle } from "lucide-react";

interface ExtractedFactsProps {
  facts: ExtractedFactsType;
}

export default function ExtractedFacts({ facts }: ExtractedFactsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-primary" />
          Extracted Facts
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Symptoms */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Symptoms</p>
          <div className="flex flex-wrap gap-1.5">
            {facts.symptoms.map((s, i) => (
              <Badge key={i} variant="destructive" className="font-normal">
                {s}
              </Badge>
            ))}
          </div>
        </div>

        {/* Duration */}
        {facts.duration && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Duration</p>
            <p className="text-sm">{facts.duration}</p>
          </div>
        )}

        {/* Medications */}
        {facts.medications_discussed.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Medications Discussed</p>
            <div className="flex flex-wrap gap-1.5">
              {facts.medications_discussed.map((m, i) => (
                <Badge key={i} variant="secondary" className="font-normal">
                  {m}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Allergies */}
        {facts.allergies_mentioned.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Allergies Mentioned</p>
            <div className="flex flex-wrap gap-1.5">
              {facts.allergies_mentioned.map((a, i) => (
                <Badge key={i} variant="outline" className="font-normal gap-1 border-amber-500/50 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-3 w-3" />
                  {a}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
