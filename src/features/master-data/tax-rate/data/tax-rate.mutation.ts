import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { taxRateQueryKeys } from "./tax-rate.query";
import { taxRateService } from "./tax-rate.service";
import type { TaxRateRequest, TaxRateResponse } from "./tax-rate.types";

/**
 * Hook to create a new tax rate
 */
export const useCreateTaxRateMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<TaxRateResponse>, Error, TaxRateRequest>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => taxRateService.createTaxRate(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [taxRateQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a tax rate
 */
export const useUpdateTaxRateMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<TaxRateResponse>,
      Error,
      { id: number; data: TaxRateRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => taxRateService.updateTaxRate(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    taxRateQueryKeys.all,
    taxRateQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a tax rate
 */
export const useDeleteTaxRateMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => taxRateService.deleteTaxRate(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    taxRateQueryKeys.lists(),
    taxRateQueryKeys.detail(mutation.variables || 0),
  ]);

  return mutation;
};
