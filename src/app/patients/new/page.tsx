"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPatient, type CreatePatientData } from "@/lib/api";
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
import {
    ArrowLeft,
    UserPlus,
    User,
    Ruler,
    Heart,
    Stethoscope,
    Loader2,
    AlertCircle,
} from "lucide-react";

export default function NewPatientPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form fields
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [heightCm, setHeightCm] = useState("");
    const [weightKg, setWeightKg] = useState("");
    const [conditions, setConditions] = useState("");
    const [medications, setMedications] = useState("");
    const [allergies, setAllergies] = useState("");
    const [bpSystolic, setBpSystolic] = useState("");
    const [bpDiastolic, setBpDiastolic] = useState("");
    const [spo2, setSpo2] = useState("");
    const [heartRate, setHeartRate] = useState("");
    const [temperatureF, setTemperatureF] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError("Patient name is required");
            return;
        }

        setIsSubmitting(true);
        try {
            const patientData: CreatePatientData = { name: name.trim() };

            if (age) patientData.age = parseInt(age, 10);
            if (gender) patientData.gender = gender;
            if (phone) patientData.phone = phone.trim();
            if (email) patientData.email = email.trim();
            if (address) patientData.address = address.trim();
            if (heightCm) patientData.height_cm = parseFloat(heightCm);
            if (weightKg) patientData.weight_kg = parseFloat(weightKg);

            if (conditions.trim()) {
                patientData.conditions = conditions.split(",").map((s) => s.trim()).filter(Boolean);
            }
            if (medications.trim()) {
                patientData.medications = medications.split(",").map((s) => s.trim()).filter(Boolean);
            }
            if (allergies.trim()) {
                patientData.allergies = allergies.split(",").map((s) => s.trim()).filter(Boolean);
            }

            const vitals: CreatePatientData["vitals"] = {};
            if (bpSystolic) vitals.bp_systolic = parseInt(bpSystolic, 10);
            if (bpDiastolic) vitals.bp_diastolic = parseInt(bpDiastolic, 10);
            if (spo2) vitals.spo2 = parseInt(spo2, 10);
            if (heartRate) vitals.heart_rate = parseInt(heartRate, 10);
            if (temperatureF) vitals.temperature_f = parseFloat(temperatureF);

            if (Object.keys(vitals).length > 0) {
                patientData.vitals = vitals;
            }

            const result = await createPatient(patientData);
            router.push(`/patient/${result.patient.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create patient");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <Button variant="ghost" size="sm" className="mb-4 gap-2" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <UserPlus className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Add New Patient</h1>
                        <p className="text-sm text-muted-foreground">Fill in the patient information below</p>
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

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <User className="h-5 w-5" /> Basic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Full Name <span className="text-destructive">*</span>
                            </label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., John Doe" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Age</label>
                                <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 35" min="0" max="150" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Gender</label>
                                <Select value={gender} onValueChange={setGender}>
                                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Phone Number</label>
                                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g., +91 98765 43210" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email Address</label>
                                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g., john@email.com" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Address</label>
                            <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g., 123 Main St, City, State" rows={2} />
                        </div>
                    </CardContent>
                </Card>

                {/* Physical Measurements */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Ruler className="h-5 w-5" /> Physical Measurements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Height (cm)</label>
                                <Input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="e.g., 175" step="0.1" min="0" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                                <Input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="e.g., 70" step="0.1" min="0" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Vitals */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Heart className="h-5 w-5" /> Current Vitals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">BP Systolic (mmHg)</label>
                                <Input type="number" value={bpSystolic} onChange={(e) => setBpSystolic(e.target.value)} placeholder="120" min="0" max="300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">BP Diastolic (mmHg)</label>
                                <Input type="number" value={bpDiastolic} onChange={(e) => setBpDiastolic(e.target.value)} placeholder="80" min="0" max="200" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">SpO2 (%)</label>
                                <Input type="number" value={spo2} onChange={(e) => setSpo2(e.target.value)} placeholder="98" min="0" max="100" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Heart Rate (bpm)</label>
                                <Input type="number" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} placeholder="72" min="0" max="300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Temperature (°F)</label>
                                <Input type="number" value={temperatureF} onChange={(e) => setTemperatureF(e.target.value)} placeholder="98.6" step="0.1" min="90" max="110" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Medical History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Stethoscope className="h-5 w-5" /> Medical History
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Existing Conditions</label>
                            <Textarea value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="e.g., Hypertension, Type 2 Diabetes, Asthma" rows={2} />
                            <p className="text-xs text-muted-foreground mt-1">Separate multiple conditions with commas</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Current Medications</label>
                            <Textarea value={medications} onChange={(e) => setMedications(e.target.value)} placeholder="e.g., Lisinopril 10mg, Metformin 500mg" rows={2} />
                            <p className="text-xs text-muted-foreground mt-1">Separate multiple medications with commas</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Known Allergies</label>
                            <Textarea value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g., Penicillin, Shellfish, Latex" rows={2} />
                            <p className="text-xs text-muted-foreground mt-1">Separate multiple allergies with commas</p>
                        </div>
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
                            <><UserPlus className="h-4 w-4" /> Add Patient</>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
