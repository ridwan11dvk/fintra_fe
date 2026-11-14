import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { faqQueryKeys } from "./faq.query";
import { faqService } from "./faq.service";
import type { FaqRequest, FaqResponse } from "./faq.types";

/**
 * Hook to create a new FAQ
 */
export const useCreateFaqMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<FaqResponse>, Error, FaqRequest>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data: FaqRequest) => faqService.createFaq(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [faqQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a FAQ
 */
export const useUpdateFaqMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<FaqResponse>,
      Error,
      { id: number; data: FaqRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FaqRequest }) =>
      faqService.updateFaq(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    faqQueryKeys.all,
    faqQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a FAQ
 */
export const useDeleteFaqMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id: number) => faqService.deleteFaq(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    faqQueryKeys.lists(),
    faqQueryKeys.detail(mutation.variables || 0),
  ]);

  return mutation;
};
