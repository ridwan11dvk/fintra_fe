import { apiClient } from "@railfinance/core/lib";
import type { ApiResponse } from "@railfinance/core";
import {
  getStoredFinancialControlValidation,
  saveStoredFinancialControlValidation,
} from "./setup-configuration.mock";
import type {
  ComplianceFsscItem,
  FinancialControlValidationItem,
  SaveComplianceFsscRequest,
  SaveFinancialControlValidationRequest,
} from "./setup-configuration.types";

const FSSC_CHECKLIST_ENDPOINT = "/master-data/fssc-checklists";

interface FsscChecklistApiResponse {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
}

export const setupConfigurationService = {
  getComplianceFsscItems: async (): Promise<
    ApiResponse<ComplianceFsscItem[]>
  > => {
    const response = await apiClient.get<ApiResponse<FsscChecklistApiResponse[]>>(
      FSSC_CHECKLIST_ENDPOINT,
    );
    const items: ComplianceFsscItem[] = (response.data.data ?? []).map((dto) => ({
      id: String(dto.id),
      name: dto.name,
      description: dto.description ?? "",
    }));

    return {
      status: response.data.status ?? "SUCCESS",
      message: response.data.message ?? "FSSC checklist items retrieved successfully",
      data: items,
    };
  },

  saveComplianceFsscItems: async (
    request: SaveComplianceFsscRequest,
  ): Promise<ApiResponse<ComplianceFsscItem[]>> => {
    const payload = {
      items: request.items.map((item) => ({
        id:
          item.id && !item.id.startsWith("fssc-") && Number.isInteger(Number(item.id))
            ? Number(item.id)
            : null,
        name: item.name.trim(),
        description: item.description ? item.description.trim() : null,
      })),
    };

    const response = await apiClient.put<ApiResponse<FsscChecklistApiResponse[]>>(
      `${FSSC_CHECKLIST_ENDPOINT}/batch`,
      payload,
    );

    const saved: ComplianceFsscItem[] = (response.data.data ?? []).map((dto) => ({
      id: String(dto.id),
      name: dto.name,
      description: dto.description ?? "",
    }));

    return {
      status: response.data.status ?? "SUCCESS",
      message: response.data.message ?? "Compliance & Checklist FSSC saved successfully",
      data: saved,
    };
  },

  getFinancialControlValidationItems: async (): Promise<
    ApiResponse<FinancialControlValidationItem[]>
  > => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const data = getStoredFinancialControlValidation();
    return {
      status: "SUCCESS",
      message: "Financial Control Validation retrieved successfully",
      data,
    };
  },

  saveFinancialControlValidationItems: async (
    request: SaveFinancialControlValidationRequest,
  ): Promise<ApiResponse<FinancialControlValidationItem[]>> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const saved = saveStoredFinancialControlValidation(request.items);
    return {
      status: "SUCCESS",
      message: "Financial Control Validation saved successfully",
      data: saved,
    };
  },
};
