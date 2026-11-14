import { apiClient as axiosInstance } from "@railfinance/core/lib";
import type {
  ApprovalWorkflowDetailApiResponse,
  ApprovalWorkflowListApiResponse,
  ApprovalWorkflowOptionsApiResponse,
  ApprovalWorkflowStageTemplateApiResponse,
  ApprovalWorkflowStageOptionsApiResponse,
  CreateApprovalWorkflowRequest,
  CreateApprovalWorkflowResponse,
} from "./approval-workflow.types";

const APPROVAL_WORKFLOW_BASE_URL = "/master/approval-workflow";

export const approvalWorkflowService = {
  /**
   * Get all approval workflows
   */
  listApprovalWorkflows: async (): Promise<ApprovalWorkflowListApiResponse> => {
    const response = await axiosInstance.get<ApprovalWorkflowListApiResponse>(
      APPROVAL_WORKFLOW_BASE_URL,
      {
        headers: {
          "X-Tenant-ID": "RAILFINANCE",
        },
      },
    );
    return response.data;
  },

  /**
   * Create a new approval workflow
   */
  createApprovalWorkflow: async (
    payload: CreateApprovalWorkflowRequest,
  ): Promise<CreateApprovalWorkflowResponse> => {
    const response = await axiosInstance.post<CreateApprovalWorkflowResponse>(
      APPROVAL_WORKFLOW_BASE_URL,
      payload,
      {
        headers: {
          "X-Tenant-ID": "RAILFINANCE",
        },
      },
    );
    return response.data;
  },

  /**
   * Update an existing approval workflow
   */
  updateApprovalWorkflow: async (
    id: string,
    payload: CreateApprovalWorkflowRequest,
  ): Promise<CreateApprovalWorkflowResponse> => {
    const response = await axiosInstance.put<CreateApprovalWorkflowResponse>(
      `${APPROVAL_WORKFLOW_BASE_URL}/${id}`,
      payload,
      {
        headers: {
          "X-Tenant-ID": "RAILFINANCE",
        },
      },
    );
    return response.data;
  },

  /**
   * Get approval workflow detail by transaction type
   */
  getApprovalWorkflowDetail: async (
    type: string,
  ): Promise<ApprovalWorkflowDetailApiResponse> => {
    const response = await axiosInstance.get<ApprovalWorkflowDetailApiResponse>(
      `${APPROVAL_WORKFLOW_BASE_URL}/${type}`,
      {
        headers: {
          "X-Tenant-ID": "RAILFINANCE",
        },
      },
    );
    return response.data;
  },

  /**
   * Get transaction type options
   */
  getTransactionTypeOptions: async (
    moduleId?: number,
  ): Promise<ApprovalWorkflowOptionsApiResponse> => {
    const response = await axiosInstance.get<ApprovalWorkflowOptionsApiResponse>(
      "/master/transaction-type/options",
      {
        params: typeof moduleId === "number" ? { moduleId } : undefined,
        headers: {
          "X-Tenant-ID": "RAILFINANCE",
        },
      },
    );
    return response.data;
  },

  /**
   * Get stage category options
   */
  getStageCategoryOptions: async (): Promise<ApprovalWorkflowStageOptionsApiResponse> => {
    const response = await axiosInstance.get<ApprovalWorkflowStageOptionsApiResponse>(
      `${APPROVAL_WORKFLOW_BASE_URL}/stage-category/options`,
      {
        headers: {
          "X-Tenant-ID": "RAILFINANCE",
        },
      },
    );
    return response.data;
  },

  /**
   * Get stage process options by stage category (optional)
   */
  getStageProcessOptions: async (
    stageCategory?: string,
  ): Promise<ApprovalWorkflowStageOptionsApiResponse> => {
    const response = await axiosInstance.get<ApprovalWorkflowStageOptionsApiResponse>(
      `${APPROVAL_WORKFLOW_BASE_URL}/stage-process/options`,
      {
        params: stageCategory ? { stageCategory } : undefined,
        headers: {
          "X-Tenant-ID": "RAILFINANCE",
        },
      },
    );
    return response.data;
  },

  /**
   * Get the default approval stages configured for a transaction type
   */
  getDefaultStages: async (
    transactionTypeId: number,
  ): Promise<ApprovalWorkflowStageTemplateApiResponse> => {
    const response = await axiosInstance.get<ApprovalWorkflowStageTemplateApiResponse>(
      `${APPROVAL_WORKFLOW_BASE_URL}/default-stages/${transactionTypeId}`,
      {
        headers: {
          "X-Tenant-ID": "RAILFINANCE",
        },
      },
    );
    return response.data;
  },
};
