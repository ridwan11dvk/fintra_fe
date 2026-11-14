import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";
import type {
  M2mClientAuditResponse,
  M2mClientCreateApiResponse,
  M2mClientPermissionRequest,
  M2mClientRequest,
  M2mClientResponse,
  M2mClientUpdateRequest,
} from "./m2m-client.types";

const M2M_CLIENT_BASE_URL = "/m2m-clients";

export const m2mClientService = {
  getClients: async (
    params: PaginationParams,
  ): Promise<PagedApiResponse<M2mClientResponse>> => {
    const response = await axiosInstance.get(M2M_CLIENT_BASE_URL, { params });
    return response.data;
  },

  getClientById: async (
    id: number,
  ): Promise<ApiResponse<M2mClientResponse>> => {
    const response = await axiosInstance.get(`${M2M_CLIENT_BASE_URL}/${id}`);
    return response.data;
  },

  createClient: async (
    client: M2mClientRequest,
  ): Promise<M2mClientCreateApiResponse> => {
    const response = await axiosInstance.post(M2M_CLIENT_BASE_URL, client);
    return response.data;
  },

  updateClient: async (
    id: number,
    client: M2mClientUpdateRequest,
  ): Promise<ApiResponse<M2mClientResponse>> => {
    const response = await axiosInstance.put(
      `${M2M_CLIENT_BASE_URL}/${id}`,
      client,
    );
    return response.data;
  },

  deleteClient: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(`${M2M_CLIENT_BASE_URL}/${id}`);
    return response.data;
  },

  regenerateToken: async (id: number): Promise<M2mClientCreateApiResponse> => {
    const response = await axiosInstance.post(
      `${M2M_CLIENT_BASE_URL}/${id}/regenerate-token`,
    );
    return response.data;
  },

  updatePermissions: async (
    id: number,
    permissions: M2mClientPermissionRequest,
  ): Promise<ApiResponse<M2mClientResponse>> => {
    const response = await axiosInstance.put(
      `${M2M_CLIENT_BASE_URL}/${id}/permissions`,
      permissions,
    );
    return response.data;
  },

  getAuditLog: async (
    id: number,
    params: PaginationParams,
  ): Promise<PagedApiResponse<M2mClientAuditResponse>> => {
    const response = await axiosInstance.get(
      `${M2M_CLIENT_BASE_URL}/${id}/audit`,
      {
        params,
      },
    );
    return response.data;
  },
};
