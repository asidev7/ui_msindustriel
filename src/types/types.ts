// ============================================================
// Uploaded Document (PDF / Image Uploadé)
// ============================================================
export interface UploadedDocument {
  id: number;
  file: string;
  uploaded_at: string;

  extracted_json?: any;
  km_total?: string;
  consumables?: string;

  status:
    | "pending"
    | "processing"
    | "extracted"
    | "validated"
    | "rejected"
    | "invoiced"
    | "error";
}

// ============================================================
// Client
// ============================================================
export interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

// ============================================================
// Daily Entry (Jour)
// ============================================================
export interface DailyEntry {
  id: number;

  day:
    | "dimanche"
    | "lundi"
    | "mardi"
    | "mercredi"
    | "jeudi"
    | "vendredi"
    | "samedi";

  entry_time?: string;  
  exit_time?: string;

  transport_hours: string;
  meals: boolean;
  perdiem: boolean;

  description?: string;

  km?: string;
  consumables?: string;

  total_hours: string;

  created_at: string;
}

// ============================================================
// Weekly Timesheet
// ============================================================
export interface WeeklyTimesheet {
  id: number;

  name: string;
  vehicle?: string;

  week_start: string;
  week_end: string;

  city?: string;

  client?: Client;
  client_id?: number;

  km_total: string;
  consumables?: string;

  total_hours: string;

  status: "pending" | "validated" | "invoiced";

  document?: UploadedDocument;
  document_id?: number;

  entries: DailyEntry[];

  created_at?: string;
}

// ============================================================
// Invoice (Facture)
// ============================================================
export interface Invoice {
  id: number;
  timesheet: number;
  invoice_number: string;

  client?: Client;
  amount: string;

  status: "draft" | "sent" | "paid" | "cancelled";

  created_at: string;
}
