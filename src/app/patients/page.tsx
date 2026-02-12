"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPatients } from "@/lib/api";
import type { Patient } from "@/types";

// List of severe conditions (can be expanded)
const SEVERE_CONDITIONS = [
    "cancer", "heart disease", "stroke", "diabetes complications", 
    "kidney failure", "liver failure", "copd", "heart attack", "angina"
];

// Helper function to determine condition severity
const getConditionSeverity = (condition: string): "severe" | "mild" => {
    const lowerCondition = condition.toLowerCase();
    return SEVERE_CONDITIONS.some(severe => lowerCondition.includes(severe)) ? "severe" : "mild";
};

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

    if (loading) {
        return (
            <div className="p-4 md:p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-48" />
                        <div className="h-12 bg-gray-200 rounded" />
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-text-primary">Patients</h1>
                        <p className="text-sm text-text-secondary mt-1">
                            {patients.length} patients registered
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/patients/add")}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition shadow-sm w-full sm:w-auto"
                    >
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                        <span className="sm:inline">Add Patient</span>
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Search by name, condition, or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-surface rounded-xl border border-border-light text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                </div>

                {/* Patient List */}
                <div className="bg-surface rounded-2xl border border-border-light shadow-sm overflow-hidden">
                    {/* Table Header - Hidden on mobile */}
                    <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3 bg-bg border-b border-border-light text-xs font-semibold text-text-secondary uppercase tracking-wide">
                        <div className="col-span-4">Patient</div>
                        <div className="col-span-2">Age / Gender</div>
                        <div className="col-span-6">Conditions</div>
                    </div>

                    {/* Patient Rows */}
                    <div className="divide-y divide-border-light">
                        {filteredPatients.map((patient) => (
                            <div
                                key={patient.id}
                                className="px-4 md:px-5 py-4 hover:bg-gray-50 transition cursor-pointer"
                                onClick={() => router.push(`/patient/${patient.id}`)}
                            >
                    {/* Desktop Layout */}
                    <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                        {/* Patient Info */}
                        <div className="col-span-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                                {patient.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-text-primary truncate">{patient.name}</p>
                                <p className="text-xs text-text-secondary truncate">{patient.phone}</p>
                            </div>
                        </div>

                        {/* Age / Gender */}
                        <div className="col-span-2 flex items-center">
                            <p className="text-sm text-text-primary">
                                {patient.age}y, {patient.gender?.charAt(0)}
                            </p>
                        </div>

                        {/* Conditions */}
                        <div className="col-span-6 flex items-center gap-1.5 flex-wrap">
                            {patient.conditions?.slice(0, 3).map((cond) => {
                                const severity = getConditionSeverity(cond);
                                return (
                                    <span
                                        key={cond}
                                        className={`px-2 py-0.5 text-xs font-medium rounded-lg ${
                                            severity === "severe" 
                                                ? "bg-red-100 text-red-700" 
                                                : "bg-green-100 text-green-700"
                                        }`}
                                    >
                                        {cond}
                                    </span>
                                );
                            })}
                            {patient.conditions?.length > 3 && (
                                <span className="text-xs text-text-secondary">
                                    +{patient.conditions.length - 3}
                                </span>
                            )}
                            {!patient.conditions?.length && (
                                <span className="text-xs text-text-secondary">No conditions</span>
                            )}
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="lg:hidden space-y-3">
                        {/* Patient Info */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                                {patient.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-text-primary">{patient.name}</p>
                                <p className="text-xs text-text-secondary">{patient.phone}</p>
                                <p className="text-xs text-text-secondary mt-0.5">
                                    {patient.age}y, {patient.gender}
                                </p>
                            </div>
                        </div>

                        {/* Conditions */}
                        {patient.conditions?.length > 0 && (
                            <div>
                                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wide mb-1.5">Conditions</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {patient.conditions.map((cond) => {
                                        const severity = getConditionSeverity(cond);
                                        return (
                                            <span
                                                key={cond}
                                                className={`px-2 py-0.5 text-xs font-medium rounded-lg ${
                                                    severity === "severe" 
                                                        ? "bg-red-100 text-red-700" 
                                                        : "bg-green-100 text-green-700"
                                                }`}
                                            >
                                                {cond}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                            </div>
                        ))}

                        {filteredPatients.length === 0 && (
                            <div className="px-5 py-12 text-center">
                                <span className="material-symbols-outlined text-gray-300 text-[48px] mb-3 block">
                                    person_search
                                </span>
                                <p className="text-sm text-text-secondary">
                                    {searchQuery ? `No patients matching "${searchQuery}"` : "No patients found"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
