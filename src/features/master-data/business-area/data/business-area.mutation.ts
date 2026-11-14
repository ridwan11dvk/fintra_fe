import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { businessAreaQueryKeys } from "./business-area.query";
import { businessAreaService } from "./business-area.service";
import type {
  BusinessAreaImportResponse,
  BusinessAreaRequest,
  BusinessAreaResponse,
} from "./business-area.types";

/**
 * Hook to create a new business area
 */
export const useCreateBusinessAreaMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<BusinessAreaResponse>,
      Error,
      BusinessAreaRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => businessAreaService.createBusinessArea(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [businessAreaQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a business area
 */
export const useUpdateBusinessAreaMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<BusinessAreaResponse>,
      Error,
      { id: number; data: BusinessAreaRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) =>
      businessAreaService.updateBusinessArea(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    businessAreaQueryKeys.all,
    businessAreaQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a business area
 */
export const useDeleteBusinessAreaMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => businessAreaService.deleteBusinessArea(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [businessAreaQueryKeys.all]);

  return mutation;
};

/**
 * Hook to import business areas from Excel file
 */
export const useImportBusinessAreasMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<BusinessAreaImportResponse>,
      Error,
      { file: File; dryRun?: boolean }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ file, dryRun }) =>
      businessAreaService.importBusinessAreas(file, dryRun),
    ...options,
  });

  useHandleMutationResponse(mutation, [businessAreaQueryKeys.all]);

  return mutation;
};
