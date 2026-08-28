export type AttachmentType = 'PDF' | 'IMAGE' | 'PPT';

export interface ProtoSemAttachment {
  id: string;
  type: AttachmentType;
  name: string;
  url: string; // Base64 data URL or asset URL
  size?: string;
  uploadedAt: string;
  description?: string;
}

export interface ProtoSemDateEntry {
  id: string;
  weekId: string;
  date: string; // e.g. "2026-08-24" or "24 August 2026"
  title?: string;
  notes: string; // Structured formatted notes (headings, bold, lists, etc.)
  status: 'DRAFT' | 'PUBLISHED';
  attachments: ProtoSemAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface ProtoSemWeek {
  id: string; // "week-00", "week-01", ... "week-20"
  weekNumber: number; // 0, 1, 2, ... 20
  slug: string; // "week-00", "week-01", ...
  name: string; // Editable custom name (initially empty "")
  order: number;
  entries: ProtoSemDateEntry[];
  createdAt: string;
  updatedAt: string;
}
