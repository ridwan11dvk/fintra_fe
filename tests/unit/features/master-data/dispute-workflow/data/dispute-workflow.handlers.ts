import type {
  DisputeRejectReasonItem,
  StageCatalogItem,
} from "@/features/master-data/dispute-workflow/data/dispute-workflow.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core/types";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockDisputeWorkflowListResponse: PagedApiResponse<StageCatalogItem> = {
  status: "SUCCESS",
  message: "Dispute workflow catalog retrieved successfully",
  data: {
    content: [
      {
        stageProcessCategory: "BUSINESS_LAYER",
        stageProcessCategoryName: "Business Layer",
        stageProcess: "budget-approval",
        stageProcessName: "Budget Approval",
        disputeWorkflowActive: true,
      },
      {
        stageProcessCategory: "FINANCIAL",
        stageProcessCategoryName: "Financial",
        stageProcess: "financial-control",
        stageProcessName: "Financial Control",
        disputeWorkflowActive: false,
      },
    ],
    pagination: {
      total: 2,
      pageSize: 10,
      pageNumber: 0,
      totalPages: 1,
      currentPage: 1,
      from: 1,
      to: 2,
    },
  },
  errors: undefined,
};

export const mockDisputeWorkflowDetailResponse: PagedApiResponse<DisputeRejectReasonItem> = {
  status: "SUCCESS",
  message: "Dispute workflow retrieved successfully",
  data: {
    content: [
      {
        rejectReasonCategory: "9",
        rejectReasonCategoryName: "Policy Violation",
        rejectDestination: "NON_DISPUTE",
        stageProcess: "Budget Approval",
        stageProcessCode: "budget-approval",
        afterCaseCloseDestination: "ANOTHER_STAGE",
        nonDisputeRole: "Tax Staff",
        nonDisputeRoleCode: "17",
        description: "Test description",
      },
    ],
    pagination: {
      total: 1,
      pageSize: 10,
      pageNumber: 0,
      totalPages: 1,
      currentPage: 1,
      from: 1,
      to: 1,
    },
  },
  errors: undefined,
};

export const mockToggleDisputeWorkflowResponse: ApiResponse<string> = {
  status: "SUCCESS",
  message: "Dispute workflow status updated successfully",
  data: "Status updated",
  errors: undefined,
};

export const mockUpdateDisputeWorkflowResponse: ApiResponse<string> = {
  status: "SUCCESS",
  message: "Dispute workflow updated successfully",
  data: "Workflow updated",
  errors: undefined,
};

export const mockRejectCategoryOptionsResponse = {
  status: "SUCCESS",
  message: "Category options retrieved successfully",
  data: [
    { value: "9", label: "Policy Violation" },
    { value: "10", label: "Incomplete Document" },
  ],
  errors: undefined,
};

export const mockDisputeRoleOptionsResponse = {
  status: "SUCCESS",
  message: "Role options retrieved successfully",
  data: [
    { value: "17", label: "Tax Staff" },
    { value: "10", label: "User" },
  ],
  errors: undefined,
};

export const mockDisputeStageProcessOptionsResponse = {
  status: "SUCCESS",
  message: "Stage process options retrieved successfully",
  data: [
    { value: "budget-approval", label: "Budget Approval" },
    { value: "partner-submission", label: "Partner Submission" },
  ],
  errors: undefined,
};

export const disputeWorkflowHandlers = [
  http.get(`${BASE}/master/dispute-workflow/detail`, () => {
    return HttpResponse.json(mockDisputeWorkflowDetailResponse);
  }),

  http.get(`${BASE}/master/dispute-workflow`, () => {
    return HttpResponse.json(mockDisputeWorkflowListResponse);
  }),

  http.patch(`${BASE}/master/dispute-workflow/:stageProcess/activate`, () => {
    return HttpResponse.json(mockToggleDisputeWorkflowResponse);
  }),

  http.put(`${BASE}/master/dispute-workflow`, () => {
    return HttpResponse.json(mockUpdateDisputeWorkflowResponse);
  }),

  http.get(`${BASE}/master/lookup-value/options`, () => {
    return HttpResponse.json(mockRejectCategoryOptionsResponse);
  }),

  http.get(`*/master/lookup-value/options*`, () => {
    return HttpResponse.json(mockRejectCategoryOptionsResponse);
  }),

  http.get(`${BASE}/master/reject-category/options`, () => {
    return HttpResponse.json(mockRejectCategoryOptionsResponse);
  }),

  http.get(`*/master/reject-category/options*`, () => {
    return HttpResponse.json(mockRejectCategoryOptionsResponse);
  }),

  http.get(`*/master/role/options*`, () => {
    return HttpResponse.json(mockDisputeRoleOptionsResponse);
  }),

  http.get(`*/master/approval-workflow/stage-process/options*`, () => {
    return HttpResponse.json(mockDisputeStageProcessOptionsResponse);
  }),
];
