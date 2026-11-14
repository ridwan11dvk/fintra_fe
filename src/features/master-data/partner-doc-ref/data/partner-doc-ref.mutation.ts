import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { partnerDocRefQueryKeys } from "./partner-doc-ref.query";
import { partnerDocRefService } from "./partner-doc-ref.service";
import type {
  PartnerDocRefRequest,
  PartnerDocRefResponse,
} from "./partner-doc-ref.types";

/**
 * Hook to create a new partner document reference
 */
export const useCreatePartnerDocRefMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerDocRefResponse>,
      Error,
      PartnerDocRefRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => partnerDocRefService.createPartnerDocRef(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [partnerDocRefQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a partner document reference
 */
export const useUpdatePartnerDocRefMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerDocRefResponse>,
      Error,
      { id: number; data: PartnerDocRefRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) =>
      partnerDocRefService.updatePartnerDocRef(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerDocRefQueryKeys.all,
    partnerDocRefQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a partner document reference
 */
export const useDeletePartnerDocRefMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => partnerDocRefService.deletePartnerDocRef(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerDocRefQueryKeys.lists(),
    partnerDocRefQueryKeys.detail(mutation.variables || 0),
  ]);

  return mutation;
};
