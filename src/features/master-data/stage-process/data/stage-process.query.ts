import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { stageProcessService } from "./stage-process.service";
import { stageProcessQueryKeys } from "./stage-process.utils";
import { approvalWorkflowQueryKeys } from "../../approval-workflow/data/approval-workflow.query";
import { disputeWorkflowQueryKeys } from "../../dispute-workflow/data/dispute-workflow.query";

export function useStageProcesses() {
  return useQuery({ queryKey: stageProcessQueryKeys.list(), queryFn: stageProcessService.list, refetchOnWindowFocus: false });
}

export function useSaveStageProcesses() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: stageProcessService.save,
    onSuccess: (records) => {
      client.setQueryData(stageProcessQueryKeys.list(), records);
      void client.invalidateQueries({ queryKey: approvalWorkflowQueryKeys.all });
      void client.invalidateQueries({ queryKey: disputeWorkflowQueryKeys.all });
    },
  });
}
