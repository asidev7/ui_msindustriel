import axios from "axios";

// Base URL de ton API Django
const API_BASE = "http://85.208.186.182:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// INTERFACES DES MODÈLES
// ============================================================
export interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface UploadedDocument {
  id: number;
  file: string;
  uploaded_at: string;
  extracted_json?: object;
  km_total?: number;
  consumables?: string;
  status: "pending" | "processing" | "extracted" | "validated" | "rejected" | "invoiced" | "error";
}

export interface WeeklyTimesheet {
  id: number;
  name: string;
  vehicle?: string;
  week_start: string;
  week_end: string;
  city?: string;
  client?: Client;
  km_total: number;
  consumables?: string;
  total_hours: number;
  status: "pending" | "validated" | "invoiced";
}

export interface DailyEntry {
  id: number;
  timesheet: WeeklyTimesheet;
  day: "dimanche" | "lundi" | "mardi" | "mercredi" | "jeudi" | "vendredi" | "samedi";
  entry_time?: string;
  exit_time?: string;
  transport_hours: number;
  meals: boolean;
  perdiem: boolean;
  description?: string;
  km?: number;
  consumables?: string;
  total_hours: number;
}

export interface Invoice {
  id: number;
  timesheet: WeeklyTimesheet;
  invoice_number: string;
  client?: Client;
  amount: number;
  status: "draft" | "sent" | "paid" | "cancelled";
  created_at: string;
}

// ============================================================
// CRUD CLIENT
// ============================================================
export const getClients = async (): Promise<Client[]> => {
  const res = await api.get("/clients/");
  return res.data;
};

export const getClient = async (id: number): Promise<Client> => {
  const res = await api.get(`/clients/${id}/`);
  return res.data;
};

export const createClient = async (data: Omit<Client, "id">): Promise<Client> => {
  const res = await api.post("/clients/", data);
  return res.data;
};

export const updateClient = async (id: number, data: Partial<Omit<Client, "id">>): Promise<Client> => {
  const res = await api.put(`/clients/${id}/`, data);
  return res.data;
};

export const deleteClient = async (id: number): Promise<void> => {
  await api.delete(`/clients/${id}/`);
};

// ============================================================
// CRUD DOCUMENTS
// ============================================================
export const getDocuments = async (): Promise<UploadedDocument[]> => {
  const res = await api.get("/documents/");
  return res.data;
};

export const getDocument = async (id: number): Promise<UploadedDocument> => {
  const res = await api.get(`/documents/${id}/`);
  return res.data;
};

export const createDocument = async (data: Omit<UploadedDocument, "id">): Promise<UploadedDocument> => {
  const res = await api.post("/documents/", data);
  return res.data;
};


// Upload document (file only)
export const uploadDocument = async (file: File): Promise<UploadedDocument> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/documents/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateDocument = async (id: number, data: Partial<Omit<UploadedDocument, "id">>): Promise<UploadedDocument> => {
  const res = await api.put(`/documents/${id}/`, data);
  return res.data;
};

export const deleteDocument = async (id: number): Promise<void> => {
  await api.delete(`/documents/${id}/`);
};

// ============================================================
// CRUD TIMESHEETS
// ============================================================
export const getTimesheets = async (): Promise<WeeklyTimesheet[]> => {
  const res = await api.get("/timesheets/");
  return res.data;
};

export const getTimesheet = async (id: number): Promise<WeeklyTimesheet> => {
  const res = await api.get(`/timesheets/${id}/`);
  return res.data;
};

export const createTimesheet = async (data: Omit<WeeklyTimesheet, "id">): Promise<WeeklyTimesheet> => {
  const res = await api.post("/timesheets/", data);
  return res.data;
};

export const updateTimesheet = async (id: number, data: Partial<Omit<WeeklyTimesheet, "id">>): Promise<WeeklyTimesheet> => {
  const res = await api.put(`/timesheets/${id}/`, data);
  return res.data;
};

export const deleteTimesheet = async (id: number): Promise<void> => {
  await api.delete(`/timesheets/${id}/`);
};

// ============================================================
// CRUD DAILY ENTRIES
// ============================================================
export const getDailyEntries = async (): Promise<DailyEntry[]> => {
  const res = await api.get("/entries/");
  return res.data;
};

export const getDailyEntry = async (id: number): Promise<DailyEntry> => {
  const res = await api.get(`/entries/${id}/`);
  return res.data;
};

export const createDailyEntry = async (data: Omit<DailyEntry, "id">): Promise<DailyEntry> => {
  const res = await api.post("/entries/", data);
  return res.data;
};

export const updateDailyEntry = async (id: number, data: Partial<Omit<DailyEntry, "id">>): Promise<DailyEntry> => {
  const res = await api.put(`/entries/${id}/`, data);
  return res.data;
};

export const deleteDailyEntry = async (id: number): Promise<void> => {
  await api.delete(`/entries/${id}/`);
};

// ============================================================
// CRUD INVOICES
// ============================================================
export const getInvoices = async (): Promise<Invoice[]> => {
  const res = await api.get("/invoices/");
  return res.data;
};

export const getInvoice = async (id: number): Promise<Invoice> => {
  const res = await api.get(`/invoices/${id}/`);
  return res.data;
};

export const createInvoice = async (data: Omit<Invoice, "id">): Promise<Invoice> => {
  const res = await api.post("/invoices/", data);
  return res.data;
};

export const updateInvoice = async (id: number, data: Partial<Omit<Invoice, "id">>): Promise<Invoice> => {
  const res = await api.put(`/invoices/${id}/`, data);
  return res.data;
};

export const deleteInvoice = async (id: number): Promise<void> => {
  await api.delete(`/invoices/${id}/`);
};

export default api;
