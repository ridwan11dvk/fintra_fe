import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { partnerClassificationQueryKeys } from "./partner-classification.query";
import { partnerClassificationService } from "./partner-classification.service";
import type {
  PartnerClassificationRequest,
  PartnerClassificationResponse,
} from "./partner-classification.types";

/**
 * Hook to create a new partner classification
 */
export const useCreatePartnerClassificationMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerClassificationResponse>,
      Error,
      PartnerClassificationRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) =>
      partnerClassificationService.createPartnerClassification(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [partnerClassificationQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a partner classification
 */
export const useUpdatePartnerClassificationMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerClassificationResponse>,
      Error,
      { id: number; data: PartnerClassificationRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) =>
      partnerClassificationService.updatePartnerClassification(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerClassificationQueryKeys.all,
    partnerClassificationQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a partner classification
 */
export const useDeletePartnerClassificationMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) =>
      partnerClassificationService.deletePartnerClassification(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerClassificationQueryKeys.lists(),
    partnerClassificationQueryKeys.detail(mutation.variables || 0),
  ]);

  return mutation;
};
