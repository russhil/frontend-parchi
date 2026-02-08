export interface Vitals {
  bp_systolic: number;
  bp_diastolic: number;
  spo2: number;
  heart_rate: number;
  temperature_f: number;
  recorded_at: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  height_cm: number;
  weight_kg: number;
  allergies: string[];
  medications: string[];
  conditions: string[];
  vitals: Vitals;
}

export interface Appointment {
  id: string;
  patient_id: string;
  start_time: string;
  status: string;
  reason: string;
}

export interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface Visit {
  id: string;
  patient_id: string;
  visit_time: string;
  doctor_notes_text: string;
  summary_ai: string;
  soap_ai: SOAPNote;
}

export interface Document {
  id: string;
  patient_id: string;
  title: string;
  doc_type: string;
  uploaded_at: string;
  extracted_text: string;
}

export interface AIIntakeSummary {
  chief_complaint: string;
  onset: string;
  severity: string;
  findings: string[];
  context: string;
}

export interface DifferentialItem {
  condition: string;
  match_pct: number;
  reasoning: string;
}

export interface ReportFlag {
  type: "warning" | "info" | "error";
  text: string;
}

export interface ReportInsights {
  summary: string;
  flags: ReportFlag[];
}

export interface ConsultSession {
  id: string;
  patient_id: string;
  started_at: string;
  ended_at: string | null;
  transcript_text: string | null;
  soap_note: SOAPNote | null;
  insights_json: ConsultInsights | null;
}

export interface ExtractedFacts {
  symptoms: string[];
  duration: string;
  medications_discussed: string[];
  allergies_mentioned: string[];
}

export interface DifferentialSuggestion {
  condition: string;
  likelihood: string;
  reasoning: string;
}

export interface ConsultInsights {
  clean_transcript: string;
  soap: SOAPNote;
  extracted_facts: ExtractedFacts;
  follow_up_questions: string[];
  differential_suggestions: DifferentialSuggestion[];
  disclaimer: string;
}

export interface PatientPageData {
  patient: Patient;
  appointments: Appointment[];
  visits: Visit[];
  documents: Document[];
  consult_sessions: ConsultSession[];
  ai_intake_summary: AIIntakeSummary;
  differential_diagnosis: DifferentialItem[];
  report_insights: ReportInsights;
}

export interface SearchResult {
  patient_id: string;
  patient_name: string;
  matched_snippets: string[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
