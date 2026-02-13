const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// --- Patient APIs ---

export async function getPatients() {
  return fetchJSON<{ patients: import("@/types").Patient[] }>("/patients");
}

export async function getPatient(id: string) {
  return fetchJSON<import("@/types").PatientPageData>(`/patient/${id}`);
}

export async function search(query: string) {
  return fetchJSON<{ results: import("@/types").SearchResult[] }>("/search", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
}

export async function simpleSearchPatients(query: string) {
  return fetchJSON<{ results: { patient_id: string; patient_name: string; phone: string }[] }>(
    `/patients/search-simple?q=${encodeURIComponent(query)}`
  );
}

export async function createSetupIntake(data: {
  name: string;
  phone: string;
  appointment_time: string;
  patient_id?: string;
}) {
  return fetchJSON<{ success: boolean; link: string; token: string }>("/setup-intake/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getIntakeToken(token: string) {
  return fetchJSON<any>(`/intake/token/${token}`);
}

export async function verifyIntakePhone(token: string, userJsonUrl: string) {
  return fetchJSON<{ success: boolean }>("/intake/token/verify-phone", {
    method: "POST",
    body: JSON.stringify({ token, user_json_url: userJsonUrl }),
  });
}

export async function submitIntakeToken(data: any) {
  return fetchJSON<{ success: boolean }>("/intake/token/submit", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface CreatePatientData {
  name: string;
  age?: number;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  height_cm?: number;
  weight_kg?: number;
  conditions?: string[];
  medications?: string[];
  allergies?: string[];
  vitals?: {
    bp_systolic?: number;
    bp_diastolic?: number;
    spo2?: number;
    heart_rate?: number;
    temperature_f?: number;
  };
}

export async function createPatient(data: CreatePatientData) {
  return fetchJSON<{ patient: import("@/types").Patient }>("/patients", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// --- Appointment APIs ---

export async function getAppointments() {
  return fetchJSON<{ appointments: import("@/types").Appointment[] }>("/appointments");
}

export async function getTodaysAppointments() {
  return fetchJSON<{ appointments: import("@/types").Appointment[] }>("/appointments/today");
}

export async function createAppointment(data: {
  patient_id: string;
  start_time: string;
  reason: string;
  status?: string;
}) {
  return fetchJSON<{ appointment: import("@/types").Appointment }>("/appointments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function markPatientSeen(appointmentId: string) {
  return fetchJSON<{ success: boolean; appointment: import("@/types").Appointment }>(
    "/appointments/mark-seen",
    {
      method: "POST",
      body: JSON.stringify({ appointment_id: appointmentId }),
    }
  );
}

// --- Appointment Page APIs ---

export async function getAppointment(appointmentId: string) {
  return fetchJSON<import("@/types").AppointmentPageData>(`/appointment/${appointmentId}`);
}

export async function startAppointment(appointmentId: string) {
  return fetchJSON<{ success: boolean; appointment: import("@/types").Appointment }>(
    `/appointment/${appointmentId}/start`,
    { method: "POST" }
  );
}

export async function completeAppointment(appointmentId: string) {
  return fetchJSON<{ success: boolean; appointment: import("@/types").Appointment }>(
    `/appointment/${appointmentId}/complete`,
    { method: "POST" }
  );
}

// --- Consult APIs ---

export async function startConsult(patientId: string) {
  return fetchJSON<{ consult_session_id: string }>("/consult/start", {
    method: "POST",
    body: JSON.stringify({ patient_id: patientId }),
  });
}

export async function stopConsult(sessionId: string, transcriptText: string) {
  return fetchJSON<{
    session_id: string;
    transcript: string;
    soap: import("@/types").SOAPNote;
    insights: import("@/types").ConsultInsights;
  }>(`/consult/${sessionId}/stop`, {
    method: "POST",
    body: JSON.stringify({ transcript_text: transcriptText }),
  });
}

export async function transcribeConsultAudio(sessionId: string, audioBlob: Blob) {
  const formData = new FormData();
  const ext = audioBlob.type.includes("mp4") ? "mp4" : "webm";
  formData.append("file", audioBlob, `recording.${ext}`);

  const res = await fetch(`${API_BASE}/consult/${sessionId}/transcribe`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<{
    session_id: string;
    transcript: string;
    soap: import("@/types").SOAPNote;
    insights: import("@/types").ConsultInsights;
  }>;
}

// --- Chat API ---

export async function chat(
  patientId: string,
  message: string,
  history: import("@/types").ChatMessage[]
) {
  return fetchJSON<{ reply: string }>("/chat", {
    method: "POST",
    body: JSON.stringify({ patient_id: patientId, message, history }),
  });
}

export async function getChatSuggestions(patientId: string) {
  return fetchJSON<{ suggestions: string[] }>(`/ai/chat-suggestions/${patientId}`);
}

// --- Prescription APIs ---

export interface PrescriptionMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export async function createPrescription(data: {
  patient_id: string;
  medications: PrescriptionMedication[];
  diagnosis?: string;
  notes?: string;
}) {
  return fetchJSON<{ prescription: Record<string, unknown> }>("/prescriptions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getPrescriptions(patientId: string) {
  return fetchJSON<{ prescriptions: Record<string, unknown>[] }>(`/prescriptions/${patientId}`);
}

// --- Note APIs ---

export async function createNote(data: {
  patient_id: string;
  content: string;
  note_type?: string;
}) {
  return fetchJSON<{ note: Record<string, unknown> }>("/notes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getNotes(patientId: string) {
  return fetchJSON<{ notes: Record<string, unknown>[] }>(`/notes/${patientId}`);
}

// --- Document APIs ---

export async function uploadDocument(
  patientId: string,
  title: string,
  docType: string,
  file: File
) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${API_BASE}/documents/upload?patient_id=${encodeURIComponent(patientId)}&title=${encodeURIComponent(title)}&doc_type=${encodeURIComponent(docType)}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// --- Clinical Dump APIs ---

export async function saveConsultDump(
  sessionId: string,
  dumpId: string,
  manualNotes: string = "",
  appointmentId?: string,
  analyze: boolean = true
) {
  return fetchJSON<{
    dump_id: string;
    combined_dump: string;
    insights?: import("@/types").ConsultInsights;
  }>(`/consult/${sessionId}/save-dump`, {
    method: "POST",
    body: JSON.stringify({
      dump_id: dumpId,
      manual_notes: manualNotes,
      appointment_id: appointmentId,
      analyze,
    }),
  });
}

export async function getPatientClinicalDumps(patientId: string) {
  return fetchJSON<{ clinical_dumps: import("@/types").ClinicalDump[] }>(
    `/clinical-dumps/${patientId}`
  );
}

// --- AI Summary Generation (SSE) ---

export function generateAISummaryURL(patientId: string): string {
  return `${API_BASE}/ai/generate-summary/${patientId}`;
}
