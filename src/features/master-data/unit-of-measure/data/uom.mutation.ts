import type { ApiResponse } from "@railfinance/core/types";
import { downloadBlobFile, getErrorMessage, toast, useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { uomQueryKeys } from "./uom.query";
import { uomService } from "./uom.service";
import type { UomImportResponse, UomRequest, UomResponse } from "./uom.types";

/**
 * Hook to create a new unit of measure
 */
export const useCreateUomMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<UomResponse>, Error, UomRequest>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => uomService.createUom(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [uomQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a unit of measure
 */
export const useUpdateUomMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<UomResponse>,
      Error,
      { id: number; data: UomRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => uomService.updateUom(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    uomQueryKeys.all,
    uomQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a unit of measure
 */
export const useDeleteUomMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => uomService.deleteUom(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [uomQueryKeys.all]);

  return mutation;
};

/**
 * Hook to import units of measure from Excel file
 */
export const useImportUomsMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<UomImportResponse>,
      Error,
      { file: File; dryRun?: boolean }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ file, dryRun }) => uomService.importUoms(file, dryRun),
    ...options,
  });

  useHandleMutationResponse(mutation, [uomQueryKeys.all]);

  return mutation;
};

export function useExportUomsMutation() {
  const mutation = useMutation({
    mutationFn: async () => await uomService.exportUoms(),
    onSuccess: (blob) =>
      downloadBlobFile(
        blob,
        `uom_export_${new Date().toISOString().split("T")[0]}.xlsx`,
      ),
  });

  useEffect(() => {
    if (mutation.isSuccess) {
      toast.success("UOM report downloaded successfully.");
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
