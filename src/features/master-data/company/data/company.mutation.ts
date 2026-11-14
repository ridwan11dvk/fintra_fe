import type {
  CompanyFileRequest,
  CompanyImportResponse,
  CompanyRequest,
  CompanyResponse,
} from "@/features/master-data/company/data/company.types";
import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { companyQueryKeys } from "./company.query";
import { companyService } from "./company.service";

/**
 * Hook to create a new company
 */
export const useCreateCompanyMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<CompanyResponse>,
      Error,
      CompanyRequest & { files?: File[]; fileAliases?: string }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => companyService.createCompany(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [companyQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a company
 */
export const useUpdateCompanyMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<CompanyResponse>,
      Error,
      {
        id: number;
        data: Partial<CompanyRequest> & {
          logoFile?: File;
          headerDocFile?: File;
          footerDocFile?: File;
        };
      }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => companyService.updateCompany(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    companyQueryKeys.all,
    companyQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a company
 */
export const useDeleteCompanyMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => companyService.deleteCompany(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [companyQueryKeys.all]);

  return mutation;
};

/**
 * Hook to upload a company file
 */
export const useUploadCompanyFileMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<CompanyResponse>, Error, CompanyFileRequest>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data: CompanyFileRequest) =>
      companyService.uploadCompanyFile(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [companyQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a company file
 */
export const useUpdateCompanyFileMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<CompanyResponse>,
      Error,
      {
        companyId: number;
        fileId: number;
        data: CompanyFileRequest;
      }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ companyId, fileId, data }) =>
      companyService.updateCompanyFile(companyId, fileId, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [companyQueryKeys.all]);

  return mutation;
};

/**
 * Hook to delete a company file
 */
export const useDeleteCompanyFileMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<string>,
      Error,
      { companyId: number; fileId: number }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ companyId, fileId }) =>
      companyService.deleteCompanyFile(companyId, fileId),
    ...options,
  });

  useHandleMutationResponse(mutation, [companyQueryKeys.all]);

  return mutation;
};

/**
 * Hook to import companies from Excel file
 */
export const useImportCompaniesMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<CompanyImportResponse>,
      Error,
      { file: File; dryRun?: boolean }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ file, dryRun }) =>
      companyService.importCompanies(file, dryRun),
    ...options,
  });

  useHandleMutationResponse(mutation, [companyQueryKeys.all]);

  return mutation;
};
