/**
 * Posting Asset Feature Query Hooks
 */

import type {
  PostingAsset,
  PostingAssetGroup,
  PostingAssetStatusSummary,
} from "@/features/monitoring";
import { postingAssetService } from "@/features/monitoring";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { useHandleQueryResponse } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

// ============================================================================
// QUERY KEY FACTORY
// ============================================================================

export const postingAssetQueryKeys = {
  all: ["postingAsset"] as const,
  lists: () => [...postingAssetQueryKeys.all, "list"] as const,
  list: (params?: PaginationParams) =>
    [...postingAssetQueryKeys.lists(), params] as const,
  details: () => [...postingAssetQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...postingAssetQueryKeys.details(), id] as const,
  transactions: () => [...postingAssetQueryKeys.all, "transaction"] as const,
  transaction: (
    reversalFlag: string,
    documentNumber: string,
    reference: string,
  ) =>
    [
      ...postingAssetQueryKeys.transactions(),
      reversalFlag,
      documentNumber,
      reference,
    ] as const,
  summaries: () => [...postingAssetQueryKeys.all, "summary"] as const,
  statusSummary: () =>
    [...postingAssetQueryKeys.summaries(), "status"] as const,
};

// ============================================================================
// LIST HOOKS
// ============================================================================

export function usePostingAssetList(
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<PostingAssetGroup>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  const query = useQuery({
    queryKey: postingAssetQueryKeys.list(params),
    queryFn: () => postingAssetService.listGrouped(params),
    ...options,
  });
  useHandleQueryResponse(query);
  return query;
}

// ============================================================================
// DETAIL HOOKS
// ============================================================================

export function usePostingAssetById(
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<PostingAsset>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  const query = useQuery({
    queryKey: postingAssetQueryKeys.detail(id),
    queryFn: () => postingAssetService.getById(id),
    enabled: !!id && id !== 0,
    ...options,
  });
  useHandleQueryResponse(query);
  return query;
}

export function usePostingAssetByTransaction(
  reversalFlag: string,
  documentNumber: string,
  reference: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<PostingAsset[]>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  const query = useQuery({
    queryKey: postingAssetQueryKeys.transaction(
      reversalFlag,
      documentNumber,
      reference,
    ),
    queryFn: () =>
      postingAssetService.getByTransaction(
        reversalFlag,
        documentNumber,
        reference,
      ),
    enabled: !!reversalFlag && !!documentNumber,
    ...options,
  });
  useHandleQueryResponse(query);
  return query;
}

// ============================================================================
// STATUS SUMMARY HOOK
// ============================================================================

export function usePostingAssetStatusSummary(
  options?: Omit<
    UseQueryOptions<ApiResponse<PostingAssetStatusSummary>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  const query = useQuery({
    queryKey: postingAssetQueryKeys.statusSummary(),
    queryFn: () => postingAssetService.getStatusSummary(),
    ...options,
  });
  useHandleQueryResponse(query);
  return query;
}
