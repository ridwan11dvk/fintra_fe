import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { approvalWorkflowService } from "./approval-workflow.service";
import type {
  ApprovalWorkflowDetailApiResponse,
  ApprovalWorkflowListApiResponse,
  ApprovalWorkflowOptionsApiResponse,
  ApprovalWorkflowStageTemplateApiResponse,
  ApprovalWorkflowStageOptionsApiResponse,
} from "./approval-workflow.types";

export const approvalWorkflowQueryKeys = {
  all: ["approvalWorkflows"] as const,
  lists: () => [...approvalWorkflowQueryKeys.all, "list"] as const,
  list: () => [...approvalWorkflowQueryKeys.lists()] as const,
  details: () => [...approvalWorkflowQueryKeys.all, "detail"] as const,
  detail: (type: string) => [...approvalWorkflowQueryKeys.details(), type] as const,
  transactionTypeOptions: (moduleId: number = 1) =>
    [...approvalWorkflowQueryKeys.all, "options", "transaction-type", moduleId] as const,
  stageCategoryOptions: () => [...approvalWorkflowQueryKeys.all, "options", "stage-category"] as const,
  stageProcessOptions: (stageCategory?: string) =>
    stageCategory
      ? ([...approvalWorkflowQueryKeys.all, "options", "stage-process", stageCategory] as const)
      : ([...approvalWorkflowQueryKeys.all, "options", "stage-process"] as const),
  defaultStages: (transactionTypeId?: number) =>
    [...approvalWorkflowQueryKeys.all, "template", transactionTypeId ?? ""] as const,
};

/**
 * Hook to fetch all approval workflows with full ApiResponse envelope (message, status, data, errors)
 */
export const useListApprovalWorkflows = (
  options?: Omit<
    UseQueryOptions<ApprovalWorkflowListApiResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: approvalWorkflowQueryKeys.list(),
    queryFn: () => approvalWorkflowService.listApprovalWorkflows(),
    staleTime: 0,
    refetchOnMount: "always",
    ...options,
  });
};

/**
 * Hook to fetch approval workflow detail by transaction type
 */
export const useApprovalWorkflowDetail = (
  type?: string,
  options?: Omit<
    UseQueryOptions<ApprovalWorkflowDetailApiResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: approvalWorkflowQueryKeys.detail(type || ""),
    queryFn: () => approvalWorkflowService.getApprovalWorkflowDetail(type || ""),
    enabled: Boolean(type),
    staleTime: 0,
    refetchOnMount: "always",
    ...options,
  });
};

/**
 * Hook to fetch transaction type options
 */
export const useTransactionTypeOptions = (
  moduleId?: number,
  options?: Omit<
    UseQueryOptions<ApprovalWorkflowOptionsApiResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: approvalWorkflowQueryKeys.transactionTypeOptions(moduleId ?? 0),
    queryFn: () => approvalWorkflowService.getTransactionTypeOptions(moduleId),
    enabled: typeof moduleId === "number",
    staleTime: 0,
    refetchOnMount: "always",
    ...options,
  });
};

/**
 * Hook to fetch stage category options
 */
export const useStageCategoryOptions = (
  options?: Omit<
    UseQueryOptions<ApprovalWorkflowStageOptionsApiResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: approvalWorkflowQueryKeys.stageCategoryOptions(),
    queryFn: () => approvalWorkflowService.getStageCategoryOptions(),
    staleTime: 0,
    refetchOnMount: "always",
    ...options,
  });
};

/**
 * Hook to fetch stage process options (optionally filtered by stage category)
 */
export const useStageProcessOptions = (
  stageCategory?: string,
  options?: Omit<
    UseQueryOptions<ApprovalWorkflowStageOptionsApiResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: approvalWorkflowQueryKeys.stageProcessOptions(stageCategory),
    queryFn: () => approvalWorkflowService.getStageProcessOptions(stageCategory),
    staleTime: 0,
    refetchOnMount: "always",
    ...options,
  });
};

/**
 * Hook to fetch the ordered default approval stages for a transaction type
 */
export const useApprovalWorkflowStageTemplate = (
  transactionTypeId?: number,
  options?: Omit<
    UseQueryOptions<ApprovalWorkflowStageTemplateApiResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: approvalWorkflowQueryKeys.defaultStages(transactionTypeId),
    queryFn: () => approvalWorkflowService.getDefaultStages(transactionTypeId as number),
    enabled: Boolean(transactionTypeId),
    staleTime: 0,
    refetchOnMount: "always",
    ...options,
  });
};
