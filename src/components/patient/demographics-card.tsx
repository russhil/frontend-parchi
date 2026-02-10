"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Ruler, Weight } from "lucide-react";
import type { Patient } from "@/types";

export function DemographicsCard({ patient }: { patient: Patient }) {
  const bmi = patient.height_cm && patient.weight_kg
    ? (patient.weight_kg / ((patient.height_cm / 100) ** 2)).toFixed(1)
    : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Demographics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Age</p>
            <p className="font-medium">{patient.age ? `${patient.age} years` : "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Gender</p>
            <p className="font-medium">{patient.gender || "N/A"}</p>
          </div>
        </div>

        {(patient.height_cm || patient.weight_kg) && (
          <div className="grid grid-cols-3 gap-3 text-sm">
            {patient.height_cm > 0 && (
              <div className="flex items-center gap-1.5">
                <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{patient.height_cm} cm</span>
              </div>
            )}
            {patient.weight_kg > 0 && (
              <div className="flex items-center gap-1.5">
                <Weight className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{patient.weight_kg} kg</span>
              </div>
            )}
            {bmi && (
              <div>
                <span className="text-xs text-muted-foreground">BMI </span>
                <span className="font-medium">{bmi}</span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-1.5 text-sm">
          {patient.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              <span>{patient.phone}</span>
            </div>
          )}
          {patient.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              <span>{patient.email}</span>
            </div>
          )}
          {patient.address && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{patient.address}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
