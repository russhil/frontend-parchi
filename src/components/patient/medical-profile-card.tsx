"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Patient } from "@/types";

export function MedicalProfileCard({ patient }: { patient: Patient }) {
  const hasConditions = patient.conditions?.filter(Boolean).length > 0;
  const hasMedications = patient.medications?.filter(Boolean).length > 0;
  const hasAllergies = patient.allergies?.filter(Boolean).length > 0;

  if (!hasConditions && !hasMedications && !hasAllergies) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Medical Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasConditions && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Conditions</p>
            <div className="flex flex-wrap gap-1.5">
              {patient.conditions.filter(Boolean).map((c) => (
                <Badge key={c} variant="secondary" className="text-xs">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {hasMedications && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Medications</p>
            <div className="flex flex-wrap gap-1.5">
              {patient.medications.filter(Boolean).map((m) => (
                <Badge key={m} variant="outline" className="text-xs">
                  {m}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {hasAllergies && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Allergies</p>
            <div className="flex flex-wrap gap-1.5">
              {patient.allergies.filter(Boolean).map((a) => (
                <Badge key={a} variant="destructive" className="text-xs">
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
