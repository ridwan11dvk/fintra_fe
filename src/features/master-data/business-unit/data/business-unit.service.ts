import type {
  ApiResponse,
  PagedApiResponse,
  PaginationParams,
} from "@railfinance/core";
import { apiClient as axiosInstance } from "@railfinance/core";
import {
  createMockBusinessUnit,
  deleteMockBusinessUnit,
  getMockBusinessUnitById,
  getMockBusinessUnits,
  toggleMockBusinessUnit,
  updateMockBusinessUnit,
} from "./business-unit.mock";
import type {
  BusinessUnitRequest,
  BusinessUnitResponse,
} from "./business-unit.types";

const BUSINESS_UNIT_BASE_URL = "/master/business-unit";

export const businessUnitService = {
  /**
   * Get all business units with pagination and search
   */
  listBusinessUnits: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<BusinessUnitResponse>> => {
    try {
      const response = await axiosInstance.get<
        PagedApiResponse<BusinessUnitResponse>
      >(BUSINESS_UNIT_BASE_URL, { params });
      return response.data;
    } catch {
      return getMockBusinessUnits(params);
    }
  },

  /**
   * Get a single business unit by ID
   */
  getBusinessUnitById: async (
    id: string | number,
  ): Promise<ApiResponse<BusinessUnitResponse>> => {
    try {
      const response = await axiosInstance.get<
        ApiResponse<BusinessUnitResponse>
      >(`${BUSINESS_UNIT_BASE_URL}/${id}`);
      return response.data;
    } catch {
      const found = getMockBusinessUnitById(id);
      if (found) {
        return {
          status: "SUCCESS",
          data: found,
          message: "Business unit found",
        };
      }
      throw new Error("Business unit not found");
    }
  },

  /**
   * Create a new business unit
   */
  createBusinessUnit: async (
    data: BusinessUnitRequest,
  ): Promise<ApiResponse<BusinessUnitResponse>> => {
    try {
      const response = await axiosInstance.post<
        ApiResponse<BusinessUnitResponse>
      >(BUSINESS_UNIT_BASE_URL, data);
      return response.data;
    } catch {
      const created = createMockBusinessUnit(data);
      return {
        status: "SUCCESS",
        data: created,
        message: "Business unit created successfully",
      };
    }
  },

  /**
   * Update an existing business unit
   */
  updateBusinessUnit: async (
    id: string | number,
    data: BusinessUnitRequest,
  ): Promise<ApiResponse<BusinessUnitResponse>> => {
    try {
      const response = await axiosInstance.put<
        ApiResponse<BusinessUnitResponse>
      >(`${BUSINESS_UNIT_BASE_URL}/${id}`, data);
      return response.data;
    } catch {
      const updated = updateMockBusinessUnit(id, data);
      if (updated) {
        return {
          status: "SUCCESS",
          data: updated,
          message: "Business unit updated successfully",
        };
      }
      throw new Error("Business unit not found");
    }
  },

  /**
   * Delete a business unit by ID
   */
  deleteBusinessUnit: async (
    id: string | number,
  ): Promise<ApiResponse<string>> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<string>>(
        `${BUSINESS_UNIT_BASE_URL}/${id}`,
      );
      return response.data;
    } catch {
      deleteMockBusinessUnit(id);
      return {
        status: "SUCCESS",
        data: String(id),
        message: "Business unit deleted successfully",
      };
    }
  },

  /**
   * Toggle linked/active status of a business unit
   */
  toggleBusinessUnit: async (
    id: string | number,
  ): Promise<ApiResponse<BusinessUnitResponse>> => {
    try {
      const response = await axiosInstance.patch<
        ApiResponse<BusinessUnitResponse>
      >(`${BUSINESS_UNIT_BASE_URL}/${id}/toggle`);
      return response.data;
    } catch {
      const updated = toggleMockBusinessUnit(id);
      if (updated) {
        return {
          status: "SUCCESS",
          data: updated,
          message: `Business unit ${
            updated.isLinked ? "activated" : "deactivated"
          } successfully`,
        };
      }
      throw new Error("Business unit not found");
    }
  },
};
