import type { ApiResponse } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { partnerTypeService } from "./partner-type.service";
import type {
  PartnerTypeRequest,
  PartnerTypeResponse,
} from "./partner-type.types";

/**
 * Hook to create a new partner type
 */
export const useCreatePartnerTypeMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerTypeResponse>,
      Error,
      PartnerTypeRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => partnerTypeService.createPartnerType(data),
    ...options,
  });

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (mutation.data.status === "SUCCESS") {
        toast.success(
          mutation.data.message || "Partner type created successfully",
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
        axiosError?.response?.data?.message || "Failed to create partner type",
      );
    }
  }, [mutation.isError, mutation.error]);

  return mutation;
};

/**
 * Hook to update a partner type
 */
export const useUpdatePartnerTypeMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerTypeResponse>,
      Error,
      { id: number; data: PartnerTypeRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) =>
      partnerTypeService.updatePartnerType(id, data),
    ...options,
  });

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (mutation.data.status === "SUCCESS") {
        toast.success(
          mutation.data.message || "Partner type updated successfully",
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
        axiosError?.response?.data?.message || "Failed to update partner type",
      );
    }
  }, [mutation.isError, mutation.error]);

  return mutation;
};

/**
 * Hook to delete a partner type
 */
export const useDeletePartnerTypeMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => partnerTypeService.deletePartnerType(id),
    ...options,
  });

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (mutation.data.status === "SUCCESS") {
        toast.success(
          mutation.data.message || "Partner type deleted successfully",
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
        axiosError?.response?.data?.message || "Failed to delete partner type",
      );
    }
  }, [mutation.isError, mutation.error]);

  return mutation;
};
