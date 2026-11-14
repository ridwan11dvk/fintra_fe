import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { countryQueryKeys } from "./country.query";
import { countryService } from "./country.service";
import type { CountryRequest, CountryResponse } from "./country.types";

/**
 * Hook to create a new country
 */
export const useCreateCountryMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<CountryResponse>, Error, CountryRequest>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => countryService.createCountry(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [countryQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a country
 */
export const useUpdateCountryMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<CountryResponse>,
      Error,
      { id: number; data: CountryRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => countryService.updateCountry(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    countryQueryKeys.all,
    countryQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a country
 */
export const useDeleteCountryMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => countryService.deleteCountry(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [countryQueryKeys.all]);

  return mutation;
};
