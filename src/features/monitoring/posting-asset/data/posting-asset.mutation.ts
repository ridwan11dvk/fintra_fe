/**
 * Posting Asset Feature Mutation Hooks
 */

import type { PostingAsset, PostingAssetRequest } from "@/features/monitoring";
import { postingAssetService } from "@/features/monitoring";
import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { postingAssetQueryKeys } from "./posting-asset.query";

// ============================================================================
// CREATE
// ============================================================================

export function useCreatePostingAssetMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<PostingAsset>, Error, PostingAssetRequest>,
    "mutationFn"
  >,
) {
  const mutation = useMutation({
    mutationFn: (data) => postingAssetService.create(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [[...postingAssetQueryKeys.all]]);

  return mutation;
}

// ============================================================================
// UPDATE
// ============================================================================

export function useUpdatePostingAssetMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PostingAsset>,
      Error,
      { id: number; data: PostingAssetRequest }
    >,
    "mutationFn"
  >,
) {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => postingAssetService.update(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    [...postingAssetQueryKeys.all],
    [...postingAssetQueryKeys.detail(mutation.variables?.id ?? 0)],
  ]);

  return mutation;
}

// ============================================================================
// DELETE
// ============================================================================

export function useDeletePostingAssetMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<number>, Error, number>,
    "mutationFn"
  >,
) {
  const mutation = useMutation({
    mutationFn: (id) => postingAssetService.delete(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    [...postingAssetQueryKeys.all],
    [...postingAssetQueryKeys.detail(mutation.variables ?? 0)],
  ]);

  return mutation;
}
