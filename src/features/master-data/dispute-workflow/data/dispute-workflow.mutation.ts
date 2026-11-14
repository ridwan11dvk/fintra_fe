import type { ApiResponse } from "@railfinance/core/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disputeWorkflowQueryKeys } from "./dispute-workflow.query";
import { disputeWorkflowService } from "./dispute-workflow.service";
import type { UpdateDisputeWorkflowRequest } from "./dispute-workflow.types";

/**
 * Mutation hook to toggle dispute workflow active status
 */
export const useToggleDisputeWorkflowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<string>,
    Error,
    { stageProcess: string; isActive: boolean }
  >({
    mutationFn: ({ stageProcess, isActive }) =>
      disputeWorkflowService.toggleDisputeWorkflowActive(stageProcess, {
        isActive,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: disputeWorkflowQueryKeys.all,
      });
    },
  });
};

/**
 * Mutation hook to update dispute workflow configuration
 */
export const useUpdateDisputeWorkflowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<string>, Error, UpdateDisputeWorkflowRequest>({
    mutationFn: (payload) =>
      disputeWorkflowService.updateDisputeWorkflow(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: disputeWorkflowQueryKeys.all,
      });
    },
  });
};
