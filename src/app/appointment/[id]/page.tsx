"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAppointment } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppointmentRedirectPage() {
    const params = useParams();
    const router = useRouter();
    const appointmentId = params.id as string;
    const [error, setError] = useState(false);

    useEffect(() => {
        async function redirect() {
            try {
                const data = await getAppointment(appointmentId);
                router.replace(
                    `/patient/${data.patient.id}?tab=timeline&appointment=${appointmentId}`
                );
            } catch {
                setError(true);
            }
        }
        redirect();
    }, [appointmentId, router]);

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <p className="text-muted-foreground">Could not load appointment data.</p>
                    <button
                        onClick={() => router.push("/schedule")}
                        className="mt-3 text-sm text-primary font-medium hover:underline"
                    >
                        ← Back to Schedule
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-96">
            <div className="space-y-4 w-64">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <p className="text-sm text-muted-foreground text-center mt-4">
                    Redirecting to patient workspace...
                </p>
            </div>
        </div>
    );
}
