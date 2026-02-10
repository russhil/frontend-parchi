"use client";

import { useState } from "react";
import { usePatientData } from "@/components/providers/patient-data-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Download,
  ChevronDown,
  ChevronRight,
  FolderOpen,
} from "lucide-react";
import type { Document } from "@/types";

const docTypeLabels: Record<string, string> = {
  lab_report: "Lab Report",
  referral: "Referral",
  prescription: "Prescription",
  imaging: "Imaging",
  other: "Other",
};

export function DocumentsTab() {
  const { data, loading } = usePatientData();
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const documents = data.documents || [];
  const docTypes = [...new Set(documents.map((d) => d.doc_type))];
  const filtered = filter === "all" ? documents : documents.filter((d) => d.doc_type === filter);

  if (documents.length === 0) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <FolderOpen className="h-10 w-10 mb-3 opacity-40" />
          <p className="text-sm">No documents uploaded yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Filters */}
      {docTypes.length > 1 && (
        <div className="flex gap-2 mb-4">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({documents.length})
          </Button>
          {docTypes.map((type) => (
            <Button
              key={type}
              variant={filter === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(type)}
            >
              {docTypeLabels[type] || type} ({documents.filter((d) => d.doc_type === type).length})
            </Button>
          ))}
        </div>
      )}

      {/* Documents List */}
      <div className="space-y-3">
        {filtered.map((doc) => {
          const isOpen = expandedDoc === doc.id;
          return (
            <Card key={doc.id}>
              <button
                onClick={() => setExpandedDoc(isOpen ? null : doc.id)}
                className="w-full text-left"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(doc.uploaded_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className="text-xs">
                        {docTypeLabels[doc.doc_type] || doc.doc_type}
                      </Badge>
                      {doc.file_url && (
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-md hover:bg-accent transition"
                        >
                          <Download className="h-4 w-4 text-muted-foreground" />
                        </a>
                      )}
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {isOpen && doc.extracted_text && (
                    <div className="mt-4 pt-3 border-t border-border">
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Extracted Text</p>
                      <p className="text-sm whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                        {doc.extracted_text}
                      </p>
                    </div>
                  )}
                </CardContent>
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
