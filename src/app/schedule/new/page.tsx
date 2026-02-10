"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPatients, createAppointment, uploadDocument } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Upload, FileText, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface Patient {
    id: string;
    name: string;
}

interface UploadedFile {
    file: File;
    title: string;
    docType: string;
    status: "pending" | "uploading" | "done" | "error";
    error?: string;
}

export default function NewAppointmentPage() {
    const router = useRouter();
    const [patientId, setPatientId] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");
    const [status, setStatus] = useState("scheduled");
    const [patients, setPatients] = useState<Patient[]>([]);
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingPatients, setLoadingPatients] = useState(true);

    useEffect(() => {
        async function loadPatients() {
            try {
                const data = await getPatients();
                setPatients(data.patients || []);
            } catch {
                setError("Failed to load patients");
            } finally {
                setLoadingPatients(false);
            }
        }
        loadPatients();
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles) return;
        const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file) => ({
            file,
            title: file.name.replace(/\.[^/.]+$/, ""),
            docType: "general",
            status: "pending",
        }));
        setFiles((prev) => [...prev, ...newFiles]);
    };

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFiles = e.dataTransfer.files;
        if (!droppedFiles) return;
        const newFiles: UploadedFile[] = Array.from(droppedFiles).map((file) => ({
            file,
            title: file.name.replace(/\.[^/.]+$/, ""),
            docType: "general",
            status: "pending",
        }));
        setFiles((prev) => [...prev, ...newFiles]);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!patientId) { setError("Please select a patient"); return; }
        if (!date || !time) { setError("Please select date and time"); return; }
        if (!reason.trim()) { setError("Please enter a reason"); return; }

        setIsSubmitting(true);
        try {
            const startTime = new Date(`${date}T${time}`).toISOString();
            await createAppointment({
                patient_id: patientId,
                start_time: startTime,
                reason: reason.trim(),
                status,
            });

            // Upload any attached documents
            for (let i = 0; i < files.length; i++) {
                const fileItem = files[i];
                setFiles((prev) =>
                    prev.map((f, idx) => (idx === i ? { ...f, status: "uploading" } : f))
                );
                try {
                    await uploadDocument(patientId, fileItem.title, fileItem.docType, fileItem.file);
                    setFiles((prev) =>
                        prev.map((f, idx) => (idx === i ? { ...f, status: "done" } : f))
                    );
                } catch (uploadErr) {
                    setFiles((prev) =>
                        prev.map((f, idx) =>
                            idx === i
                                ? { ...f, status: "error", error: uploadErr instanceof Error ? uploadErr.message : "Upload failed" }
                                : f
                        )
                    );
                }
            }

            router.push("/schedule");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create appointment");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingPatients) {
        return (
            <div className="max-w-3xl mx-auto space-y-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-64 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <Button variant="ghost" size="sm" className="mb-4 gap-2" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">New Appointment</h1>
                        <p className="text-sm text-muted-foreground">Schedule an appointment and attach documents</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        <p className="text-destructive text-sm">{error}</p>
                    </div>
                )}

                {/* Appointment Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Calendar className="h-5 w-5" /> Appointment Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Patient <span className="text-destructive">*</span>
                            </label>
                            <Select value={patientId} onValueChange={setPatientId}>
                                <SelectTrigger><SelectValue placeholder="Select a patient" /></SelectTrigger>
                                <SelectContent>
                                    {patients.map((p) => (
                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Date <span className="text-destructive">*</span>
                                </label>
                                <Input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    min={new Date().toISOString().split("T")[0]}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Time <span className="text-destructive">*</span>
                                </label>
                                <Input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Reason for Visit <span className="text-destructive">*</span>
                            </label>
                            <Textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="e.g., Follow-up checkup, Blood test results review"
                                rows={2}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Status</label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="scheduled">Scheduled</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Document Upload */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Upload className="h-5 w-5" /> Attach Documents
                            <span className="text-xs text-muted-foreground font-normal ml-1">(Optional)</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div
                            onDrop={handleFileDrop}
                            onDragOver={(e) => e.preventDefault()}
                            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition cursor-pointer"
                            onClick={() => document.getElementById("file-input")?.click()}
                        >
                            <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-40" />
                            <p className="text-sm text-muted-foreground mb-1">
                                Drag and drop files here, or click to browse
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Supports PDF, images (PNG, JPG), and text files
                            </p>
                            <input
                                id="file-input"
                                type="file"
                                multiple
                                accept=".pdf,.png,.jpg,.jpeg,.gif,.bmp,.txt,.doc,.docx"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        {files.length > 0 && (
                            <div className="space-y-2">
                                {files.map((fileItem, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                                        <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{fileItem.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {fileItem.file.name} • {(fileItem.file.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                        {fileItem.status === "uploading" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                                        {fileItem.status === "done" && <CheckCircle className="h-4 w-4 text-green-500" />}
                                        {fileItem.status === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
                                        {fileItem.status === "pending" && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => removeFile(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="gap-2">
                        {isSubmitting ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</>
                        ) : (
                            <><Calendar className="h-4 w-4" /> Create Appointment</>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
