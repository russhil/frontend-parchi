"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { simpleSearchPatients, createSetupIntake } from "@/lib/api";

function Input({ label, ...props }: any) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
            <input
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                {...props}
            />
        </div>
    );
}

function Button({ children, isLoading, onClick, variant = "primary", className = "" }: any) {
    const base = "px-6 py-2 rounded-lg font-semibold transition-all active:scale-95 text-sm";
    const styles = variant === "primary"
        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20"
        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700";

    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={`${base} ${styles} ${isLoading ? "opacity-70 cursor-not-allowed" : ""} ${className}`}
        >
            {isLoading ? "Processing..." : children}
        </button>
    );
}

export default function SetupIntakePage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        date: "",
        time: "",
    });

    const [generatedLink, setGeneratedLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        if (!query.trim()) return;
        setIsSearching(true);
        setResults([]);
        try {
            const data = await simpleSearchPatients(query);
            setResults(data.results || []);
        } catch (err: any) {
            console.error(err);
            setError("Search failed. Please check if the backend is running.");
        } finally {
            setIsSearching(false);
        }
    };

    const selectPatient = (p: any) => {
        setSelectedPatient(p);
        setFormData(prev => ({
            ...prev,
            name: p.patient_name,
            phone: p.phone || "",
        }));
    };

    const clearSelection = () => {
        setSelectedPatient(null);
        setFormData({ name: "", phone: "", date: "", time: "" });
        setResults([]);
        setQuery("");
    };

    const handleGenerate = async () => {
        if (!formData.name || !formData.phone || !formData.date || !formData.time) {
            setError("Please fill all fields.");
            return;
        }
        setLoading(true);
        setError("");

        try {
            // Create a Date object from local date + time
            // HTML5 date/time inputs are in local time
            const localDate = new Date(`${formData.date}T${formData.time}`);
            const isoString = localDate.toISOString();

            const data = await createSetupIntake({
                name: formData.name,
                phone: formData.phone,
                appointment_time: isoString,
                patient_id: selectedPatient?.patient_id || undefined
            });

            setGeneratedLink(data.link);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(generatedLink);
        alert("Link copied to clipboard!");
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Setup Patient Intake</h1>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">1. Find or Add Patient</h2>

                {!selectedPatient ? (
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <input
                                className="flex-1 px-4 py-2 border dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                                placeholder="Search by name, phone, or condition..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                            <Button onClick={handleSearch} isLoading={isSearching}>Search</Button>
                        </div>

                        {/* Results */}
                        {results.length > 0 && (
                            <div className="mt-4 border dark:border-slate-700 rounded-lg divide-y divide-slate-200 dark:divide-slate-700 bg-slate-50 dark:bg-slate-900 max-h-60 overflow-y-auto">
                                {results.map((r: any) => (
                                    <div key={r.patient_id} className="p-3 hover:bg-blue-50 dark:hover:bg-slate-800 cursor-pointer flex justify-between items-center" onClick={() => selectPatient(r)}>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-slate-100">{r.patient_name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{r.phone}</p>
                                        </div>
                                        <button className="text-sm text-blue-600 font-medium">Select</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* New Patient Option */}
                        {(query && !isSearching) && (
                            <div className="pt-4 border-t dark:border-slate-700 mt-4 animate-in fade-in">
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                                    {results.length === 0 ? "No results found." : "Not seeing the right patient?"}
                                </p>
                                <Button variant="secondary" onClick={() => setSelectedPatient({ patient_id: null, patient_name: "" })}>
                                    + {results.length === 0 ? "Create New Patient" : "Add New Patient"}
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 flex justify-between items-center">
                        <div>
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                                {selectedPatient.patient_id ? "Existing Patient" : "New Patient"}
                            </span>
                            <p className="font-medium text-blue-900 dark:text-blue-100 text-lg">
                                {selectedPatient.patient_id ? selectedPatient.patient_name : "New Patient Entry"}
                            </p>
                        </div>
                        <Button variant="secondary" onClick={clearSelection} className="text-xs py-1 px-3">
                            Change
                        </Button>
                    </div>
                )}
            </div>

            {/* Form */}
            {selectedPatient && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 animate-in fade-in slide-in-from-bottom-4">
                    <h2 className="text-lg font-semibold mb-4">2. Appointment Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Patient Name"
                            value={formData.name}
                            onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                        />
                        <Input
                            label="Phone Number"
                            value={formData.phone}
                            onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+1234567890"
                            type="tel"
                        />
                        <Input
                            label="Date"
                            type="date"
                            value={formData.date}
                            onChange={(e: any) => setFormData({ ...formData, date: e.target.value })}
                        />
                        <Input
                            label="Time"
                            type="time"
                            value={formData.time}
                            onChange={(e: any) => setFormData({ ...formData, time: e.target.value })}
                        />
                    </div>

                    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

                    <Button onClick={handleGenerate} isLoading={loading} className="w-full py-3 text-lg">
                        Generate Intake Link
                    </Button>
                </div>
            )}

            {/* Result Link */}
            {generatedLink && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        🔗
                    </div>
                    <h3 className="text-xl font-bold text-green-900 mb-2">Intake Link Created!</h3>
                    <p className="text-green-700 mb-4">Share this secure link with the patient.</p>

                    <div className="flex items-center gap-2 max-w-md mx-auto bg-white dark:bg-slate-800 border border-green-200 dark:border-green-800 rounded-lg p-2 mb-4">
                        <input
                            readOnly
                            value={generatedLink}
                            className="flex-1 bg-transparent border-none text-sm text-slate-600 dark:text-slate-300 outline-none w-full"
                        />
                        <button
                            onClick={copyLink}
                            className="text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                        >
                            Copy
                        </button>
                    </div>

                    <Button variant="secondary" onClick={() => window.location.reload()}>
                        Start New Intake
                    </Button>
                </div>
            )}
        </div>
    );
}
