import type {
  DisputeRejectReasonItem,
  StageCatalogItem,
} from "./dispute-workflow.types";
import type {
  PagedApiResponse,
  PaginationParams,
} from "@railfinance/core/types";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { disputeWorkflowService } from "./dispute-workflow.service";

export const disputeWorkflowQueryKeys = {
  all: ["dispute-workflows"],
  lists: () => [...disputeWorkflowQueryKeys.all, "list"],
  list: (params?: Partial<PaginationParams>) => [
    ...disputeWorkflowQueryKeys.lists(),
    params,
  ],
  details: () => [...disputeWorkflowQueryKeys.all, "detail"],
  detail: (stageProcess: string) => [
    ...disputeWorkflowQueryKeys.details(),
    stageProcess,
  ],
  detailList: (stageProcess: string, params?: Partial<PaginationParams>) => [
    ...disputeWorkflowQueryKeys.detail(stageProcess),
    params,
  ],
};

export const useDisputeWorkflows = (
  params?: Partial<PaginationParams>,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<StageCatalogItem>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: disputeWorkflowQueryKeys.list(params),
    queryFn: () => disputeWorkflowService.listDisputeWorkflows(params),
    staleTime: 0,
    refetchOnMount: "always",
    ...options,
  });
};

export const useDisputeWorkflowDetail = (
  stageProcess: string,
  params?: Partial<PaginationParams>,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<DisputeRejectReasonItem>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: disputeWorkflowQueryKeys.detailList(stageProcess, params),
    queryFn: () =>
      disputeWorkflowService.getDisputeWorkflowDetail(stageProcess, params),
    enabled: !!stageProcess,
    staleTime: 0,
    refetchOnMount: "always",
    ...options,
  });
};
