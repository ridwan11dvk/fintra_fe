import {
  depositService,
  type DepositEditRequest,
  type DepositResponse,
} from "@/features/treasury";
import type { ApiResponse } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useEffect } from "react";

/**
 * Hook to update a deposit (edit-only, specific fields)
 */
export const useUpdateDepositMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<DepositResponse>,
      Error,
      { id: number; data: DepositEditRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => depositService.updateDeposit(id, data),
    ...options,
  });

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (mutation.data.status === "SUCCESS") {
        toast.success(mutation.data.message || "Deposit updated successfully");
      }
    }
  }, [mutation.isSuccess, mutation.data]);

  useEffect(() => {
    if (mutation.isError) {
      const axiosError = mutation.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to update deposit",
      );
    }
  }, [mutation.isError, mutation.error]);

  return mutation;
};

/**
 * Hook to update send status for single deposit
 */
export const useUpdateSendStatusMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<DepositResponse>,
      Error,
      { id: number; sendStatus: 0 | 1 }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, sendStatus }) =>
      depositService.updateSendStatus(id, sendStatus),
    ...options,
  });

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (mutation.data.status === "SUCCESS") {
        toast.success(
          mutation.data.message || "Send status updated successfully",
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
        axiosError?.response?.data?.message || "Failed to update send status",
      );
    }
  }, [mutation.isError, mutation.error]);

  return mutation;
};

/**
 * Hook to bulk update send status for multiple deposits
 */
export const useBulkUpdateSendStatusMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<{ message: string }>,
      Error,
      { ids: number[]; sendStatus: 0 | 1 }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ ids, sendStatus }) =>
      depositService.bulkUpdateSendStatus(ids, sendStatus),
    ...options,
  });

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (mutation.data.status === "SUCCESS") {
        toast.success(
          mutation.data.message || "Send status updated successfully",
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
        axiosError?.response?.data?.message || "Failed to update send status",
      );
    }
  }, [mutation.isError, mutation.error]);

  return mutation;
};
