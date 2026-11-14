import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { workCatalogQueryKeys } from "./work-catalog.query";
import { workCatalogService } from "./work-catalog.service";
import type {
  WorkCatalogRequest,
  WorkCatalogResponse,
} from "./work-catalog.types";

export const useCreateWorkCatalogMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<WorkCatalogResponse>,
      Error,
      WorkCatalogRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => workCatalogService.createWorkCatalog(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [workCatalogQueryKeys.all]);

  return mutation;
};

export const useUpdateWorkCatalogMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<WorkCatalogResponse>,
      Error,
      { id: number; data: WorkCatalogRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) =>
      workCatalogService.updateWorkCatalog(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    workCatalogQueryKeys.all,
    workCatalogQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

export const useDeleteWorkCatalogMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => workCatalogService.deleteWorkCatalog(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [workCatalogQueryKeys.all]);

  return mutation;
};

export const useActivateWorkCatalogMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<WorkCatalogResponse>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => workCatalogService.activateWorkCatalog(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [workCatalogQueryKeys.all]);

  return mutation;
};

export const useDeactivateWorkCatalogMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<WorkCatalogResponse>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => workCatalogService.deactivateWorkCatalog(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [workCatalogQueryKeys.all]);

  return mutation;
};
