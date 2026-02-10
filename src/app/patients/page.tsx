"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPatients } from "@/lib/api";
import type { Patient } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Users, Plus, Mic, Search } from "lucide-react";

export default function PatientsPage() {
    const router = useRouter();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function loadPatients() {
            try {
                const data = await getPatients();
                setPatients(data.patients || []);
            } catch {
                // Handle error
            } finally {
                setLoading(false);
            }
        }
        loadPatients();
    }, []);

    const filteredPatients = patients.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.conditions?.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-10 w-36" />
                </div>
                <Skeleton className="h-10 w-full" />
                <Card>
                    <CardContent className="p-0">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 border-b border-border last:border-0">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
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
                    <h1 className="text-2xl font-bold">Patients</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {patients.length} patients registered
                    </p>
                </div>
                <Button onClick={() => router.push("/patients/new")} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Patient
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, condition, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Patient Table */}
            <Card>
                <CardHeader className="pb-0">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Users className="h-5 w-5" />
                        Patient List
                        {filteredPatients.length > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {filteredPatients.length}
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4">
                    {filteredPatients.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
                            <p className="text-sm">
                                {searchQuery ? `No patients matching "${searchQuery}"` : "No patients found"}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Age / Gender</TableHead>
                                    <TableHead>Conditions</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPatients.map((patient) => (
                                    <TableRow
                                        key={patient.id}
                                        className="cursor-pointer"
                                        onClick={() => router.push(`/patient/${patient.id}`)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                                        {getInitials(patient.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{patient.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {patient.age ? `${patient.age}y` : "—"}{patient.gender ? `, ${patient.gender.charAt(0)}` : ""}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 flex-wrap">
                                                {patient.conditions?.filter(Boolean).slice(0, 2).map((c) => (
                                                    <Badge key={c} variant="secondary" className="text-xs">
                                                        {c}
                                                    </Badge>
                                                ))}
                                                {(patient.conditions?.filter(Boolean).length || 0) > 2 && (
                                                    <span className="text-xs text-muted-foreground">
                                                        +{patient.conditions.filter(Boolean).length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {patient.phone || "—"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/consult/${patient.id}`);
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
