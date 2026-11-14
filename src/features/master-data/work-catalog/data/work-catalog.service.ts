import type {
  WorkCatalogRequest,
  WorkCatalogResponse,
} from "@/features/master-data/work-catalog/data/work-catalog.types";
import type {
  ApiResponse,
  PagedApiResponse,
  PaginationParams,
} from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const WORK_CATALOG_BASE_URL = "/master/work-catalog";

export const workCatalogService = {
  listWorkCatalogs: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<WorkCatalogResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<WorkCatalogResponse>
    >(WORK_CATALOG_BASE_URL, {
      params,
    });
    return response.data;
  },

  getActiveWorkCatalogs: async (): Promise<
    ApiResponse<WorkCatalogResponse[]>
  > => {
    const response = await axiosInstance.get<
      ApiResponse<WorkCatalogResponse[]>
    >(`${WORK_CATALOG_BASE_URL}/active`);
    return response.data;
  },

  getWorkCatalogsByCompanyAndBA: async (
    companyCode: string,
    baCode: string,
  ): Promise<ApiResponse<WorkCatalogResponse[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<WorkCatalogResponse[]>
    >(`${WORK_CATALOG_BASE_URL}/company/${companyCode}/ba/${baCode}`);
    return response.data;
  },

  getWorkCatalogById: async (
    id: number,
  ): Promise<ApiResponse<WorkCatalogResponse>> => {
    const response = await axiosInstance.get<
      ApiResponse<WorkCatalogResponse>
    >(`${WORK_CATALOG_BASE_URL}/${id}`);
    return response.data;
  },

  createWorkCatalog: async (
    data: WorkCatalogRequest,
  ): Promise<ApiResponse<WorkCatalogResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<WorkCatalogResponse>
    >(WORK_CATALOG_BASE_URL, data);
    return response.data;
  },

  updateWorkCatalog: async (
    id: number,
    data: WorkCatalogRequest,
  ): Promise<ApiResponse<WorkCatalogResponse>> => {
    const response = await axiosInstance.put<
      ApiResponse<WorkCatalogResponse>
    >(`${WORK_CATALOG_BASE_URL}/${id}`, data);
    return response.data;
  },

  deleteWorkCatalog: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${WORK_CATALOG_BASE_URL}/${id}`,
    );
    return response.data;
  },

  activateWorkCatalog: async (
    id: number,
  ): Promise<ApiResponse<WorkCatalogResponse>> => {
    const response = await axiosInstance.patch<
      ApiResponse<WorkCatalogResponse>
    >(`${WORK_CATALOG_BASE_URL}/${id}/activate`);
    return response.data;
  },

  deactivateWorkCatalog: async (
    id: number,
  ): Promise<ApiResponse<WorkCatalogResponse>> => {
    const response = await axiosInstance.patch<
      ApiResponse<WorkCatalogResponse>
    >(`${WORK_CATALOG_BASE_URL}/${id}/deactivate`);
    return response.data;
  },
};
