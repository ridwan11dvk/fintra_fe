/**
 * Posting Auto Mutation Hooks
 * Handles create, update, and delete operations
 */

import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { postingAutoQueryKeys } from "./posting-auto.query";
import { postingAutoService } from "./posting-auto.service";
import type { PostingAuto, PostingAutoRequest } from "./posting-auto.types";

// ============================================================================
// CREATE
// ============================================================================

export function useCreatePostingAutoMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<PostingAuto>, Error, PostingAutoRequest>,
    "mutationFn"
  >,
) {
  const mutation = useMutation({
    mutationFn: (data) => postingAutoService.create(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [[...postingAutoQueryKeys.all]]);

  return mutation;
}

// ============================================================================
// UPDATE
// ============================================================================

export function useUpdatePostingAutoMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PostingAuto>,
      Error,
      { id: number; data: PostingAutoRequest }
    >,
    "mutationFn"
  >,
) {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => postingAutoService.update(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    [...postingAutoQueryKeys.all],
    [...postingAutoQueryKeys.detail(mutation.variables?.id ?? 0)],
  ]);

  return mutation;
}

// ============================================================================
// DELETE
// ============================================================================

export function useDeletePostingAutoMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<number>, Error, number>,
    "mutationFn"
  >,
) {
  const mutation = useMutation({
    mutationFn: (id) => postingAutoService.delete(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    [...postingAutoQueryKeys.all],
    [...postingAutoQueryKeys.detail(mutation.variables ?? 0)],
  ]);

  return mutation;
}
