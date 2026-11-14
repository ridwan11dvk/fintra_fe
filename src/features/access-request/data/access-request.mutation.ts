/**
 * Access Request Feature - TanStack Query Mutations
 * Mutation hooks for data modifications
 */

import { accessRequestQueryKeys } from "@railfinance/core/access-request";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { accessRequestService } from "./access-request.service";
import type {
  AccessRequestResponse,
  ChangeAccessRequestStatus,
} from "./access-request.types";

/**
 * Mutation to change access request status (approve/reject)
 * PUT /api/access-request/{requestId}
 */
export const useChangeAccessRequestStatusMutation = (
  options?: UseMutationOptions<
    AccessRequestResponse,
    Error,
    {
      requestId: number;
      data: ChangeAccessRequestStatus;
    }
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ requestId, data }) =>
      accessRequestService.changeAccessRequestStatus(requestId, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    accessRequestQueryKeys.all,
    accessRequestQueryKeys.lists(),
  ]);
  return mutation;
};
