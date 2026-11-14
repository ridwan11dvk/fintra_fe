import type {
  CashflowGroupRequest,
  CashflowGroupResponse,
  CashflowType,
} from "@/features/master-data/cashflow-group/data/cashflow-group.types";
import { toDataTableResponse } from "@/features/master-data/shared/to-data-table-response";
import {
  getRecordId,
  payableApi,
  toPagedResult,
  usePayableMasterDataApi,
} from "@/features/master-data/shared/payable-api";
import { apiClient } from "@railfinance/core/lib";
import type {
  ApiResponse,
  PagedApiResponse,
  PaginationParams,
} from "@railfinance/core/types";

const CASHFLOW_GROUP_BASE_URL = "/api/master-data/cashflow-groups";
const CASHFLOW_GROUP_LIST_URL = "/master-data/cashflow-groups";

type CashflowGroupDto = {
  id: number;
  name?: string;
  label?: string;
  code?: string;
  categoryCode?: string;
  categoryName?: string;
  cashflowGroupId?: number | string;
  cashflowGroupName?: string;
  cashflowType?: string;
  exception?: string;
  description?: string;
  active?: boolean;
  canDelete?: boolean;
};

type CashflowGroupBody = {
  status?: string;
  message?: string;
  data?: CashflowGroupDto | CashflowGroupDto[] | { content?: CashflowGroupDto[] };
};

const devRecords: CashflowGroupResponse[] = [
  {
    id: 1,
    code: "OPR-01",
    name: "Operating Receipt",
    cashflowGroupId: "1",
    cashflowGroupName: "Operating",
    cashflowType: "RECIPIENT",
    exception: "1",
    description: "Operating cash inflow",
    status: "ACTIVE",
    canDelete: true,
  },
  {
    id: 2,
    code: "INV-01",
    name: "Investing Provider",
    cashflowGroupId: "2",
    cashflowGroupName: "Investing",
    cashflowType: "PROVIDER",
    exception: "0",
    description: "Investing cash outflow",
    status: "ACTIVE",
    canDelete: false,
  },
  {
    id: 3,
    code: "FIN-01",
    name: "Financing Exception",
    cashflowGroupId: "3",
    cashflowGroupName: "Financing",
    cashflowType: "RECIPIENT",
    exception: "1",
    description: "",
    status: "INACTIVE",
    canDelete: true,
  },
];

function toCashflowType(value?: string): CashflowType {
  return value === "PROVIDER" ? "PROVIDER" : "RECIPIENT";
}

function toResponse(row: CashflowGroupDto): CashflowGroupResponse {
  const cashflowGroupId = String(row.cashflowGroupId ?? row.categoryCode ?? "");
  return {
    id: row.id,
    code: row.code ?? "",
    name: row.name || row.label || "",
    cashflowGroupId,
    cashflowGroupName:
      row.cashflowGroupName || row.categoryName || row.categoryCode || cashflowGroupId,
    cashflowType: toCashflowType(row.cashflowType),
    exception: row.exception ?? "",
    description: row.description ?? "",
    status: row.active === false ? "INACTIVE" : "ACTIVE",
    canDelete: row.canDelete ?? true,
  };
}

function filterRecords(records: CashflowGroupResponse[], search?: string) {
  const query = search?.trim().toLocaleLowerCase();
  if (!query) return records;
  return records.filter((record) =>
    [
      record.code,
      record.name,
      record.cashflowGroupName,
      record.cashflowType,
      record.description,
    ].some((value) => value.toLocaleLowerCase().includes(query)),
  );
}

function toPagedResponse(
  records: CashflowGroupResponse[],
  params?: PaginationParams,
): PagedApiResponse<CashflowGroupResponse> {
  const pageIndex = Math.max(0, Math.trunc(params?.page ?? 0));
  const pageSize = Math.max(1, Math.trunc(params?.size ?? 10));
  const filtered = filterRecords(records, params?.search);
  const page = toPagedResult(filtered, pageIndex + 1, pageSize);
  return toDataTableResponse(page);
}

function success<T>(data: T, message: string): ApiResponse<T> {
  return { status: "SUCCESS", message, data };
}

function readListRows(
  payload: CashflowGroupBody | CashflowGroupDto[],
): CashflowGroupDto[] {
  if (Array.isArray(payload)) return payload;
  if (payload.status === "ERROR") {
    throw new Error(payload.message || "Failed to load cashflow groups");
  }
  if (Array.isArray(payload.data)) return payload.data;
  if (payload.data && "content" in payload.data) return payload.data.content ?? [];
  return [];
}

