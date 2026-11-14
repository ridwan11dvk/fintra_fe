export interface ApprovalStep {
  id: string;
  order: number;
  roleName: string;
  department?: string;
  description?: string;
}

export interface ApprovalLimitRow {
  id: string;
  minAmount: string;
  maxAmount: string;
  roleName: string;
}

export interface ApprovalWorkflowFormData {
  transactionType: string;
  workflowName: string;
  description: string;
}

export interface ApprovalLevelItem {
  id: string;
  order: number;
  layer: string;
  categoryName?: string;
  title: string;
  processName?: string;
  description: string;
  outputStep?: string;
  roleSetting?: "manually" | "limit-based";
  roleName?: string;
  limits?: ApprovalLimitRow[];
}

export type ApprovalRoleSetting = "MANUAL" | "LIMIT_BANDS";

export interface ApprovalBandRequest {
  min: number;
  max: number;
  role: string;
}

export interface ApprovalLevelRequest {
  stageProcessCategory: string;
  stageProcess: string;
  outputStep: string;
  roleSetting: ApprovalRoleSetting;
  role?: string;
  bands?: ApprovalBandRequest[];
}

export interface CreateApprovalWorkflowRequest {
  transactionType: number;
  name: string;
  description: string;
  currency: string;
  levels: ApprovalLevelRequest[];
}

export type ApprovalWorkflowResponseStatus =
  | "SUCCESS"
  | "ERROR"
  | "WARNING"
  | string;

export interface CreateApprovalWorkflowResponse {
  message: string;
  status: ApprovalWorkflowResponseStatus;
  data?: unknown;
  errors?: ApiFieldError[] | null;
}

export type UpdateApprovalWorkflowRequest = CreateApprovalWorkflowRequest;
export type UpdateApprovalWorkflowResponse = CreateApprovalWorkflowResponse;

export interface ApprovalWorkflowDetailBand {
  min: number;
  max: number;
  role: string;
}

export interface ApprovalWorkflowDetailLevel {
  id: string;
  stageProcessCategory: string;
  stageProcessCategoryName?: string;
  stageProcess: string;
  stageProcessName?: string;
  outputStep: string;
  roleSetting: "MANUAL" | "LIMIT_BANDS" | string;
  role?: string;
  bands?: ApprovalWorkflowDetailBand[];
}

export interface ApprovalWorkflowDetailData {
  approvalTransactionTypeId?: string;
  transactionType: number;
  name: string;
  description: string;
  currency: string;
  summarySla?: string;
  levels: ApprovalWorkflowDetailLevel[];
}

export interface ApprovalWorkflowDetailApiResponse {
  message: string;
  status: ApprovalWorkflowResponseStatus;
  data: ApprovalWorkflowDetailData;
  errors?: ApiFieldError[] | null;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApprovalWorkflowOptionItem {
  value: number;
  label: string;
  alias?: string;
  description?: string;
}

export interface ApprovalWorkflowOptionsApiResponse {
  message: string;
  status: ApprovalWorkflowResponseStatus;
  data: ApprovalWorkflowOptionItem[];
  errors?: ApiFieldError[] | null;
}

export interface ApprovalWorkflowStageOptionItem {
  value: string;
  label: string;
  alias?: string;
  description?: string;
}

export interface ApprovalWorkflowStageOptionsApiResponse {
  message: string;
  status: ApprovalWorkflowResponseStatus;
  data: ApprovalWorkflowStageOptionItem[];
  errors?: ApiFieldError[] | null;
}

export interface ApprovalWorkflowStageTemplateItem {
  stageProcessCategory: string;
  stageProcessCategoryName: string;
  stageProcess: string;
  stageProcessName: string;
  outputStep: string | null;
}

export interface ApprovalWorkflowStageTemplateApiResponse {
  message: string;
  status: ApprovalWorkflowResponseStatus;
  data: ApprovalWorkflowStageTemplateItem[];
  errors?: ApiFieldError[] | null;
}

export interface ApprovalWorkflowListItemResponse {
  transactionType: string | number;
  transactionTypeName: string;
  description: string;
  roles: string[];
}

export interface ApprovalWorkflowListApiResponse {
  message: string;
  status: ApprovalWorkflowResponseStatus;
  data: ApprovalWorkflowListItemResponse[];
  errors?: ApiFieldError[] | null;
}

export interface ApprovalWorkflowItem {
  id: string;
  code: string;
  transactionType?: string;
  title: string;
  description: string;
  summarySla?: string;
  steps: ApprovalStep[];
  levels?: ApprovalLevelItem[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateApprovalWorkflowPayload {
  title: string;
  description: string;
  steps: string[];
}

export interface UpdateApprovalWorkflowPayload {
  id: string;
  title: string;
  description: string;
  steps: ApprovalStep[];
}
