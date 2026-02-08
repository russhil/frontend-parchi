"use client";

import type { AIIntakeSummary as AIIntakeSummaryType } from "@/types";

interface AIIntakeSummaryProps {
  summary: AIIntakeSummaryType | null;
}

export default function AIIntakeSummary({ summary }: AIIntakeSummaryProps) {
  if (!summary) {
    return (
      <div className="bg-surface rounded-2xl border border-border-light shadow-sm p-5">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-border-light shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border-light flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[20px]">clinical_notes</span>
        <h3 className="text-sm font-bold text-text-primary">AI Intake Summary</h3>
        <span className="ml-auto px-2 py-0.5 bg-primary-light text-primary text-[10px] font-semibold rounded-full">
          AI Generated
        </span>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Chief Complaint */}
        <div>
          <p className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">Chief Complaint</p>
          <p className="text-sm font-semibold text-text-primary">{summary.chief_complaint}</p>
        </div>

        {/* Onset & Severity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">Onset</p>
            <p className="text-sm text-text-primary">{summary.onset}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">Severity</p>
            <p className="text-sm text-text-primary">{summary.severity}</p>
          </div>
        </div>

        {/* Key Findings */}
        <div>
          <p className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-2">Key Findings</p>
          <ul className="space-y-2">
            {summary.findings.map((finding, i) => (
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
          <p className="text-xs text-text-secondary leading-relaxed">{summary.context}</p>
        </div>
      </div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-3/4" />
    </div>
  );
}
