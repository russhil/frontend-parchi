import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, RefreshCw, CheckCircle2, AlertTriangle, Lightbulb, Mic, FileText, Upload, Sparkles, Plus, Stethoscope } from "lucide-react";

export const PatientDetailMockup = ({ patientName, onBack }: { patientName: string, onBack: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full bg-background/50 overflow-hidden"
        >
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Column: Patient Info & Medical History */}
                    <div className="w-full md:w-72 shrink-0 flex flex-col gap-6">
                        <div>
                            <button
                                onClick={onBack}
                                className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium mb-4 transition-colors"
                            >
                                <ArrowLeft size={16} /> Back
                            </button>
                            <h2 className="text-2xl font-bold text-foreground">{patientName}</h2>
                            <p className="text-sm text-muted-foreground mt-1">21 Yrs • Male</p>

                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "hsl(var(--primary)/0.1)" }}
                                whileTap={{ scale: 0.98 }}
                                className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg border border-border/50 bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors"
                            >
                                <ExternalLink size={16} /> Open Full Record
                            </motion.button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Medical History</h3>

                            <div>
                                <p className="text-xs text-muted-foreground mb-2">Chronic Conditions</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground border border-border/50">Hypertension</span>
                                    <span className="rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground border border-border/50">Asthma</span>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground mb-2">Allergies</p>
                                <div className="inline-flex items-center gap-2 rounded-md bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs font-medium text-red-500">
                                    <AlertTriangle size={14} /> Pollen Allergy
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground mb-2">Current Medications</p>
                                <div className="flex flex-col gap-2">
                                    <div className="rounded-lg bg-card border border-border/50 px-3 py-2.5 text-xs text-foreground">
                                        Occasional paracetamol for headaches
                                    </div>
                                    <div className="rounded-lg bg-card border border-border/50 px-3 py-2.5 text-xs text-foreground">
                                        No regular thyroid medication started yet
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: AI Assistant Panel */}
                    <div className="flex-1 flex flex-col gap-4 min-w-0">
                        {/* Top Header */}
                        <div className="glass-card rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-primary/20 bg-primary/5">
                            <div className="flex items-start sm:items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_20px_-4px_hsl(var(--primary)/0.5)]">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">AI Assistant</h3>
                                    <p className="text-xs text-muted-foreground">Analysis based on intake & history</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Confidence</span>
                                    <span className="text-sm font-bold text-amber-500">65%</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="rounded bg-primary/20 px-1.5 py-0.5 font-medium text-primary">Scheduled</span>
                                    <span className="text-muted-foreground truncate max-w-[200px] sm:max-w-xs">Fever and generalized weakness</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
                            {/* AI Intake Summary */}
                            <div className="glass-card rounded-xl border border-border/50 p-5 flex flex-col relative overflow-hidden">
                                <div className="flex justify-between items-center mb-5">
                                    <div className="flex items-center gap-2 text-foreground font-semibold">
                                        <FileText size={10} className="text-primary" /> AI Summary
                                    </div>
                                    <button className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                                        <RefreshCw size={12} /> Regenerate
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mb-6 border-b border-border/50 pb-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Complaint</p>
                                        <p className="text-xs font-medium text-foreground">Weakness</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Onset</p>
                                        <p className="text-xs font-medium text-foreground">1 day ago</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Severity</p>
                                        <span className="inline-block rounded bg-green-500/20 px-2 py-0.5 text-[11px] font-bold text-green-500 border border-green-500/20">Mild</span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-16">
                                    <div className="flex flex-col gap-3">
                                        {[
                                            "Fever",
                                            "Generalized weakness",
                                            "Fatigue"
                                        ].map((symptom, i) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                key={symptom}
                                                className="flex items-start gap-3"
                                            >
                                                <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                                                <span className="text-sm text-foreground/90">{symptom}</span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="mt-6 rounded-lg bg-card/50 p-4 border border-border/30">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Context</p>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                                            Patient presenting with fever and generalized weakness. Asthma noted in history.
                                        </p>
                                    </div>
                                </div>

                                {/* Floating Action Bar */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full border border-border/50 bg-card/80 p-1.5 shadow-lg backdrop-blur-md">
                                    <button className="flex items-center gap-2 rounded-full px-4 py-2 hover:bg-secondary text-xs font-medium transition-colors text-muted-foreground hover:text-foreground">
                                        <FileText size={14} /> Note
                                    </button>
                                    <button className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-[0_0_15px_-3px_hsl(var(--primary)/0.4)] transition-transform hover:scale-105">
                                        <Mic size={14} /> Voice Session
                                    </button>
                                    <button className="flex items-center gap-2 rounded-full px-4 py-2 hover:bg-secondary text-xs font-medium transition-colors text-muted-foreground hover:text-foreground">
                                        <Upload size={14} /> Upload
                                    </button>
                                </div>
                            </div>

                            {/* Differential Diagnosis */}
                            <div className="glass-card rounded-xl border border-border/50 p-5 flex flex-col overflow-hidden">
                                <div className="flex justify-between items-center mb-5">
                                    <div className="flex items-center gap-2 text-foreground font-semibold">
                                        <Lightbulb size={16} className="text-primary" /> Differential Diagnosis
                                    </div>
                                    <button className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                                        <RefreshCw size={12} /> Regenerate
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3">
                                    {[
                                        {
                                            title: "Viral Infection (COVID)",
                                            confidence: "65%",
                                            desc: "Symptoms of fever and generalized weakness point to a possible viral illness."
                                        },
                                        {
                                            title: "Anemia",
                                            confidence: "45%",
                                            desc: "Weakness and fatigue could indicate underlying anemia. Blood work recommended."
                                        }
                                    ].map((dx, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            key={i}
                                            className="rounded-lg border border-border/40 bg-card p-3.5 hover:border-primary/30 transition-colors cursor-pointer group"
                                        >
                                            <div className="flex justify-between items-start gap-4 mb-2">
                                                <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight flex-1">{dx.title}</h4>
                                                <span className="text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded shrink-0">{dx.confidence}</span>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed">{dx.desc}</p>
                                        </motion.div>
                                    ))}

                                    <button className="mt-2 flex items-center justify-center gap-2 text-xs font-medium text-primary py-2 hover:bg-primary/5 rounded-lg transition-colors">
                                        Show 2 More
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
