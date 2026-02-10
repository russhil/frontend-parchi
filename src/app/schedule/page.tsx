"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAppointments } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Plus, Mic } from "lucide-react";

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

export default function SchedulePage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<AppointmentWithPatient[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"today" | "week" | "all">("all");

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

    const isToday = (isoString: string) => {
        const date = new Date(isoString);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isThisWeek = (isoString: string) => {
        const date = new Date(isoString);
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);
        return date >= weekStart && date < weekEnd;
    };

    const filteredAppointments = appointments.filter((apt) => {
        if (filter === "today") return isToday(apt.start_time);
        if (filter === "week") return isThisWeek(apt.start_time);
        return true;
    });

    const formatTime = (isoString: string) => {
        try {
            return new Date(isoString).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return "";
        }
    };

    const formatDate = (isoString: string) => {
        try {
            return new Date(isoString).toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
            });
        } catch {
            return isoString;
        }
    };

    const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case "completed":
                return "secondary";
            case "cancelled":
                return "destructive";
            default:
                return "outline";
        }
    };

    const getInitials = (name?: string) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-10 w-40" />
                </div>
                <Skeleton className="h-10 w-64" />
                <Card>
                    <CardContent className="p-0">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 border-b border-border last:border-0">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Schedule</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {appointments.length} total appointments
                    </p>
                </div>
                <Button onClick={() => router.push("/schedule/new")} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Appointment
                </Button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
                {(["today", "week", "all"] as const).map((f) => (
                    <Button
                        key={f}
                        variant={filter === f ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter(f)}
                    >
                        {f === "today" ? "Today" : f === "week" ? "This Week" : "All"}
                    </Button>
                ))}
            </div>

            {/* Schedule Table */}
            <Card>
                <CardHeader className="pb-0">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Calendar className="h-5 w-5" />
                        Appointments
                        {filteredAppointments.length > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {filteredAppointments.length}
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4">
                    {filteredAppointments.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Calendar className="h-10 w-10 mx-auto mb-3 opacity-40" />
                            <p className="text-sm">No appointments found</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAppointments.map((apt) => (
                                    <TableRow
                                        key={apt.id}
                                        className="cursor-pointer"
                                        onClick={() =>
                                            router.push(
                                                `/patient/${apt.patient_id}?tab=timeline&appointment=${apt.id}`
                                            )
                                        }
                                    >
                                        <TableCell className="font-medium whitespace-nowrap">
                                            <div>
                                                <p className="font-semibold">{formatTime(apt.start_time)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(apt.start_time)}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                        {getInitials(apt.patients?.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">
                                                    {apt.patients?.name || "Unknown Patient"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {apt.reason || "General consultation"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(apt.status)} className="capitalize">
                                                {isToday(apt.start_time) && apt.status === "scheduled"
                                                    ? "Today"
                                                    : apt.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/consult/${apt.patient_id}`);
                                                }}
                                                title="Start Consult"
                                            >
                                                <Mic className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