function readRecord(
  payload: CashflowGroupBody | CashflowGroupDto,
  fallbackMessage: string,
): { record: CashflowGroupDto; message: string } {
  if ("status" in payload && payload.status === "ERROR") {
    throw new Error(payload.message || fallbackMessage);
  }
  if ("id" in payload) {
    return { record: payload, message: fallbackMessage };
  }
  const data = payload.data;
  if (data && !Array.isArray(data) && "id" in data) {
    return { record: data, message: payload.message || fallbackMessage };
  }
  throw new Error(fallbackMessage);
}

function findDevRecord(id: number) {
  const record = devRecords.find((item) => item.id === id);
  if (!record) throw new Error(`Cashflow Group "${id}" was not found.`);
  return record;
}

export const cashflowGroupService = {
  listCashflowGroups: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<CashflowGroupResponse>> => {
    const page = Math.max(0, Math.trunc(params?.page ?? 0));
    const size = Math.max(1, Math.trunc(params?.size ?? 10));
    const response = await apiClient.get<CashflowGroupBody | CashflowGroupDto[]>(
      CASHFLOW_GROUP_LIST_URL,
      { params: { page, size } },
    );
    return toPagedResponse(readListRows(response.data).map(toResponse), params);
  },

  getCashflowGroupById: async (
    id: number,
  ): Promise<ApiResponse<CashflowGroupResponse>> => {
    const response = await apiClient.get<CashflowGroupBody | CashflowGroupDto>(
      `${CASHFLOW_GROUP_LIST_URL}/${getRecordId(String(id))}`,
    );
    const { record, message } = readRecord(
      response.data,
      "Data fetched successfully",
    );
    return success(toResponse(record), message);
  },

  createCashflowGroup: async (
    data: CashflowGroupRequest,
  ): Promise<ApiResponse<CashflowGroupResponse>> => {
    const response = await apiClient.post<CashflowGroupBody | CashflowGroupDto>(
      CASHFLOW_GROUP_LIST_URL,
      {
        code: data.code.trim(),
        name: data.name.trim(),
        categoryCode: data.cashflowGroupId.trim(),
        cashflowType: data.cashflowType,
        exception: data.exception,
        description: data.description.trim(),
      },
    );
    const { record, message } = readRecord(
      response.data,
      "Cashflow group created",
    );
    return success(toResponse(record), message);
  },

  updateCashflowGroup: async (
    id: number,
    data: CashflowGroupRequest,
  ): Promise<ApiResponse<CashflowGroupResponse>> => {
    const response = await apiClient.put<CashflowGroupBody | CashflowGroupDto>(
      `${CASHFLOW_GROUP_LIST_URL}/${getRecordId(String(id))}`,
      {
        code: data.code.trim(),
        name: data.name.trim(),
        categoryCode: data.cashflowGroupId.trim(),
        cashflowType: data.cashflowType,
        exception: data.exception,
        description: data.description.trim(),
      },
    );
    const { record, message } = readRecord(
      response.data,
      "Cashflow group updated",
    );
    return success(toResponse(record), message);
  },

  activateCashflowGroup: async (
    id: number,
  ): Promise<ApiResponse<CashflowGroupResponse>> => {
    const response = await apiClient.post<CashflowGroupBody | CashflowGroupDto>(
      `${CASHFLOW_GROUP_LIST_URL}/${getRecordId(String(id))}/activate`,
    );
    const { record, message } = readRecord(
      response.data,
      "Cashflow group activated",
    );
    return success(toResponse(record), message);
  },

  deactivateCashflowGroup: async (
    id: number,
  ): Promise<ApiResponse<CashflowGroupResponse>> => {
    const response = await apiClient.post<CashflowGroupBody | CashflowGroupDto>(
      `${CASHFLOW_GROUP_LIST_URL}/${getRecordId(String(id))}/deactivate`,
    );
    const { record, message } = readRecord(
      response.data,
      "Cashflow group deactivated",
    );
    return success(toResponse(record), message);
  },

  deleteCashflowGroup: async (id: number): Promise<ApiResponse<null>> => {
    if (!usePayableMasterDataApi) {
      const record = findDevRecord(id);
      if (!record.canDelete) {
        throw new Error("This Cashflow Group is in use and cannot be deleted.");
      }
      const index = devRecords.findIndex((item) => item.id === id);
      devRecords.splice(index, 1);
      return success(null, "Cashflow group deleted");
    }
    await payableApi.delete<unknown>(
      `${CASHFLOW_GROUP_BASE_URL}/${getRecordId(String(id))}`,
    );
    return success(null, "Cashflow group deleted");
  },
};
