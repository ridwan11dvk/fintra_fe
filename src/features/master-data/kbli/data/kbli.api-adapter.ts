import { apiClient } from "@railfinance/core/lib";
import { toPagedResult, getRecordId } from "../../shared/payable-api";
import type { KbliInput, KbliListParams, KbliListResult, KbliRecord, KbliStatus } from "./kbli.types";

type KbliDto = { id: number; code: string; category: string; businessFieldName: string; active: boolean };
type ApiResponse<T> = {
  data?: T | null;
  message?: string;
  status?: "SUCCESS" | "ERROR" | "WARNING";
  success?: boolean;
};

const ROOT = "/master-data/kbli";

function getResponseData<T>(response: ApiResponse<T> | T): T {
  if (response === null || response === undefined) {
    throw new Error("KBLI API request failed.");
  }

  if (typeof response !== "object" || Array.isArray(response)) {
    return response as T;
  }

  const envelope = response as ApiResponse<T>;
  const hasEnvelopeStatus = envelope.status !== undefined || envelope.success !== undefined;

  if (envelope.status === "ERROR" || envelope.success === false || envelope.data === null) {
    throw new Error(envelope.message || "KBLI API request failed.");
  }

  if (hasEnvelopeStatus) {
    if (!("data" in envelope) || envelope.data === undefined) {
      throw new Error(envelope.message || "KBLI API response did not include data.");
    }

    return envelope.data as T;
  }

  return response as T;
}

function toRecord(dto: KbliDto): KbliRecord {
  return {
    id: String(dto.id),
    code: dto.code,
    category: dto.category,
    businessFieldName: dto.businessFieldName,
    status: dto.active ? "ACTIVE" : "INACTIVE",
  };
}

function toBody(input: KbliInput) {
  return {
    code: input.code,
    category: input.category,
    businessFieldName: input.businessFieldName,
    active: input.status === "ACTIVE",
  };
}

export const kbliApiAdapter = {
  async list(params: KbliListParams = {}): Promise<KbliListResult> {
    const response = await apiClient.get<ApiResponse<KbliDto[]> | KbliDto[]>(ROOT);
    const data = getResponseData(response.data);
    let records = data.map(toRecord);
    const search = params.search?.trim().toLocaleLowerCase();
    if (search) records = records.filter((record) =>
      [record.code, record.businessFieldName, record.category].some((value) => value.toLocaleLowerCase().includes(search)),
    );
    return toPagedResult(records, params.page, params.pageSize);
  },
  async get(id: string): Promise<KbliRecord> {
    const response = await apiClient.get<ApiResponse<KbliDto> | KbliDto>(`${ROOT}/${getRecordId(id)}`);
    return toRecord(getResponseData(response.data));
  },
  async create(input: KbliInput): Promise<KbliRecord> {
    const response = await apiClient.post<ApiResponse<KbliDto> | KbliDto>(ROOT, toBody(input));
    return toRecord(getResponseData(response.data));
  },
  async update(id: string, input: KbliInput): Promise<KbliRecord> {
    const response = await apiClient.put<ApiResponse<KbliDto> | KbliDto>(`${ROOT}/${getRecordId(id)}`, toBody(input));
    return toRecord(getResponseData(response.data));
  },
  async setStatus(id: string, status: KbliStatus): Promise<KbliRecord> {
    const suffix = status === "ACTIVE" ? "activate" : "deactivate";
    const response = await apiClient.post<ApiResponse<KbliDto> | KbliDto>(`${ROOT}/${getRecordId(id)}/${suffix}`);
    return toRecord(getResponseData(response.data));
  },
};
