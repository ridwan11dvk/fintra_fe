import type { ApiResponse } from "@railfinance/core";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { chartOfAccountService } from "./chart-of-account.service";
import type {
  ChartOfAccountImportResponse,
  ChartOfAccountRequest,
  ChartOfAccountResponse,
} from "./chart-of-account.types";

/**
 * Hook to create a new chart of account
 */
export const useCreateChartOfAccountMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<ChartOfAccountResponse>,
      Error,
      ChartOfAccountRequest
    >,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: (data) => chartOfAccountService.createChartOfAccount(data),
    ...options,
  });
};

/**
 * Hook to update an existing chart of account
 */
export const useUpdateChartOfAccountMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<ChartOfAccountResponse>,
      Error,
      { id: string | number; data: ChartOfAccountRequest }
    >,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: ({ id, data }) =>
      chartOfAccountService.updateChartOfAccount(id, data),
    ...options,
  });
};

/**
 * Hook to delete a chart of account
 */
export const useDeleteChartOfAccountMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, string | number>,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: (id) => chartOfAccountService.deleteChartOfAccount(id),
    ...options,
  });
};

export type ImportChartOfAccountsVariables = {
  file: File;
  dryRun?: boolean;
};

/**
 * Validate that the file is an Excel file (.xlsx or .xls)
 */
export const isExcelFile = (file: File): boolean => {
  const name = file.name?.toLowerCase() ?? "";
  return (
    name.endsWith(".xlsx") ||
    name.endsWith(".xls") ||
    file.type ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.type === "application/vnd.ms-excel"
  );
};

/**
 * Hook to import chart of accounts from Excel file
 */
export const useImportChartOfAccountsMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<ChartOfAccountImportResponse>,
      Error,
      ImportChartOfAccountsVariables
    >,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: ({ file, dryRun }) => {
      if (!isExcelFile(file)) {
        throw new Error("Only Excel files (.xlsx, .xls) are allowed");
      }
      return chartOfAccountService.importChartOfAccounts(file, dryRun);
    },
    ...options,
  });
};
