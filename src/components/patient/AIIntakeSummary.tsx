"use client";

import { useState } from "react";
import type { AIIntakeSummary as AIIntakeSummaryType } from "@/types";
import AISummaryModal from "./AISummaryModal";

interface AIIntakeSummaryProps {
  summary: AIIntakeSummaryType | null;
  patientId: string;
  onRefresh?: () => void;
}

export default function AIIntakeSummary({ summary, patientId, onRefresh }: AIIntakeSummaryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localSummary, setLocalSummary] = useState<AIIntakeSummaryType | null>(summary);

  const handleGenerate = () => {
    setIsModalOpen(true);
  };

  const handleComplete = (newSummary: Record<string, unknown>) => {
    // Convert the generated summary to the expected type
    const converted: AIIntakeSummaryType = {
      chief_complaint: String(newSummary.chief_complaint || ""),
      onset: String(newSummary.onset || ""),
      severity: String(newSummary.severity || ""),
      findings: Array.isArray(newSummary.findings) ? newSummary.findings.map(String) : [],
      context: String(newSummary.context || ""),
    };
    setLocalSummary(converted);
    if (onRefresh) {
      onRefresh();
    }
  };

  const displaySummary = localSummary || summary;

  return (
    <>
      <div className="bg-surface rounded-2xl border border-border-light shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border-light flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">clinical_notes</span>
          <h3 className="text-sm font-bold text-text-primary">AI Intake Summary</h3>
          {displaySummary ? (
            <span className="ml-auto px-2 py-0.5 bg-primary-light text-primary text-[10px] font-semibold rounded-full">
              AI Generated
            </span>
          ) : (
            <button
              onClick={handleGenerate}
              className="ml-auto px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              Generate Summary
            </button>
          )}
        </div>

        {displaySummary ? (
          <div className="px-5 py-4 space-y-4">
            {/* Header with regenerate button */}
            <div className="flex items-center justify-between -mt-1 mb-2">
              <button
                onClick={handleGenerate}
                className="text-xs text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span>
                Regenerate
              </button>
            </div>

            {/* Chief Complaint */}
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">Chief Complaint</p>
              <p className="text-sm font-semibold text-text-primary">{displaySummary.chief_complaint}</p>
            </div>

            {/* Onset & Severity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">Onset</p>
                <p className="text-sm text-text-primary">{displaySummary.onset}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">Severity</p>
                <p className="text-sm text-text-primary">{displaySummary.severity}</p>
              </div>
            </div>

            {/* Key Findings */}
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-2">Key Findings</p>
              <ul className="space-y-2">
                {(displaySummary.findings || []).map((finding, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                    <span className={`material-symbols-outlined text-[16px] mt-0.5 ${finding.includes("⚠") ? "text-warning" : "text-primary"}`}>
                      {finding.includes("⚠") ? "warning" : "check_circle"}
                    </span>
                    <span className={finding.includes("⚠") ? "font-medium" : ""}>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Context */}
            <div className="bg-bg rounded-xl p-3">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">Context</p>
              <p className="text-xs text-text-secondary leading-relaxed">{displaySummary.context}</p>
            </div>
          </div>
        ) : (
          <div className="px-5 py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px] text-primary/40">smart_toy</span>
            </div>
            <p className="text-sm font-medium text-text-primary mb-1">No AI Summary Yet</p>
            <p className="text-xs text-text-secondary mb-4">
              Generate an AI-powered intake summary based on patient records
            </p>
            <button
              onClick={handleGenerate}
              className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition-all flex items-center gap-2 mx-auto shadow-sm hover:shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              Generate AI Summary
            </button>
          </div>
        )}
      </div>

      {/* AI Summary Generation Modal */}
      <AISummaryModal
        patientId={patientId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleComplete}
      />
    </>
  );
}
