import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { termOfPaymentQueryKeys } from "./term-of-payment.query";
import { termOfPaymentService } from "./term-of-payment.service";
import type {
  TermOfPaymentRequest,
  TermOfPaymentResponse,
} from "./term-of-payment.types";

/**
 * Hook to create a new payment term
 */
export const useCreateTermOfPaymentMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<TermOfPaymentResponse>,
      Error,
      TermOfPaymentRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => termOfPaymentService.createTermOfPayment(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [termOfPaymentQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a payment term
 */
export const useUpdateTermOfPaymentMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<TermOfPaymentResponse>,
      Error,
      { id: number; data: TermOfPaymentRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) =>
      termOfPaymentService.updateTermOfPayment(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    termOfPaymentQueryKeys.all,
    termOfPaymentQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a payment term
 */
export const useDeleteTermOfPaymentMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => termOfPaymentService.deleteTermOfPayment(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    termOfPaymentQueryKeys.lists(),
    termOfPaymentQueryKeys.detail(mutation.variables || 0),
  ]);

  return mutation;
};
