export const contentSections = ["Hero Banner", "Tentang Kami", "Cara Kerja", "FAQ", "Kontak"] as const;
export type ContentSection = (typeof contentSections)[number];
export type ContentStatus = "ACTIVE" | "INACTIVE";

export interface ContentRecord {
  id: string;
  sectionName: ContentSection;
  content: string;
  status: ContentStatus;
}

export type ContentInput = Pick<ContentRecord, "sectionName" | "content">;
export interface ContentListParams { page?: number; pageSize?: number; search?: string }
export interface ContentListResult { items: ContentRecord[]; page: number; pageSize: number; totalItems: number; totalPages: number }
