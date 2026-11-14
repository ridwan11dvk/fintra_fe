import type { ApiResponse } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  closePaymentService,
  type ResetPostingA8ResultResponse,
} from "./close-payment.service";
import type {
  ClosePaymentEditRequest,
  ClosePaymentResponse,
} from "./close-payment.types";

/**
 * Hook to update a close payment (edit-only, specific fields)
 * Only available when payment_status = 0 (Unpaid)
 */
export const useUpdateClosePaymentMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<ClosePaymentResponse>,
      Error,
      { id: number; data: ClosePaymentEditRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) =>
      closePaymentService.updateClosePayment(id, data),
    ...options,
  });

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (mutation.data.status === "SUCCESS") {
        toast.success(
          mutation.data.message || "Close payment updated successfully",
        );
      }
    }
  }, [mutation.isSuccess, mutation.data]);

  useEffect(() => {
    if (mutation.isError) {
      const axiosError = mutation.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to update close payment",
      );
    }
  }, [mutation.isError, mutation.error]);

  return mutation;
};

/**
 * Hook to reset A8 posting status to 0 (Not Generated)
 * Can reset one or multiple records at once
 * Only works for records with status 1 (Partial) or 5 (Failed)
 */
export const useResetPostingA8StatusMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<ResetPostingA8ResultResponse>,
      Error,
      number[]
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (ids) => closePaymentService.resetPostingA8Status(ids),
    ...options,
  });

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (mutation.data.status === "SUCCESS") {
        toast.success(
          mutation.data.message || "Posting status reset successfully",
        );
      } else if (mutation.data.status === "WARNING") {
        toast.warning(mutation.data.message || "Partial reset completed");
      }
    }
  }, [mutation.isSuccess, mutation.data]);

  useEffect(() => {
    if (mutation.isError) {
      const axiosError = mutation.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to reset posting status",
      );
    }
  }, [mutation.isError, mutation.error]);

  return mutation;
};
