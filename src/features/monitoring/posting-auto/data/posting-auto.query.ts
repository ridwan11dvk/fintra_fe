/**
 * Posting Auto TanStack Query Hooks
 * Server state management for Posting Auto data
 */

import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { useHandleQueryResponse } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { postingAutoService } from "./posting-auto.service";
import type {
  PostingAuto,
  PostingAutoGroup,
  PostingAutoStatusSummary,
} from "./posting-auto.types";

// ============================================================================
// QUERY KEY FACTORY
// ============================================================================

export const postingAutoQueryKeys = {
  all: ["postingAuto"] as const,
  lists: () => [...postingAutoQueryKeys.all, "list"] as const,
  list: (params?: PaginationParams) =>
    [...postingAutoQueryKeys.lists(), params] as const,
  details: () => [...postingAutoQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...postingAutoQueryKeys.details(), id] as const,
  transactions: () => [...postingAutoQueryKeys.all, "transaction"] as const,
  transaction: (
    reversalFlag: string,
    documentNumber: string,
    reference: string,
  ) =>
    [
      ...postingAutoQueryKeys.transactions(),
      reversalFlag,
      documentNumber,
      reference,
    ] as const,
  summaries: () => [...postingAutoQueryKeys.all, "summary"] as const,
  statusSummary: () => [...postingAutoQueryKeys.summaries(), "status"] as const,
};

// ============================================================================
// LIST HOOKS
// ============================================================================

export function usePostingAutoList(
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<PostingAutoGroup>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  const query = useQuery({
    queryKey: postingAutoQueryKeys.list(params),
    queryFn: () => postingAutoService.listGrouped(params),
    ...options,
  });
  useHandleQueryResponse(query);
  return query;
}

// ============================================================================
// DETAIL HOOKS
// ============================================================================

export function usePostingAutoById(
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<PostingAuto>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  const query = useQuery({
    queryKey: postingAutoQueryKeys.detail(id),
    queryFn: () => postingAutoService.getById(id),
    enabled: !!id && id !== 0,
    ...options,
  });
  useHandleQueryResponse(query);
  return query;
}

export function usePostingAutoByTransaction(
  reversalFlag: string,
  documentNumber: string,
  reference: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<PostingAuto[]>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  const query = useQuery({
    queryKey: postingAutoQueryKeys.transaction(
      reversalFlag,
      documentNumber,
      reference,
    ),
    queryFn: () =>
      postingAutoService.getByTransaction(
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
// SUMMARY HOOKS
// ============================================================================

export function usePostingAutoStatusSummary(
  options?: Omit<
    UseQueryOptions<ApiResponse<PostingAutoStatusSummary>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  const query = useQuery({
    queryKey: postingAutoQueryKeys.statusSummary(),
    queryFn: () => postingAutoService.getStatusSummary(),
    ...options,
  });
  useHandleQueryResponse(query);
  return query;
}
