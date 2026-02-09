"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAppointment, completeAppointment } from "@/lib/api";
import type { AppointmentPageData, Vitals, Document } from "@/types";
import AIIntakeSummary from "@/components/patient/AIIntakeSummary";
import DifferentialDiagnosis from "@/components/patient/DifferentialDiagnosis";
import AskAIPanel from "@/components/patient/AskAIPanel";
import FloatingActionBar from "@/components/layout/FloatingActionBar";
import Link from "next/link";

export default function AppointmentPage() {
    const params = useParams();
    const router = useRouter();
    const appointmentId = params.id as string;
    const [data, setData] = useState<AppointmentPageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

    const loadAppointment = useCallback(async () => {
        try {
            const result = await getAppointment(appointmentId);
            setData(result);
        } catch {
            // Error will show error state
        } finally {
            setLoading(false);
        }
    }, [appointmentId]);

    useEffect(() => {
        loadAppointment();
    }, [loadAppointment]);

    const handleComplete = async () => {
        try {
            await completeAppointment(appointmentId);
            loadAppointment(); // Refresh data
        } catch (error) {
            console.error("Failed to complete appointment:", error);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="grid grid-cols-12 gap-5">
                    {[4, 8].map((span) => (
                        <div key={span} className={`col-span-${span}`}>
                            <div className="bg-surface rounded-2xl border border-border-light shadow-sm p-5 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <span className="material-symbols-outlined text-gray-300 text-[48px] mb-3 block">error</span>
                    <p className="text-text-secondary">Could not load appointment data.</p>
                    <button
                        onClick={() => router.push("/appointments")}
                        className="mt-3 text-sm text-primary font-medium hover:underline"
                    >
                        ← Back to Appointments
                    </button>
                </div>
            </div>
        );
    }

    const { appointment, patient, is_archived } = data;
    const vitals = appointment.vitals as Vitals | null;
    const hasVitals = vitals && (vitals.bp_systolic || vitals.spo2 || vitals.heart_rate || vitals.temperature_f);

    const hasSummary = data.ai_intake_summary && (
        data.ai_intake_summary.chief_complaint ||
        data.ai_intake_summary.onset ||
        data.ai_intake_summary.severity ||
        (data.ai_intake_summary.findings && data.ai_intake_summary.findings.length > 0)
    );
    const hasDocuments = data.documents && data.documents.length > 0;
    const hasDifferential = data.differential_diagnosis && data.differential_diagnosis.filter(
        item => item.condition && item.condition.trim() !== ""
    ).length > 0;

    const hasConditions = Array.isArray(patient.conditions) && patient.conditions.filter(Boolean).length > 0;
    const hasMedications = Array.isArray(patient.medications) && patient.medications.filter(Boolean).length > 0;
    const hasAllergies = Array.isArray(patient.allergies) && patient.allergies.filter(Boolean).length > 0;

    const formatTime = (isoString: string) => {
        try {
            const date = new Date(isoString);
            return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
        } catch { return ""; }
    };

    const formatDate = (isoString: string) => {
        try {
            const date = new Date(isoString);
            return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
        } catch { return isoString; }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return { bg: "bg-green-100", text: "text-green-700", label: "Completed" };
            case "in-progress":
                return { bg: "bg-amber-100", text: "text-amber-700", label: "In Progress" };
            case "cancelled":
                return { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" };
            default:
                return { bg: "bg-primary-light", text: "text-primary", label: "Scheduled" };
        }
    };

    const docIcon = (type: string) => {
        switch (type) {
            case "lab_report": return "lab_profile";
            case "referral": return "forward_to_inbox";
            case "prescription": return "medication";
            default: return "description";
        }
    };

    const statusBadge = getStatusBadge(appointment.status);

    return (
        <div className={`p-6 pb-24 ${is_archived ? "opacity-90" : ""}`}>
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                    >
                        <span className="material-symbols-outlined text-text-secondary">arrow_back</span>
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-text-primary">Appointment</h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                                {statusBadge.label}
                            </span>
                            {is_archived && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                    📁 Archive
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-text-secondary mt-0.5">
                            {formatDate(appointment.start_time)} at {formatTime(appointment.start_time)} • {appointment.reason || "General consultation"}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {(appointment.status === "scheduled" || appointment.status === "in-progress") && (
                        <button
                            onClick={handleComplete}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                            {appointment.status === "scheduled" ? "Mark Complete" : "Complete Appointment"}
                        </button>
                    )}
                </div>
            </div>

            {/* Two-Column Grid */}
            <div className="grid grid-cols-12 gap-5">
                {/* Left Sidebar — Patient Details & Vitals */}
                <div className="col-span-12 lg:col-span-4 space-y-5">
                    {/* Patient Details Card */}
                    <div className="bg-surface rounded-2xl border border-border-light shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-[20px]">person</span>
                                <h3 className="text-sm font-bold text-text-primary">Patient Details</h3>
                            </div>
                            <Link
                                href={`/patient/${patient.id}`}
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                                View Profile
                                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                            </Link>
                        </div>
                        <div className="px-5 py-4 space-y-3">
                            {/* Name & Avatar */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-sm">
                                    {patient.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-text-primary">{patient.name}</p>
                                    <p className="text-xs text-text-secondary">
                                        {patient.age ? `${patient.age}y` : "Age N/A"} • {patient.gender || "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* Contact */}
                            {patient.phone && (
                                <div className="flex items-center gap-2 text-xs text-text-secondary">
                                    <span className="material-symbols-outlined text-[14px]">phone</span>
                                    {patient.phone}
                                </div>
                            )}
                            {patient.email && (
                                <div className="flex items-center gap-2 text-xs text-text-secondary">
                                    <span className="material-symbols-outlined text-[14px]">mail</span>
                                    {patient.email}
                                </div>
                            )}

                            {/* Conditions */}
                            {hasConditions && (
                                <div>
                                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wide mb-1.5">Conditions</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {patient.conditions.filter(Boolean).map(c => (
                                            <span key={c} className="px-2 py-0.5 bg-primary-light text-primary text-[10px] font-medium rounded-md">{c}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Medications */}
                            {hasMedications && (
                                <div>
                                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wide mb-1.5">Medications</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {patient.medications.filter(Boolean).map(m => (
                                            <span key={m} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-medium rounded-md">{m}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Allergies */}
                            {hasAllergies && (
                                <div>
                                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wide mb-1.5">Allergies</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {patient.allergies.filter(Boolean).map(a => (
                                            <span key={a} className="px-2 py-0.5 bg-red-50 text-red-700 text-[10px] font-medium rounded-md">⚠ {a}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Vitals Card — only if vitals exist */}
                    {hasVitals && (
                        <div className="bg-surface rounded-2xl border border-border-light shadow-sm p-5">
                            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-4">Vitals</h3>
                            <div className="space-y-3">
                                {vitals?.bp_systolic && vitals?.bp_diastolic && (
                                    <VitalCard
                                        icon="bloodtype"
                                        label="Blood Pressure"
                                        value={`${vitals.bp_systolic}/${vitals.bp_diastolic}`}
                                        unit="mmHg"
                                    />
                                )}
                                {vitals?.spo2 && (
                                    <VitalCard icon="spo2" label="SpO2" value={`${vitals.spo2}`} unit="%" />
                                )}
                                {vitals?.heart_rate && (
                                    <VitalCard icon="heart_check" label="Heart Rate" value={`${vitals.heart_rate}`} unit="bpm" />
                                )}
                                {vitals?.temperature_f && (
                                    <VitalCard icon="thermostat" label="Temperature" value={`${vitals.temperature_f}`} unit="°F" />
                                )}
                            </div>
                            {vitals?.recorded_at && (
                                <p className="text-xs text-text-secondary mt-3">
                                    Recorded: {new Date(vitals.recorded_at).toLocaleString("en-IN")}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Main Content — 8/12 */}
                <div className="col-span-12 lg:col-span-8 space-y-5">
                    {/* AI Intake Summary — only if data exists */}
                    {hasSummary && (
                        <AIIntakeSummary summary={data.ai_intake_summary} patientId={patient.id} onRefresh={loadAppointment} />
                    )}

                    {/* Documents & Attachments */}
                    {hasDocuments && (
                        <DocumentsCard
                            documents={data.documents}
                            expandedDoc={expandedDoc}
                            onToggleDoc={(id) => setExpandedDoc(expandedDoc === id ? null : id)}
                            docIcon={docIcon}
                        />
                    )}

                    {/* Differential Diagnosis — only if items exist */}
                    {hasDifferential && (
                        <DifferentialDiagnosis items={data.differential_diagnosis} patientId={patient.id} />
                    )}

                    {/* Ask AI Panel */}
                    <AskAIPanel patientId={patient.id} />
                </div>
            </div>

            {/* Floating Action Bar */}
            {!is_archived && (
                <FloatingActionBar
                    patientId={patient.id}
                    patientName={patient.name}
                    appointmentId={appointmentId}
                    onRefresh={loadAppointment}
                />
            )}
        </div>
    );
}

function VitalCard({ icon, label, value, unit }: { icon: string; label: string; value: string; unit: string }) {
    return (
        <div className="bg-bg rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
                <span className="material-symbols-outlined text-primary text-[16px]">{icon}</span>
                <span className="text-[10px] text-text-secondary font-medium">{label}</span>
            </div>
            <p className="text-base font-bold text-text-primary">
                {value} <span className="text-xs font-normal text-text-secondary">{unit}</span>
            </p>
        </div>
    );
}

function DocumentsCard({
    documents,
    expandedDoc,
    onToggleDoc,
    docIcon,
}: {
    documents: Document[];
    expandedDoc: string | null;
    onToggleDoc: (id: string) => void;
    docIcon: (type: string) => string;
}) {
    return (
        <div className="bg-surface rounded-2xl border border-border-light shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border-light flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">folder_open</span>
                <h3 className="text-sm font-bold text-text-primary">Documents & Attachments</h3>
                <span className="ml-auto text-xs text-text-secondary">{documents.length} files</span>
            </div>
            <div className="divide-y divide-border-light">
                {documents.map((doc) => (
                    <div key={doc.id}>
                        <button
                            onClick={() => onToggleDoc(doc.id)}
                            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-primary text-[18px]">{docIcon(doc.doc_type)}</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-text-primary truncate">{doc.title}</p>
                                    <p className="text-xs text-text-secondary">
                                        {doc.doc_type.replace(/_/g, " ")} • {new Date(doc.uploaded_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {doc.file_url && (
                                    <a
                                        href={doc.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 rounded-lg hover:bg-primary-light transition"
                                        onClick={(e) => e.stopPropagation()}
                                        title="Download file"
                                    >
                                        <span className="material-symbols-outlined text-primary text-[18px]">download</span>
                                    </a>
                                )}
                                <span className={`material-symbols-outlined text-gray-400 text-[18px] transition-transform ${expandedDoc === doc.id ? "rotate-180" : ""}`}>
                                    expand_more
                                </span>
                            </div>
                        </button>
                        {expandedDoc === doc.id && doc.extracted_text && (
                            <div className="px-5 pb-4">
                                <div className="bg-bg rounded-xl p-4 max-h-48 overflow-y-auto">
                                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wide mb-2">Extracted Text</p>
                                    <p className="text-xs text-text-primary whitespace-pre-wrap leading-relaxed">{doc.extracted_text}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
