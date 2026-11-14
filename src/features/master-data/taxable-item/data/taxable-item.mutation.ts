import type { ApiResponse } from "@railfinance/core/types";
import { downloadBlobFile, getErrorMessage, toast, useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { taxableItemQueryKeys } from "./taxable-item.query";
import { taxableItemService } from "./taxable-item.service";
import type {
  TaxableItemImportResponse,
  TaxableItemRequest,
  TaxableItemResponse,
} from "./taxable-item.types";

/**
 * Hook to create a new taxable item
 */
export const useCreateTaxableItemMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<TaxableItemResponse>,
      Error,
      TaxableItemRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => taxableItemService.createTaxableItem(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [taxableItemQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a taxable item
 */
export const useUpdateTaxableItemMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<TaxableItemResponse>,
      Error,
      { id: number; data: TaxableItemRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) =>
      taxableItemService.updateTaxableItem(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    taxableItemQueryKeys.all,
    taxableItemQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a taxable item
 */
export const useDeleteTaxableItemMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => taxableItemService.deleteTaxableItem(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    taxableItemQueryKeys.all,
    taxableItemQueryKeys.detail(mutation.variables || 0),
  ]);

  return mutation;
};

/**
 * Hook to import taxable items from Excel file
 */
export const useImportTaxableItemsMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<TaxableItemImportResponse>,
      Error,
      { file: File; dryRun?: boolean }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ file, dryRun }) =>
      taxableItemService.importTaxableItems(file, dryRun),
    ...options,
  });

  useHandleMutationResponse(mutation, [taxableItemQueryKeys.all]);

  return mutation;
};

/**
 * Hook to import taxable items from Excel file
 */
export const useConvertHierarchicalTaxableItemsMutation = (
  options?: Omit<UseMutationOptions<Blob, Error, { file: File }>, "mutationFn">,
) => {
  const mutation = useMutation({
    mutationFn: ({ file }) =>
      taxableItemService.convertHierarchicalTaxableItems(file),
    ...options,
  });

  return mutation;
};

export function useExportTaxableItemsMutation() {
  const mutation = useMutation({
    mutationFn: async () => await taxableItemService.exportTaxableItems(),
    onSuccess: (blob) =>
      downloadBlobFile(
        blob,
        `taxable-item_export_${new Date().toISOString().split("T")[0]}.xlsx`,
      ),
  });

  useEffect(() => {
    if (mutation.isSuccess) {
      toast.success("Taxable Item report downloaded successfully.");
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
