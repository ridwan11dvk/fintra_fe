import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { companyTaxQueryKeys } from "./company-tax.query";
import { companyTaxService } from "./company-tax.service";
import type {
  CompanyTaxRequest,
  CompanyTaxResponse,
} from "./company-tax.types";

export const useCreateCompanyTaxMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<CompanyTaxResponse>,
      Error,
      CompanyTaxRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => companyTaxService.createCompanyTax(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [companyTaxQueryKeys.all]);

  return mutation;
};

export const useUpdateCompanyTaxMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<CompanyTaxResponse>,
      Error,
      { id: number; data: CompanyTaxRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => companyTaxService.updateCompanyTax(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    companyTaxQueryKeys.all,
    companyTaxQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

export const useDeleteCompanyTaxMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => companyTaxService.deleteCompanyTax(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [companyTaxQueryKeys.all]);

  return mutation;
};
