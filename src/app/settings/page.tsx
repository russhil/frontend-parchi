"use client";

import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const router = useRouter();

    return (
        <div className="p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        Manage your clinic preferences and configuration
                    </p>
                </div>

                {/* Doctor Profile Card */}
                <div className="bg-surface rounded-2xl border border-border-light shadow-sm p-6 mb-6">
                    <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wide mb-4">
                        Doctor Profile
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                            DP
                        </div>
                        <div>
                            <p className="text-lg font-bold text-text-primary">Dr. Prerna</p>
                            <p className="text-sm text-text-secondary">General Physician</p>
                            <p className="text-xs text-text-secondary mt-1">dr.prerna@parchi.ai</p>
                        </div>
                    </div>
                </div>

                {/* Configuration Cards */}
                <div className="space-y-4">
                    {/* API Status */}
                    <div className="bg-surface rounded-xl border border-border-light p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">api</span>
                                <div>
                                    <p className="text-sm font-semibold text-text-primary">API Connection</p>
                                    <p className="text-xs text-text-secondary">Supabase + Google AI</p>
                                </div>
                            </div>
                            <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                Connected
                            </span>
                        </div>
                    </div>

                    {/* Database */}
                    <div className="bg-surface rounded-xl border border-border-light p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">database</span>
                                <div>
                                    <p className="text-sm font-semibold text-text-primary">Database</p>
                                    <p className="text-xs text-text-secondary">Supabase PostgreSQL</p>
                                </div>
                            </div>
                            <span className="text-xs text-text-secondary">xhizybtbsbref...supabase.co</span>
                        </div>
                    </div>

                    {/* AI Model */}
                    <div className="bg-surface rounded-xl border border-border-light p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">smart_toy</span>
                                <div>
                                    <p className="text-sm font-semibold text-text-primary">AI Model</p>
                                    <p className="text-xs text-text-secondary">Google Gemma-3-27b-it</p>
                                </div>
                            </div>
                            <span className="text-xs text-text-secondary">via Google AI Studio</span>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="mt-8">
                    <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wide mb-4">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => router.push("/patients")}
                            className="flex items-center gap-3 p-4 bg-surface rounded-xl border border-border-light hover:shadow-md transition"
                        >
                            <span className="material-symbols-outlined text-primary">group</span>
                            <span className="text-sm font-medium">View All Patients</span>
                        </button>
                        <button
                            onClick={() => router.push("/appointments")}
                            className="flex items-center gap-3 p-4 bg-surface rounded-xl border border-border-light hover:shadow-md transition"
                        >
                            <span className="material-symbols-outlined text-primary">calendar_today</span>
                            <span className="text-sm font-medium">Manage Schedule</span>
                        </button>
                    </div>
                </div>

                {/* Version Info */}
                <div className="mt-8 text-center text-xs text-text-secondary">
                    <p>Parchi.ai v1.0.0 (MVP)</p>
                    <p className="mt-1">Built with Next.js, FastAPI, Supabase, Google AI</p>
                </div>
            </div>
        </div>
    );
}
