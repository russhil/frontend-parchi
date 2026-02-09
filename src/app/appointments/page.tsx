"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAppointments } from "@/lib/api";

interface AppointmentWithPatient {
    id: string;
    patient_id: string;
    start_time: string;
    status: string;
    reason: string;
    patients?: {
        id: string;
        name: string;
    };
}

export default function AppointmentsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<AppointmentWithPatient[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "today" | "upcoming">("all");

    useEffect(() => {
        async function loadAppointments() {
            try {
                const data = await getAppointments();
                setAppointments(data.appointments || []);
            } catch {
                // Handle error
            } finally {
                setLoading(false);
            }
        }
        loadAppointments();
    }, []);

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    };

    const isToday = (isoString: string) => {
        const date = new Date(isoString);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const filteredAppointments = appointments.filter((apt) => {
        if (filter === "today") return isToday(apt.start_time);
        if (filter === "upcoming") return new Date(apt.start_time) > new Date();
        return true;
    });

    if (loading) {
        return (
            <div className="p-6">
                <div className="max-w-4xl mx-auto animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-48" />
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">Appointments</h1>
                        <p className="text-sm text-text-secondary mt-1">
                            {appointments.length} total appointments
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/appointments/add")}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        New Appointment
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6">
                    {(["all", "today", "upcoming"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === f
                                ? "bg-primary text-white"
                                : "bg-surface border border-border-light text-text-secondary hover:bg-gray-50"
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Appointments List */}
                <div className="space-y-3">
                    {filteredAppointments.map((apt) => (
                        <div
                            key={apt.id}
                            onClick={() => router.push(`/patient/${apt.patient_id}`)}
                            className="bg-surface rounded-xl border border-border-light shadow-sm p-4 hover:shadow-md transition cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                {/* Time */}
                                <div className="text-center min-w-[80px]">
                                    <p className="text-lg font-bold text-text-primary">{formatTime(apt.start_time)}</p>
                                    <p className="text-xs text-text-secondary">{formatDate(apt.start_time)}</p>
                                </div>

                                {/* Divider */}
                                <div className="w-px h-12 bg-border-light" />

                                {/* Patient Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-xs">
                                            {apt.patients?.name?.split(" ").map((n) => n[0]).join("") || "?"}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-text-primary">
                                                {apt.patients?.name || "Unknown Patient"}
                                            </p>
                                            <p className="text-xs text-text-secondary">{apt.reason}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${apt.status === "completed"
                                            ? "bg-green-100 text-green-700"
                                            : apt.status === "cancelled"
                                                ? "bg-red-100 text-red-700"
                                                : isToday(apt.start_time)
                                                    ? "bg-primary-light text-primary"
                                                    : "bg-gray-100 text-text-secondary"
                                            }`}
                                    >
                                        {apt.status === "scheduled" && isToday(apt.start_time)
                                            ? "Today"
                                            : apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                    </span>
                                </div>

                                {/* Actions */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/consult/${apt.patient_id}`);
                                    }}
                                    className="p-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition"
                                    title="Start Consult"
                                >
                                    <span className="material-symbols-outlined text-[20px]">mic</span>
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredAppointments.length === 0 && (
                        <div className="bg-surface rounded-xl border border-border-light p-12 text-center">
                            <span className="material-symbols-outlined text-gray-300 text-[48px] mb-3 block">
                                event_busy
                            </span>
                            <p className="text-sm text-text-secondary">No appointments found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
