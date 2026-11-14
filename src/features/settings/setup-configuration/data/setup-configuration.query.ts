import type { ApiResponse } from "@railfinance/core";
import { toast } from "@railfinance/core";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { setupConfigurationService } from "./setup-configuration.service";
import type {
  ComplianceFsscItem,
  FinancialControlValidationItem,
} from "./setup-configuration.types";

export const setupConfigurationQueryKeys = {
  all: ["setupConfiguration"],
  complianceFssc: () => [...setupConfigurationQueryKeys.all, "complianceFssc"],
  financialControlValidation: () => [
    ...setupConfigurationQueryKeys.all,
    "financialControlValidation",
  ],
};

export const useGetComplianceFsscItems = (
  options?: Omit<
    UseQueryOptions<ApiResponse<ComplianceFsscItem[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: setupConfigurationQueryKeys.complianceFssc(),
    queryFn: () => setupConfigurationService.getComplianceFsscItems(),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error("Failed to load Compliance FSSC checklist");
    }
  }, [query.isError]);

  return query;
};

export const useGetFinancialControlValidationItems = (
  options?: Omit<
    UseQueryOptions<ApiResponse<FinancialControlValidationItem[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: setupConfigurationQueryKeys.financialControlValidation(),
    queryFn: () =>
      setupConfigurationService.getFinancialControlValidationItems(),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error("Failed to load Financial Control Validation");
    }
  }, [query.isError]);

  return query;
};
