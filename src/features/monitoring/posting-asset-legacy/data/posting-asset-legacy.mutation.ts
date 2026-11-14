/**
 * Posting Asset Legacy Feature Mutation Hooks
 */

import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { postingAssetLegacyQueryKeys } from "./posting-asset-legacy.query";
import { postingAssetLegacyService } from "./posting-asset-legacy.service";
import type {
  BatchPostingRequest,
  BatchRegenerateResult,
  BatchSendToSapResult,
  PostingAssetLegacyRequest,
  PostingGenerateAssetRequest,
  SendToSapResponse,
} from "./posting-asset-legacy.types";

// ============================================================================
// CREATE
// ============================================================================

export function useCreatePostingAssetLegacyMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<void>, Error, PostingAssetLegacyRequest>,
    "mutationFn"
  >,
) {
  const mutation = useMutation({
    mutationFn: (data) => postingAssetLegacyService.create(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [[...postingAssetLegacyQueryKeys.all]]);

  return mutation;
}

// ============================================================================
// UPDATE
// ============================================================================

interface UpdatePostingAssetLegacyParams {
  reversal: string;
  noDok: string;
  reference: string;
  indeks: string;
  data: PostingAssetLegacyRequest;
}

export function useUpdatePostingAssetLegacyMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<void>,
      Error,
      UpdatePostingAssetLegacyParams
    >,
    "mutationFn"
  >,
) {
  const mutation = useMutation({
    mutationFn: ({ reversal, noDok, reference, indeks, data }) =>
      postingAssetLegacyService.update(
        reversal,
        noDok,
        reference,
        indeks,
        data,
      ),
    ...options,
  });

  useHandleMutationResponse(mutation, [[...postingAssetLegacyQueryKeys.all]]);

  return mutation;
}

// ============================================================================
// DELETE
// ============================================================================

interface DeletePostingAssetLegacyParams {
  reversal: string;
  noDok: string;
  reference: string;
  indeks: string;
}

export function useDeletePostingAssetLegacyMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<void>,
      Error,
      DeletePostingAssetLegacyParams
    >,
    "mutationFn"
  >,
) {
  const mutation = useMutation({
    mutationFn: ({ reversal, noDok, reference, indeks }) =>
      postingAssetLegacyService.delete(reversal, noDok, reference, indeks),
    ...options,
  });

  useHandleMutationResponse(mutation, [[...postingAssetLegacyQueryKeys.all]]);

  return mutation;
}

// ============================================================================
// GENERATE
// ============================================================================

export function useGeneratePostingAssetLegacyMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<void>, Error, PostingGenerateAssetRequest>,
    "mutationFn"
  >,
) {
  const mutation = useMutation({
    mutationFn: (data) => postingAssetLegacyService.generate(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [[...postingAssetLegacyQueryKeys.all]]);

  return mutation;
}

// ============================================================================
// REGENERATE
// ============================================================================

interface RegeneratePostingAssetLegacyParams {
  reversal: string;
  noDok: string;
  reference: string;
}

export function useRegeneratePostingAssetLegacyMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<void>,
      Error,
      RegeneratePostingAssetLegacyParams
    >,
    "mutationFn"
  >,
) {
  const mutation = useMutation({
    mutationFn: ({ reversal, noDok, reference }) =>
      postingAssetLegacyService.regenerate(reversal, noDok, reference),
    ...options,
  });

  useHandleMutationResponse(mutation, [[...postingAssetLegacyQueryKeys.all]]);

  return mutation;
}

// ============================================================================
// SEND TO SAP
// ============================================================================

export function useSendToSapPostingAssetLegacyMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<SendToSapResponse>,
      Error,
      RegeneratePostingAssetLegacyParams
    >,
    "mutationFn"
  >,
) {
  const mutation = useMutation({
    mutationFn: ({ reversal, noDok, reference }) =>
      postingAssetLegacyService.sendToSap(reversal, noDok, reference),
    ...options,
  });

  useHandleMutationResponse(mutation, [[...postingAssetLegacyQueryKeys.all]]);

  return mutation;
}

// ============================================================================
// BATCH SEND TO SAP
// ============================================================================

export function useBatchSendToSapPostingAssetLegacyMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<BatchSendToSapResult>,
      Error,
      BatchPostingRequest
    >,
    "mutationFn"
  >,
) {
  const mutation = useMutation({
    mutationFn: (data) => postingAssetLegacyService.batchSendToSap(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [[...postingAssetLegacyQueryKeys.all]]);

  return mutation;
}

// ============================================================================
// BATCH REGENERATE
// ============================================================================

export function useBatchRegeneratePostingAssetLegacyMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<BatchRegenerateResult>,
      Error,
      BatchPostingRequest
    >,
    "mutationFn"
  >,
) {
  const mutation = useMutation({
    mutationFn: (data) => postingAssetLegacyService.batchRegenerate(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [[...postingAssetLegacyQueryKeys.all]]);

  return mutation;
}
