import type {
  ApprovalWorkflowDetailApiResponse,
  ApprovalWorkflowListApiResponse,
  ApprovalWorkflowOptionsApiResponse,
  ApprovalWorkflowStageTemplateApiResponse,
  ApprovalWorkflowStageOptionsApiResponse,
  CreateApprovalWorkflowResponse,
} from "@/features/master-data/approval-workflow/data/approval-workflow.types";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockApprovalWorkflowListResponse: ApprovalWorkflowListApiResponse = {
  status: "SUCCESS",
  message: "Workflows retrieved successfully",
  data: [
    {
      transactionType: "SUPPLIER_PAYMENT",
      transactionTypeName: "Supplier Payment",
      description: "Workflow for supplier payments",
      roles: ["Role 1", "Role 2"],
    },
    {
      transactionType: "ADVANCE_PAYMENT",
      transactionTypeName: "Advance Payment",
      description: "Workflow for advance payments",
      roles: ["Finance Reviewer", "Finance Manager"],
    },
  ],
  errors: null,
};

export const mockApprovalWorkflowDetailResponse: ApprovalWorkflowDetailApiResponse = {
  status: "SUCCESS",
  message: "Workflow detail retrieved successfully",
  data: {
    approvalTransactionTypeId: "1246ac32-40d2-47c7-828c-bf37ae0868a0",
    transactionType: 1,
    name: "Supplier Payment Workflow",
    description: "Workflow for supplier payments",
    summarySla: "72",
    currency: "IDR",
    levels: [
      {
        id: "lvl-1",
        stageProcessCategory: "FINANCIAL",
        stageProcessCategoryName: "Financial",
        stageProcess: "financial-approval",
        stageProcessName: "Financial Approval",
        outputStep: "Approval Step",
        roleSetting: "MANUAL",
        role: "Role 2",
        bands: [],
      },
    ],
  },
  errors: null,
};

export const mockTransactionTypeOptionsResponse: ApprovalWorkflowOptionsApiResponse = {
  status: "SUCCESS",
  message: "Transaction type options retrieved successfully",
  data: [
    { value: 1, label: "Supplier Payment" },
    { value: 2, label: "Advance Payment" },
  ],
  errors: null,
};

export const mockStageCategoryOptionsResponse: ApprovalWorkflowStageOptionsApiResponse = {
  status: "SUCCESS",
  message: "Stage category options retrieved successfully",
  data: [
    { value: "BUSINESS_LAYER", label: "Business Layer" },
    { value: "FINANCIAL", label: "Financial" },
  ],
  errors: null,
};

export const mockStageProcessOptionsResponse: ApprovalWorkflowStageOptionsApiResponse = {
  status: "SUCCESS",
  message: "Stage process options retrieved successfully",
  data: [
    { value: "financial-approval", label: "Financial Approval" },
    { value: "financial-control", label: "Financial Control" },
  ],
  errors: null,
};

export const mockStageTemplateResponse: ApprovalWorkflowStageTemplateApiResponse = {
  status: "SUCCESS",
  message: "Default approval stages retrieved successfully",
  data: [
    {
      stageProcessCategory: "BUSINESS_LAYER",
      stageProcessCategoryName: "Business Unit",
      stageProcess: "business-unit-verification",
      stageProcessName: "Business Unit Verification",
      outputStep: "Verify submitted documents",
    },
    {
      stageProcessCategory: "FINANCIAL",
      stageProcessCategoryName: "Finance",
      stageProcess: "financial-control",
      stageProcessName: "Financial Control",
      outputStep: "Review financial details",
    },
  ],
  errors: null,
};

export const mockCreateApprovalWorkflowResponse: CreateApprovalWorkflowResponse = {
  status: "SUCCESS",
  message: "Approval workflow created successfully",
  data: { id: "wf-1" },
  errors: null,
};

export const mockUpdateApprovalWorkflowResponse: CreateApprovalWorkflowResponse = {
  status: "SUCCESS",
  message: "Approval workflow updated successfully",
  data: { id: "wf-1" },
  errors: null,
};

export const mockRoleOptionsResponse = {
  status: "SUCCESS",
  message: "Role options retrieved successfully",
  data: [
    { value: 1, label: "Role 1", alias: "ROLE_1", description: "Role 1 description" },
    { value: 2, label: "Role 2", alias: "ROLE_2", description: "Role 2 description" },
    { value: 3, label: "Department Head", alias: "DEPT_HEAD", description: "Department Head description" },
    { value: 4, label: "Finance Reviewer", alias: "FIN_REV", description: "Finance Reviewer description" },
    { value: 5, label: "Finance Manager", alias: "FIN_MGR", description: "Finance Manager description" },
    { value: 6, label: "Supervisor", alias: "SPV", description: "Supervisor description" },
    { value: 7, label: "Procurement", alias: "PROC", description: "Procurement description" },
    { value: 8, label: "Director", alias: "DIR", description: "Director description" },
    { value: 9, label: "Treasury", alias: "TRS", description: "Treasury description" },
  ],
  errors: null,
};

export const approvalWorkflowHandlers = [
  http.get(`*/master/module/name/:name`, ({ params }) => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Module retrieved successfully",
      data: {
        id: 1,
        name: params.name || "Payable",
        description: "Payable module",
      },
    });
  }),

  http.get(`${BASE}/master/approval-workflow`, () => {
    return HttpResponse.json(mockApprovalWorkflowListResponse);
  }),

  http.get(`${BASE}/master/approval-workflow/type/options`, () => {
    return HttpResponse.json(mockTransactionTypeOptionsResponse);
  }),

  http.get(`${BASE}/master/transaction-type/options`, () => {
    return HttpResponse.json(mockTransactionTypeOptionsResponse);
  }),

  http.get(`*/master/transaction-type/options*`, () => {
    return HttpResponse.json(mockTransactionTypeOptionsResponse);
  }),

  http.get(`${BASE}/master/transaction-types/options`, () => {
    return HttpResponse.json(mockTransactionTypeOptionsResponse);
  }),

  http.get(`*/master/transaction-types/options*`, () => {
    return HttpResponse.json(mockTransactionTypeOptionsResponse);
  }),

  http.get(`${BASE}/master/approval-workflow/stage-category/options`, () => {
    return HttpResponse.json(mockStageCategoryOptionsResponse);
  }),

  http.get(`${BASE}/master/approval-workflow/stage-process/options`, () => {
    return HttpResponse.json(mockStageProcessOptionsResponse);
  }),

  http.get(`${BASE}/master/approval-workflow/default-stages/:transactionTypeId`, () => {
    return HttpResponse.json(mockStageTemplateResponse);
  }),

  http.get(`${BASE}/master/approval-workflow/:type`, () => {
    return HttpResponse.json(mockApprovalWorkflowDetailResponse);
  }),

  http.post(`${BASE}/master/approval-workflow`, () => {
    return HttpResponse.json(mockCreateApprovalWorkflowResponse, {
      status: 201,
    });
  }),

  http.put(`${BASE}/master/approval-workflow/:id`, () => {
    return HttpResponse.json(mockUpdateApprovalWorkflowResponse, {
      status: 200,
    });
  }),

  http.get(`${BASE}/master/role/options`, () => {
    return HttpResponse.json(mockRoleOptionsResponse);
  }),

  http.get(`*/master/role/options`, () => {
    return HttpResponse.json(mockRoleOptionsResponse);
  }),
];
