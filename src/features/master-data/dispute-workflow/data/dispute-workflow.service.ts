import type {
  DisputeRejectReasonItem,
  StageCatalogItem,
  ToggleDisputeWorkflowActiveRequest,
  UpdateDisputeWorkflowRequest,
} from "./dispute-workflow.types";
import type {
  ApiResponse,
  PagedApiResponse,
  PaginationParams,
} from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const DISPUTE_WORKFLOW_BASE_URL = "/master/dispute-workflow";

export const disputeWorkflowService = {
  /**
   * Retrieve the list of stage catalog for dispute workflow
   */
  listDisputeWorkflows: async (
    params?: Partial<PaginationParams>,
  ): Promise<PagedApiResponse<StageCatalogItem>> => {
    const response = await axiosInstance.get<PagedApiResponse<StageCatalogItem>>(
      DISPUTE_WORKFLOW_BASE_URL,
      {
        params,
      },
    );
    return response.data;
  },

  /**
   * Activate or deactivate a dispute workflow stage
   */
  toggleDisputeWorkflowActive: async (
    stageProcess: string,
    payload: ToggleDisputeWorkflowActiveRequest,
  ): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.patch<ApiResponse<string>>(
      `${DISPUTE_WORKFLOW_BASE_URL}/${stageProcess}/activate`,
      payload,
    );
    return response.data;
  },

  /**
   * Retrieve the list of dispute reject reasons for the specified stage process
   */
  getDisputeWorkflowDetail: async (
    stageProcess: string,
    params?: Partial<PaginationParams>,
  ): Promise<PagedApiResponse<DisputeRejectReasonItem>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<DisputeRejectReasonItem>
    >(`${DISPUTE_WORKFLOW_BASE_URL}/detail`, {
      params: {
        stageProcess,
        ...params,
      },
    });
    return response.data;
  },

  /**
   * Update dispute workflow configuration
   */
  updateDisputeWorkflow: async (
    payload: UpdateDisputeWorkflowRequest,
  ): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.put<ApiResponse<string>>(
      DISPUTE_WORKFLOW_BASE_URL,
      payload,
    );
    return response.data;
  },
};
