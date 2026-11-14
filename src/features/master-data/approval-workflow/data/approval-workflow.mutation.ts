import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approvalWorkflowQueryKeys } from "./approval-workflow.query";
import { approvalWorkflowService } from "./approval-workflow.service";
import type {
  CreateApprovalWorkflowRequest,
  CreateApprovalWorkflowResponse,
} from "./approval-workflow.types";

/**
 * Hook to create a new approval workflow
 */
export const useCreateApprovalWorkflowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateApprovalWorkflowResponse,
    Error,
    CreateApprovalWorkflowRequest
  >({
    mutationFn: (payload) =>
      approvalWorkflowService.createApprovalWorkflow(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: approvalWorkflowQueryKeys.all,
      });
    },
  });
};

export interface UpdateApprovalWorkflowParams {
  id: string;
  payload: CreateApprovalWorkflowRequest;
}

/**
 * Hook to update an existing approval workflow
 */
export const useUpdateApprovalWorkflowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateApprovalWorkflowResponse,
    Error,
    UpdateApprovalWorkflowParams
  >({
    mutationFn: ({ id, payload }) =>
      approvalWorkflowService.updateApprovalWorkflow(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: approvalWorkflowQueryKeys.all,
      });
    },
  });
};
