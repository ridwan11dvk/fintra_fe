import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { ApiResponse } from "@railfinance/core/types";
import { documentNameQueryKeys } from "./document-name.query";
import { documentNameService } from "./document-name.service";
import type { DocumentNameRequest, DocumentNameResponse } from "./document-name.types";

export const useCreateDocumentNameMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<DocumentNameResponse>,
      Error,
      DocumentNameRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => documentNameService.createDocumentName(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [documentNameQueryKeys.all]);

  return mutation;
};

export const useUpdateDocumentNameMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<DocumentNameResponse>,
      Error,
      { id: number; data: DocumentNameRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) =>
      documentNameService.updateDocumentName(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    documentNameQueryKeys.all,
    documentNameQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

export const useDeleteDocumentNameMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => documentNameService.deleteDocumentName(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [documentNameQueryKeys.all]);

  return mutation;
};
