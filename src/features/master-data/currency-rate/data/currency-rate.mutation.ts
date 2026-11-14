import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { currencyRateQueryKeys } from "./currency-rate.query";
import { currencyRateService } from "./currency-rate.service";
import type {
  CurrencyRateRequest,
  CurrencyRateResponse,
} from "./currency-rate.types";

/**
 * Hook to create a new currency rate
 */
export const useCreateCurrencyRateMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<CurrencyRateResponse>,
      Error,
      CurrencyRateRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => currencyRateService.createCurrencyRate(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [currencyRateQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a currency rate
 */
export const useUpdateCurrencyRateMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<CurrencyRateResponse>,
      Error,
      { id: number; data: CurrencyRateRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) =>
      currencyRateService.updateCurrencyRate(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    currencyRateQueryKeys.all,
    currencyRateQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a currency rate
 */
export const useDeleteCurrencyRateMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => currencyRateService.deleteCurrencyRate(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [currencyRateQueryKeys.all]);

  return mutation;
};

/** Hook to sync currency rates with external source
 */
export const useSyncCurrencyRatesMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, void>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: () => currencyRateService.syncCurrencyRates(),
    ...options,
  });

  useHandleMutationResponse(mutation, [currencyRateQueryKeys.all]);
  return mutation;
};
