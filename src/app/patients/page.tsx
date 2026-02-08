"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPatients } from "@/lib/api";
import type { Patient } from "@/types";

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
            <div className="p-6">
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
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">Patients</h1>
                        <p className="text-sm text-text-secondary mt-1">
                            {patients.length} patients registered
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/patients/add")}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                        Add Patient
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
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-bg border-b border-border-light text-xs font-semibold text-text-secondary uppercase tracking-wide">
                        <div className="col-span-3">Patient</div>
                        <div className="col-span-2">Age / Gender</div>
                        <div className="col-span-3">Conditions</div>
                        <div className="col-span-2">Last Visit</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {/* Patient Rows */}
                    <div className="divide-y divide-border-light">
                        {filteredPatients.map((patient) => (
                            <div
                                key={patient.id}
                                className="grid grid-cols-12 gap-4 px-5 py-4 hover:bg-gray-50 transition cursor-pointer"
                                onClick={() => router.push(`/patient/${patient.id}`)}
                            >
                                {/* Patient Info */}
                                <div className="col-span-3 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-sm">
                                        {patient.name.split(" ").map((n) => n[0]).join("")}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-text-primary">{patient.name}</p>
                                        <p className="text-xs text-text-secondary">{patient.phone}</p>
                                    </div>
                                </div>

                                {/* Age / Gender */}
                                <div className="col-span-2 flex items-center">
                                    <p className="text-sm text-text-primary">
                                        {patient.age}y, {patient.gender?.charAt(0)}
                                    </p>
                                </div>

                                {/* Conditions */}
                                <div className="col-span-3 flex items-center gap-1 flex-wrap">
                                    {patient.conditions?.slice(0, 2).map((cond) => (
                                        <span
                                            key={cond}
                                            className="px-2 py-0.5 bg-primary-light text-primary text-xs font-medium rounded-lg"
                                        >
                                            {cond}
                                        </span>
                                    ))}
                                    {patient.conditions?.length > 2 && (
                                        <span className="text-xs text-text-secondary">
                                            +{patient.conditions.length - 2}
                                        </span>
                                    )}
                                </div>

                                {/* Last Visit */}
                                <div className="col-span-2 flex items-center">
                                    <p className="text-sm text-text-secondary">—</p>
                                </div>

                                {/* Actions */}
                                <div className="col-span-2 flex items-center justify-end gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/consult/${patient.id}`);
                                        }}
                                        className="p-2 rounded-lg hover:bg-primary-light text-text-secondary hover:text-primary transition"
                                        title="Start Consult"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">mic</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/patient/${patient.id}`);
                                        }}
                                        className="p-2 rounded-lg hover:bg-gray-100 text-text-secondary hover:text-text-primary transition"
                                        title="View Details"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                    </button>
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
