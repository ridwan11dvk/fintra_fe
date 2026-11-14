/**
 * Posting Auto Legacy Feature Query Hooks
 */

import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { useHandleQueryResponse } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { postingAutoLegacyService } from "./posting-auto-legacy.service";
import type {
  PostingAutoLegacyDetail,
  PostingAutoLegacyGroup,
} from "./posting-auto-legacy.types";

// ============================================================================
// QUERY KEY FACTORY
// ============================================================================

export const postingAutoLegacyQueryKeys = {
  all: ["postingAutoLegacy"] as const,
  lists: () => [...postingAutoLegacyQueryKeys.all, "list"] as const,
  list: (params?: PaginationParams) =>
    [...postingAutoLegacyQueryKeys.lists(), params] as const,
  transactions: () =>
    [...postingAutoLegacyQueryKeys.all, "transaction"] as const,
  transaction: (reversal: string, noDok: string, reference: string) =>
    [
      ...postingAutoLegacyQueryKeys.transactions(),
      reversal,
      noDok,
      reference,
    ] as const,
};

// ============================================================================
// LIST HOOKS
// ============================================================================

export function usePostingAutoLegacyList(
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<PostingAutoLegacyGroup>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  const query = useQuery({
    queryKey: postingAutoLegacyQueryKeys.list(params),
    queryFn: () => postingAutoLegacyService.list(params),
    ...options,
  });
  useHandleQueryResponse(query);
  return query;
}

// ============================================================================
// DETAIL HOOKS
// ============================================================================

export function usePostingAutoLegacyByTransaction(
  reversal: string,
  noDok: string,
  reference: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<PostingAutoLegacyDetail[]>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  const query = useQuery({
    queryKey: postingAutoLegacyQueryKeys.transaction(
      reversal,
      noDok,
      reference,
    ),
    queryFn: () =>
      postingAutoLegacyService.getByTransaction(reversal, noDok, reference),
    enabled: !!reversal && !!noDok,
    ...options,
  });
  useHandleQueryResponse(query);
  return query;
}
