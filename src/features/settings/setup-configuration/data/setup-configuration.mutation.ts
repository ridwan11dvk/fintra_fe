import type { ApiResponse } from "@railfinance/core";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { setupConfigurationService } from "./setup-configuration.service";
import type {
  ComplianceFsscItem,
  FinancialControlValidationItem,
  SaveComplianceFsscRequest,
  SaveFinancialControlValidationRequest,
} from "./setup-configuration.types";

export const useSaveComplianceFsscMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<ComplianceFsscItem[]>,
      Error,
      SaveComplianceFsscRequest
    >,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: (data) =>
      setupConfigurationService.saveComplianceFsscItems(data),
    ...options,
  });
};

export const useSaveFinancialControlValidationMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<FinancialControlValidationItem[]>,
      Error,
      SaveFinancialControlValidationRequest
    >,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: (data) =>
      setupConfigurationService.saveFinancialControlValidationItems(data),
    ...options,
  });
};
