import type { ApiResponse } from "@railfinance/core/types";
import { downloadBlobFile, getErrorMessage, toast, useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { portQueryKeys } from "./port.query";
import { portService } from "./port.service";
import type {
  PortImportResponse,
  PortRequest,
  PortResponse,
} from "./port.types";

/**
 * Hook to create a new port
 */
export const useCreatePortMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<PortResponse>, Error, PortRequest>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => portService.createPort(data),
    ...options,
  });

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (mutation.data.status === "SUCCESS") {
        toast.success(mutation.data.message || "Port created successfully");
      }
    }
  }, [mutation.isSuccess, mutation.data]);

  useEffect(() => {
    if (mutation.isError) {
      const axiosError = mutation.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to create port",
      );
    }
  }, [mutation.isError, mutation.error]);

  return mutation;
};

/**
 * Hook to update a port
 */
export const useUpdatePortMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PortResponse>,
      Error,
      { id: number; data: PortRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => portService.updatePort(id, data),
    ...options,
  });

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (mutation.data.status === "SUCCESS") {
        toast.success(mutation.data.message || "Port updated successfully");
      }
    }
  }, [mutation.isSuccess, mutation.data]);

  useEffect(() => {
    if (mutation.isError) {
      const axiosError = mutation.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to update port",
      );
    }
  }, [mutation.isError, mutation.error]);

  return mutation;
};

/**
 * Hook to delete a port
 */
export const useDeletePortMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => portService.deletePort(id),
    ...options,
  });

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (mutation.data.status === "SUCCESS") {
        toast.success(mutation.data.message || "Port deleted successfully");
      }
    }
  }, [mutation.isSuccess, mutation.data]);

  useEffect(() => {
    if (mutation.isError) {
      const axiosError = mutation.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to delete port",
      );
    }
  }, [mutation.isError, mutation.error]);

  return mutation;
};

/**
 * Hook to import ports from Excel file
 */
export const useImportPortsMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PortImportResponse>,
      Error,
      { file: File; dryRun?: boolean }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ file, dryRun }) => portService.importPorts(file, dryRun),
    ...options,
  });

  useHandleMutationResponse(mutation, [portQueryKeys.all]);

  return mutation;
};

export function useExportPortsMutation() {
  const mutation = useMutation({
    mutationFn: async () => await portService.exportPorts(),
    onSuccess: (blob) =>
      downloadBlobFile(
        blob,
        `port_export_${new Date().toISOString().split("T")[0]}.xlsx`,
      ),
  });

  useEffect(() => {
    if (mutation.isSuccess) {
      toast.success("Port report downloaded successfully.");
    }
  }, [mutation.isSuccess]);

  useEffect(() => {
    if (mutation.isError) {
      const message =
        getErrorMessage(mutation.error) ||
        "An error occurred. Please try again.";
      toast.error(message);
    }
  }, [mutation.isError, mutation.error]);

  return mutation;
}
