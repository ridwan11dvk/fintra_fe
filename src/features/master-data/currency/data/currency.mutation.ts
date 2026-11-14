import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { currencyQueryKeys } from "./currency.query";
import { currencyService } from "./currency.service";
import type { CurrencyRequest, CurrencyResponse } from "./currency.types";

/**
 * Hook to create a new currency
 */
export const useCreateCurrencyMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<CurrencyResponse>, Error, CurrencyRequest>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => currencyService.createCurrency(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [currencyQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a currency
 */
export const useUpdateCurrencyMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<CurrencyResponse>,
      Error,
      { id: number; data: CurrencyRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => currencyService.updateCurrency(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    currencyQueryKeys.all,
    currencyQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a currency
 */
export const useDeleteCurrencyMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => currencyService.deleteCurrency(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [currencyQueryKeys.all]);

  return mutation;
};

/**
 * Hook to sync currencies with external source
 */
export const useSyncCurrenciesMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, void>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: () => currencyService.syncCurrencies(),
    ...options,
  });

  useHandleMutationResponse(mutation, [currencyQueryKeys.all]);

  return mutation;
};
