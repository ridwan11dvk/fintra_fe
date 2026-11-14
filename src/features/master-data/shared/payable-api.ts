import { apiClient } from "@railfinance/core/lib";

type PayableEnvelope<T> = ({ success: boolean } | { status: "SUCCESS" | "ERROR" }) & {
  message?: string;
  data: T;
};

const configuredBaseUrl =
  import.meta.env.VITE_PAYABLE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || "";

function payableEndpoint(path: string): string {
  if (!configuredBaseUrl) {
    throw new Error("Payable API base URL is not configured.");
  }

  let base = configuredBaseUrl;
  while (base.endsWith("/")) base = base.slice(0, -1);
  if (base.toLocaleLowerCase().endsWith("/api")) base = base.slice(0, -4);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

function unwrap<T>(payload: PayableEnvelope<T> | T): T {
  if (payload && typeof payload === "object" && (
    ("status" in payload && payload.status === "ERROR") ||
    ("success" in payload && payload.success === false)
  )) {
    const message = "message" in payload && typeof payload.message === "string" ? payload.message : undefined;
    throw new Error(message || "Payable API request failed.");
  }
  if (payload && typeof payload === "object" && "data" in payload && ("success" in payload || "status" in payload)) {
    const envelope: PayableEnvelope<T> = payload;
    const succeeded = "success" in envelope ? envelope.success : envelope.status === "SUCCESS";
    if (!succeeded) throw new Error(envelope.message || "Payable API request failed.");
    return envelope.data;
  }
  return payload as T;
}

export const payableApi = {
  async get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
    const response = await apiClient.get<PayableEnvelope<T> | T>(payableEndpoint(path), { params });
    return unwrap(response.data);
  },
  async post<T>(path: string, body?: unknown): Promise<T> {
    const response = await apiClient.post<PayableEnvelope<T> | T>(payableEndpoint(path), body);
    return unwrap(response.data);
  },
  async put<T>(path: string, body?: unknown): Promise<T> {
    const response = await apiClient.put<PayableEnvelope<T> | T>(payableEndpoint(path), body);
    return unwrap(response.data);
  },
  async delete<T>(path: string): Promise<T> {
    const response = await apiClient.delete<PayableEnvelope<T> | T>(payableEndpoint(path));
    return unwrap(response.data);
  },
};

/** API adapters activate when a dedicated Payable URL is configured or outside local development. */
export const usePayableMasterDataApi =
  Boolean(import.meta.env.VITE_PAYABLE_API_BASE_URL) || !import.meta.env.DEV;

export function toPagedResult<T>(items: T[], page = 1, pageSize = 10) {
  const safePage = Math.max(1, Math.trunc(page));
  const safePageSize = Math.max(1, Math.trunc(pageSize));
  const start = (safePage - 1) * safePageSize;
  return {
    items: items.slice(start, start + safePageSize),
    page: safePage,
    pageSize: safePageSize,
    totalItems: items.length,
    totalPages: Math.ceil(items.length / safePageSize),
  };
}

export function getRecordId(id: string): number {
  const numericId = Number(id);
  if (!Number.isSafeInteger(numericId) || numericId <= 0) {
    throw new Error(`Invalid Payable master-data record id: ${id}`);
  }
  return numericId;
}
