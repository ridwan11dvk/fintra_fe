/**
 * Posting Auto Legacy Feature Mutation Hooks
 */

import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { postingAutoLegacyQueryKeys } from "./posting-auto-legacy.query";
import { postingAutoLegacyService } from "./posting-auto-legacy.service";
import type {
  BatchPostingRequest,
  BatchRegenerateResult,
  BatchSendToSapResult,
  PostingAutoLegacyRequest,
  PostingGenerateAutoRequest,
  SendToSapResponse,
} from "./posting-auto-legacy.types";

// ============================================================================
// CREATE
// ============================================================================

export function useCreatePostingAutoLegacyMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<void>, Error, PostingAutoLegacyRequest>,
    "mutationFn"
  >,
) {
  const mutation = useMutation({
    mutationFn: (data) => postingAutoLegacyService.create(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [[...postingAutoLegacyQueryKeys.all]]);

  return mutation;
}

// ============================================================================
// UPDATE
// ============================================================================

interface UpdatePostingAutoLegacyParams {
  reversal: string;
  noDok: string;
  reference: string;
  indeks: string;
  data: PostingAutoLegacyRequest;
}

export function useUpdatePostingAutoLegacyMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<void>, Error, UpdatePostingAutoLegacyParams>,
    "mutationFn"
  >,
) {
  const mutation = useMutation({
    mutationFn: ({ reversal, noDok, reference, indeks, data }) =>
      postingAutoLegacyService.update(reversal, noDok, reference, indeks, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [[...postingAutoLegacyQueryKeys.all]]);

  return mutation;
}

// ============================================================================
// DELETE
// ============================================================================

interface DeletePostingAutoLegacyParams {
  reversal: string;
  noDok: string;
  reference: string;
  indeks: string;
}

export function useDeletePostingAutoLegacyMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<void>, Error, DeletePostingAutoLegacyParams>,
    "mutationFn"
  >,
) {
  const mutation = useMutation({
    mutationFn: ({ reversal, noDok, reference, indeks }) =>
      postingAutoLegacyService.delete(reversal, noDok, reference, indeks),
    ...options,
  });

  useHandleMutationResponse(mutation, [[...postingAutoLegacyQueryKeys.all]]);

  return mutation;
}

// ============================================================================
// GENERATE
// ============================================================================

export function useGeneratePostingAutoLegacyMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<void>, Error, PostingGenerateAutoRequest>,
    "mutationFn"
  >,
) {
  const mutation = useMutation({
    mutationFn: (data) => postingAutoLegacyService.generate(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [[...postingAutoLegacyQueryKeys.all]]);

  return mutation;
}

// ============================================================================
// REGENERATE
// ============================================================================

interface RegeneratePostingAutoLegacyParams {
  reversal: string;
  noDok: string;
  reference: string;
}

export function useRegeneratePostingAutoLegacyMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<void>,
      Error,
      RegeneratePostingAutoLegacyParams
    >,
    "mutationFn"
  >,
) {
  const mutation = useMutation({
    mutationFn: ({ reversal, noDok, reference }) =>
      postingAutoLegacyService.regenerate(reversal, noDok, reference),
    ...options,
  });

  useHandleMutationResponse(mutation, [[...postingAutoLegacyQueryKeys.all]]);

  return mutation;
}

// ============================================================================
// SEND TO SAP
// ============================================================================

export function useSendToSapPostingAutoLegacyMutation(
  options?: Omit<
    UseMutationOptions<
      ApiResponse<SendToSapResponse>,
      Error,
      RegeneratePostingAutoLegacyParams
    >,
    "mutationFn"
  >,
) {
  const mutation = useMutation({
    mutationFn: ({ reversal, noDok, reference }) =>
      postingAutoLegacyService.sendToSap(reversal, noDok, reference),
    ...options,
  });

  useHandleMutationResponse(mutation, [[...postingAutoLegacyQueryKeys.all]]);

  return mutation;
}

// ============================================================================
// BATCH SEND TO SAP
// ============================================================================

export function useBatchSendToSapPostingAutoLegacyMutation(
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
    mutationFn: (data) => postingAutoLegacyService.batchSendToSap(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [[...postingAutoLegacyQueryKeys.all]]);

  return mutation;
}

// ============================================================================
// BATCH REGENERATE
// ============================================================================

export function useBatchRegeneratePostingAutoLegacyMutation(
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
    mutationFn: (data) => postingAutoLegacyService.batchRegenerate(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [[...postingAutoLegacyQueryKeys.all]]);

  return mutation;
}
