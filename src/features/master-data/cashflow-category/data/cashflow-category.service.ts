import type {
  CashflowCategoryRequest,
  CashflowCategoryResponse,
} from "@/features/master-data/cashflow-category/data/cashflow-category.types";
import {
  getRecordId,
  toPagedResult,
} from "@/features/master-data/shared/payable-api";
import { toDataTableResponse } from "@/features/master-data/shared/to-data-table-response";
import { apiClient } from "@railfinance/core/lib";
import type {
  ApiResponse,
  PagedApiResponse,
  PaginationParams,
} from "@railfinance/core/types";

const CASHFLOW_CATEGORY_LIST_URL = "/master-data/cashflow-categories";

type CashflowCategoryDto = {
  id: number;
  code?: string;
  name?: string;
  label?: string;
  description?: string;
  active: boolean;
};

function toResponse(row: CashflowCategoryDto): CashflowCategoryResponse {
  return {
    id: row.id,
    code: row.code ?? "",
    name: row.name || row.label || "",
    description: row.description ?? "",
    status: row.active ? "ACTIVE" : "INACTIVE",
  };
}

function filterRecords(records: CashflowCategoryResponse[], search?: string) {
  const query = search?.trim().toLocaleLowerCase();
  if (!query) return records;
  return records.filter((record) =>
    [record.code, record.name, record.description].some((value) =>
      value.toLocaleLowerCase().includes(query),
    ),
  );
}

function toPagedResponse(
  records: CashflowCategoryResponse[],
  params?: PaginationParams,
): PagedApiResponse<CashflowCategoryResponse> {
  const pageIndex = Math.max(0, Math.trunc(params?.page ?? 0));
  const pageSize = Math.max(1, Math.trunc(params?.size ?? 10));
  const filtered = filterRecords(records, params?.search);
  const page = toPagedResult(filtered, pageIndex + 1, pageSize);
  return toDataTableResponse(page);
}

type CashflowCategoryBody = {
  status?: string;
  message?: string;
  data?: CashflowCategoryDto | CashflowCategoryDto[];
};

function readListRows(
  payload: CashflowCategoryBody | CashflowCategoryDto[],
): CashflowCategoryDto[] {
  if (Array.isArray(payload)) return payload;
  if (payload.status === "ERROR") {
    throw new Error(payload.message || "Failed to load cashflow categories");
  }
  if (Array.isArray(payload.data)) return payload.data;
  return [];
}

function readRecord(
  payload: CashflowCategoryBody | CashflowCategoryDto,
  fallbackMessage: string,
): { record: CashflowCategoryDto; message: string } {
  if ("status" in payload && payload.status === "ERROR") {
    throw new Error(payload.message || fallbackMessage);
  }
  if ("id" in payload) {
    return { record: payload, message: fallbackMessage };
  }
  const data = payload.data;
  if (data && !Array.isArray(data)) {
    return { record: data, message: payload.message || fallbackMessage };
  }
  throw new Error(fallbackMessage);
}

function success<T>(data: T, message: string): ApiResponse<T> {
  return { status: "SUCCESS", message, data };
}

function buildCashflowCategoryBody(data: CashflowCategoryRequest) {
  const body: { label: string; description: string; code?: string } = {
    label: data.name.trim(),
    description: data.description.trim(),
  };
  const code = data.code?.trim();
  if (code) body.code = code;
  return body;
}

export const cashflowCategoryService = {
  listCashflowCategories: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<CashflowCategoryResponse>> => {
    const page = Math.max(0, Math.trunc(params?.page ?? 0));
    const size = Math.max(1, Math.trunc(params?.size ?? 10));
    const response = await apiClient.get<
      CashflowCategoryBody | CashflowCategoryDto[]
    >(CASHFLOW_CATEGORY_LIST_URL, { params: { page, size } });
    return toPagedResponse(readListRows(response.data).map(toResponse), params);
  },

  getCashflowCategoryById: async (
    id: number,
  ): Promise<ApiResponse<CashflowCategoryResponse>> => {
    const response = await apiClient.get<
      CashflowCategoryBody | CashflowCategoryDto
    >(`${CASHFLOW_CATEGORY_LIST_URL}/${getRecordId(String(id))}`);
    const { record, message } = readRecord(
      response.data,
      "Data fetched successfully",
    );
    return success(toResponse(record), message);
  },

  createCashflowCategory: async (
    data: CashflowCategoryRequest,
  ): Promise<ApiResponse<CashflowCategoryResponse>> => {
    const response = await apiClient.post<
      CashflowCategoryBody | CashflowCategoryDto
    >(CASHFLOW_CATEGORY_LIST_URL, buildCashflowCategoryBody(data));
    const { record, message } = readRecord(
      response.data,
      "Cashflow category created",
    );
    return success(toResponse(record), message);
  },

  updateCashflowCategory: async (
    id: number,
    data: CashflowCategoryRequest,
  ): Promise<ApiResponse<CashflowCategoryResponse>> => {
    const response = await apiClient.put<
      CashflowCategoryBody | CashflowCategoryDto
    >(
      `${CASHFLOW_CATEGORY_LIST_URL}/${getRecordId(String(id))}`,
      buildCashflowCategoryBody(data),
    );
    const { record, message } = readRecord(
      response.data,
      "Cashflow category updated",
    );
    return success(toResponse(record), message);
  },

  activateCashflowCategory: async (
    id: number,
  ): Promise<ApiResponse<CashflowCategoryResponse>> => {
    return patchCashflowCategoryStatus(id, "activate");
  },

  deactivateCashflowCategory: async (
    id: number,
  ): Promise<ApiResponse<CashflowCategoryResponse>> => {
    return patchCashflowCategoryStatus(id, "deactivate");
  },
};

function patchCashflowCategoryStatus(
  id: number,
  action: "activate" | "deactivate",
): Promise<ApiResponse<CashflowCategoryResponse>> {
  return apiClient
    .post<
      CashflowCategoryBody | CashflowCategoryDto
    >(`${CASHFLOW_CATEGORY_LIST_URL}/${getRecordId(String(id))}/${action}`)
    .then((response) => {
      const { record, message } = readRecord(
        response.data,
        action === "activate"
          ? "Cashflow category activated"
          : "Cashflow category deactivated",
      );
      return success(toResponse(record), message);
    });
}
