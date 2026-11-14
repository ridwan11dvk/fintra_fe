import { apiClient } from "@railfinance/core/lib";
import type { ContentInput, ContentListParams, ContentListResult, ContentRecord, ContentStatus } from "./content.types";

const CONTENT_ENDPOINT = "/master-data/contents";

interface ApiResponse<T> {
  data: T;
  message: string;
  status: string;
}

interface ContentApiRecord {
  id: number;
  sectionName: string;
  body: string;
  active: boolean;
}

interface ContentApiInput {
  sectionName: string;
  body: string;
  active: boolean;
}

function toNumericId(id: string): number {
  const numericId = Number(id);
  if (!Number.isSafeInteger(numericId) || numericId < 1) {
    throw new Error(`Invalid Content ID: ${id}`);
  }
  return numericId;
}

function toContentRecord(record: ContentApiRecord): ContentRecord {
  return {
    id: String(record.id),
    sectionName: record.sectionName as ContentRecord["sectionName"],
    content: record.body,
    status: record.active ? "ACTIVE" : "INACTIVE",
  };
}

function toContentApiInput(input: ContentInput, status: ContentStatus): ContentApiInput {
  return {
    sectionName: input.sectionName,
    body: input.content,
    active: status === "ACTIVE",
  };
}

export function getContentErrorMessage(error: unknown, fallback = "Unable to save Content"): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = error as { response?: { data?: { message?: unknown; detail?: unknown } } };
    const apiMessage = response.response?.data?.message;
    if (typeof apiMessage === "string") return apiMessage;
    const apiDetail = response.response?.data?.detail;
    if (typeof apiDetail === "string") return apiDetail;
  }
  return error instanceof Error ? error.message : fallback;
}

export const contentService = {
  async list(params: ContentListParams = {}): Promise<ContentListResult> {
    const response = await apiClient.get<ApiResponse<ContentApiRecord[]>>(CONTENT_ENDPOINT, {
      params: params.search?.trim() ? { search: params.search.trim() } : undefined,
    });
    const records = response.data.data.map(toContentRecord);
    const page = Math.max(1, Math.trunc(params.page ?? 1));
    const pageSize = Math.max(1, Math.trunc(params.pageSize ?? 10));
    const totalItems = records.length;
    return {
      items: records.slice((page - 1) * pageSize, page * pageSize),
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  },

  async get(id: string): Promise<ContentRecord> {
    const response = await apiClient.get<ApiResponse<ContentApiRecord>>(`${CONTENT_ENDPOINT}/${toNumericId(id)}`);
    return toContentRecord(response.data.data);
  },

  async create(input: ContentInput): Promise<ContentRecord> {
    const response = await apiClient.post<ApiResponse<ContentApiRecord>>(CONTENT_ENDPOINT, toContentApiInput(input, "ACTIVE"));
    return toContentRecord(response.data.data);
  },

  async update(id: string, input: ContentInput, status: ContentStatus): Promise<ContentRecord> {
    const response = await apiClient.put<ApiResponse<ContentApiRecord>>(
      `${CONTENT_ENDPOINT}/${toNumericId(id)}`,
      toContentApiInput(input, status),
    );
    return toContentRecord(response.data.data);
  },

  async setStatus(id: string, status: ContentStatus): Promise<ContentRecord> {
    const endpoint = status === "ACTIVE" ? "activate" : "deactivate";
    const response = await apiClient.post<ApiResponse<ContentApiRecord>>(
      `${CONTENT_ENDPOINT}/${toNumericId(id)}/${endpoint}`,
    );
    return toContentRecord(response.data.data);
  },
};
