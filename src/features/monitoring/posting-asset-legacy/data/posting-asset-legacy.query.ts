/**
 * Posting Asset Legacy Feature Query Hooks
 */

import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { useHandleQueryResponse } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { postingAssetLegacyService } from "./posting-asset-legacy.service";
import type {
  PostingAssetLegacyDetail,
  PostingAssetLegacyGroup,
} from "./posting-asset-legacy.types";

// ============================================================================
// QUERY KEY FACTORY
// ============================================================================

export const postingAssetLegacyQueryKeys = {
  all: ["postingAssetLegacy"] as const,
  lists: () => [...postingAssetLegacyQueryKeys.all, "list"] as const,
  list: (params?: PaginationParams) =>
    [...postingAssetLegacyQueryKeys.lists(), params] as const,
  transactions: () =>
    [...postingAssetLegacyQueryKeys.all, "transaction"] as const,
  transaction: (reversal: string, noDok: string, reference: string) =>
    [
      ...postingAssetLegacyQueryKeys.transactions(),
      reversal,
      noDok,
      reference,
    ] as const,
};

// ============================================================================
// LIST HOOKS
// ============================================================================

export function usePostingAssetLegacyList(
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<PostingAssetLegacyGroup>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  const query = useQuery({
    queryKey: postingAssetLegacyQueryKeys.list(params),
    queryFn: () => postingAssetLegacyService.list(params),
    ...options,
  });
  useHandleQueryResponse(query);
  return query;
}

// ============================================================================
// DETAIL HOOKS
// ============================================================================

export function usePostingAssetLegacyByTransaction(
  reversal: string,
  noDok: string,
  reference: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<PostingAssetLegacyDetail[]>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  const query = useQuery({
    queryKey: postingAssetLegacyQueryKeys.transaction(
      reversal,
      noDok,
      reference,
    ),
    queryFn: () =>
      postingAssetLegacyService.getByTransaction(reversal, noDok, reference),
    enabled: !!reversal && !!noDok,
    ...options,
  });
  useHandleQueryResponse(query);
  return query;
}
