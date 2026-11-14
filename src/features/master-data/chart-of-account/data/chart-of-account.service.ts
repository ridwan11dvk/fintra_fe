import type {
  ApiResponse,
  ImportResponse,
  PagedApiResponse,
  PaginationParams,
} from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";
import { toDataTableResponse } from "../../shared/to-data-table-response";
import type {
  ChartOfAccountRequest,
  ChartOfAccountResponse,
} from "./chart-of-account.types";

const CHART_OF_ACCOUNT_BASE_URL = "/master-data/chart-of-accounts";

function toPagedResult<T>(items: T[], page = 1, pageSize = 10) {
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

function filterRecords(
  records: ChartOfAccountResponse[],
  search?: string,
): ChartOfAccountResponse[] {
  const query = search?.trim().toLocaleLowerCase();
  if (!query) return records;
  return records.filter((record) =>
    [record.code, record.name, record.description].some((value) =>
      value?.toLocaleLowerCase().includes(query),
    ),
  );
}

export const chartOfAccountService = {
  /**
   * Get all chart of accounts with pagination and search
   */
  listChartOfAccounts: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<ChartOfAccountResponse>> => {
    const search = params?.search?.trim() || undefined;
    const response = await axiosInstance.get<
      ApiResponse<ChartOfAccountResponse[]>
    >(CHART_OF_ACCOUNT_BASE_URL, {
      params: search ? { search } : undefined,
    });

    const rows = response.data?.data ?? [];
    const filtered = filterRecords(rows, search);
    const pageIndex = Math.max(0, Math.trunc(Number(params?.page) || 0));
    const pageSize = Math.max(
      1,
      Math.trunc(Number(params?.size || params?.pageSize) || 10),
    );
    const paged = toPagedResult(filtered, pageIndex + 1, pageSize);
    return toDataTableResponse(paged);
  },

  /**
   * Get a single chart of account by ID
   */
  getChartOfAccountById: async (
    id: string | number,
  ): Promise<ApiResponse<ChartOfAccountResponse>> => {
    const response = await axiosInstance.get<
      ApiResponse<ChartOfAccountResponse>
    >(`${CHART_OF_ACCOUNT_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Create a new chart of account
   */
  createChartOfAccount: async (
    data: ChartOfAccountRequest,
  ): Promise<ApiResponse<ChartOfAccountResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<ChartOfAccountResponse>
    >(CHART_OF_ACCOUNT_BASE_URL, {
      code: data.code,
      name: data.name,
      level: Number(data.level),
      description: data.description || "",
      active: data.active ?? true,
    });
    return response.data;
  },

  /**
   * Update an existing chart of account
   */
  updateChartOfAccount: async (
    id: string | number,
    data: ChartOfAccountRequest,
  ): Promise<ApiResponse<ChartOfAccountResponse>> => {
    const response = await axiosInstance.put<
      ApiResponse<ChartOfAccountResponse>
    >(`${CHART_OF_ACCOUNT_BASE_URL}/${id}`, {
      code: data.code,
      name: data.name,
      level: Number(data.level),
      description: data.description || "",
      active: data.active ?? true,
    });
    return response.data;
  },

  /**
   * Delete a chart of account by ID
   */
  deleteChartOfAccount: async (
    id: string | number,
  ): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${CHART_OF_ACCOUNT_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Activate a chart of account
   */
  activateChartOfAccount: async (
    id: string | number,
  ): Promise<ApiResponse<ChartOfAccountResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<ChartOfAccountResponse>
    >(`${CHART_OF_ACCOUNT_BASE_URL}/${id}/activate`);
    return response.data;
  },

  /**
   * Deactivate a chart of account
   */
  deactivateChartOfAccount: async (
    id: string | number,
  ): Promise<ApiResponse<ChartOfAccountResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<ChartOfAccountResponse>
    >(`${CHART_OF_ACCOUNT_BASE_URL}/${id}/deactivate`);
    return response.data;
  },

  /**
   * Import chart of accounts from Excel file
   */
  importChartOfAccounts: async (
    file: File,
    dryRun?: boolean,
  ): Promise<ApiResponse<ImportResponse>> => {
    const formData = new FormData();
    formData.append("file", file);
    if (dryRun !== undefined) {
      formData.append("dryRun", String(dryRun));
    }

    const response = await axiosInstance.post<ApiResponse<ImportResponse>>(
      `${CHART_OF_ACCOUNT_BASE_URL}/import`,
      formData,
      {
        params: dryRun === undefined ? undefined : { dryRun },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  /**
   * Download chart of account import template
   */
  downloadImportTemplate: async (): Promise<Blob> => {
    const response = await axiosInstance.get<Blob>(
      `${CHART_OF_ACCOUNT_BASE_URL}/import/template`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  },
};
