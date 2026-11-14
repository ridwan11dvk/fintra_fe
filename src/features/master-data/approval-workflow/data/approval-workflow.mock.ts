import type {
  ApprovalLevelItem,
  ApprovalWorkflowItem,
} from "./approval-workflow.types";

export const mockTransactionTypeOptions = [
  { value: "ADV_PAY", label: "Advance Payment" },
  { value: "SUP_PAY", label: "Supplier Payment" },
  { value: "PETTY_CASH", label: "Petty Cash" },
  { value: "REIMBURSEMENT", label: "Reimbursement" },
  { value: "DIRECT_DEBIT", label: "Direct Debit" },
  { value: "TAX_CORETAX", label: "Tax & Coretax" },
];

export const TRANSACTION_TYPE_OPTIONS = mockTransactionTypeOptions;

export const STAGE_PROCESS_CATEGORIES = [
  "Business Layer",
  "FSSC POP",
  "Financial",
  "Treasury",
];

export const STAGE_PROCESS_NAMES = [
  "Substantive Approval",
  "Budget Approval",
  "Budget Plan Approval",
  "FSSC Verification",
  "Financial Control",
  "Financial Approval",
  "Cashout Verification",
  "Cashout Approval",
];

export const ROLE_NAME_OPTIONS = [
  "Role 1",
  "Role 2",
  "Department Head",
  "Finance Reviewer",
  "Finance Manager",
  "Supervisor",
  "Procurement",
  "Director",
  "Treasury",
];

export const initialApprovalLevels: ApprovalLevelItem[] = [
  {
    id: "lvl-1",
    order: 1,
    layer: "Business Layer",
    title: "Substantive Approval",
    description: "Mengajukan permintaan & melampirkan dokumen",
    outputStep: "Approval of submitted data",
    roleSetting: "manually",
    roleName: "Role 1",
  },
  {
    id: "lvl-2",
    order: 2,
    layer: "Business Layer",
    title: "Budget Approval",
    description: "Mengajukan permintaan & melampirkan dokumen",
    outputStep: "Approval of submitted data",
    roleSetting: "manually",
    roleName: "Role 1",
  },
  {
    id: "lvl-3",
    order: 3,
    layer: "Business Layer",
    title: "Budget Plan Approval",
    description: "Mengajukan permintaan & melampirkan dokumen",
    outputStep: "Approval of submitted data",
    roleSetting: "manually",
    roleName: "Role 1",
  },
  {
    id: "lvl-4",
    order: 4,
    layer: "FSSC POP",
    title: "FSSC Verification",
    description: "Mengajukan permintaan & melampirkan dokumen",
    outputStep: "Approval of submitted data",
    roleSetting: "manually",
    roleName: "Role 1",
  },
  {
    id: "lvl-5",
    order: 5,
    layer: "Financial",
    title: "Financial Control",
    description: "Mengajukan permintaan & melampirkan dokumen",
    outputStep: "Approval of submitted data",
    roleSetting: "limit-based",
    limits: [
      {
        id: "lim-1",
        minAmount: "2,000,000,000",
        maxAmount: "5,000,000,000",
        roleName: "Role 1",
      },
      {
        id: "lim-2",
        minAmount: "2,000,000,000",
        maxAmount: "5,000,000,000",
        roleName: "Role 2",
      },
    ],
  },
  {
    id: "lvl-6",
    order: 6,
    layer: "Financial",
    title: "Financial Approval",
    description: "Mengajukan permintaan & melampirkan dokumen",
    outputStep: "Approval of submitted data",
    roleSetting: "manually",
    roleName: "Role 1",
  },
  {
    id: "lvl-7",
    order: 7,
    layer: "Treasury",
    title: "Cashout Verification",
    description: "Mengajukan permintaan & melampirkan dokumen",
    outputStep: "Approval of submitted data",
    roleSetting: "manually",
    roleName: "Role 1",
  },
  {
    id: "lvl-8",
    order: 8,
    layer: "Treasury",
    title: "Cashout Approval",
    description: "Mengajukan permintaan & melampirkan dokumen",
    outputStep: "Approval of submitted data",
    roleSetting: "manually",
    roleName: "Role 1",
  },
];

export const initialApprovalWorkflows: ApprovalWorkflowItem[] = [
  {
    id: "wf-1",
    code: "ADV_PAY",
    transactionType: "ADV_PAY",
    title: "Advance Payment Approval",
    description: "Travel and operational cash advances",
    summarySla: "100 hour",
    levels: initialApprovalLevels,
    steps: [
      {
        id: "s1-1",
        order: 1,
        roleName: "Department Head",
        department: "User Department",
        description: "Initial review and verification of advance request",
      },
      {
        id: "s1-2",
        order: 2,
        roleName: "Finance Reviewer",
        department: "Finance",
        description: "Budget compliance and supporting document verification",
      },
      {
        id: "s1-3",
        order: 3,
        roleName: "Finance Manager",
        department: "Finance",
        description: "Final approval and payment authorization",
      },
    ],
    isActive: true,
  },
  {
    id: "wf-2",
    code: "SUP_PAY",
    title: "Supplier Payment",
    description: "Business Partner bill payments — Invoice, SES/GR",
    summarySla: "72 hour",
    steps: [
      {
        id: "s2-1",
        order: 1,
        roleName: "Procurement",
        department: "Procurement",
        description: "Verification against PO and goods receipt",
      },
      {
        id: "s2-2",
        order: 2,
        roleName: "Finance Manager",
        department: "Finance",
        description: "Financial review and tax clearance",
      },
      {
        id: "s2-3",
        order: 3,
        roleName: "Director",
        department: "Executive",
        description: "High-level expenditure approval",
      },
    ],
    isActive: true,
  },
  {
    id: "wf-3",
    code: "PETTY_CASH",
    title: "Petty Cash",
    description: "Small daily operational expenses and disbursements",
    summarySla: "48 hour",
    steps: [
      {
        id: "s3-1",
        order: 1,
        roleName: "Department Head",
        department: "User Department",
        description: "Petty cash request verification",
      },
      {
        id: "s3-2",
        order: 2,
        roleName: "Finance Reviewer",
        department: "Finance",
        description: "Receipt & voucher compliance verification",
      },
      {
        id: "s3-3",
        order: 3,
        roleName: "Finance Manager",
        department: "Finance",
        description: "Petty cash custodian review and disbursement approval",
      },
    ],
    isActive: true,
  },
  {
    id: "wf-4",
    code: "REIMBURSEMENT",
    title: "Reimbursement",
    description: "Employee out-of-pocket operational reimbursement",
    summarySla: "48 hour",
    steps: [
      {
        id: "s4-1",
        order: 1,
        roleName: "Supervisor",
        department: "User Department",
        description: "Direct supervisor verification",
      },
      {
        id: "s4-2",
        order: 2,
        roleName: "Department Head",
        department: "User Department",
        description: "Expense validity and policy compliance review",
      },
      {
        id: "s4-3",
        order: 3,
        roleName: "Finance Manager",
        department: "Finance",
        description: "Accounting verification and payout approval",
      },
    ],
    isActive: true,
  },
  {
    id: "wf-5",
    code: "DIRECT_DEBIT",
    title: "Direct Debit",
    description: "Automatic bank debit mandates and utility payments",
    summarySla: "24 hour",
    steps: [
      {
        id: "s5-1",
        order: 1,
        roleName: "Treasury",
        department: "Treasury",
        description: "Mandate verification & bank balance matching",
      },
      {
        id: "s5-2",
        order: 2,
        roleName: "Finance Manager",
        department: "Finance",
        description: "Direct debit authorization",
      },
    ],
    isActive: true,
  },
  {
    id: "wf-6",
    code: "TAX_CORETAX",
    title: "Tax & Coretax",
    description: "Monthly & annual withholding tax and coretax compliance",
    summarySla: "120 hour",
    steps: [
      {
        id: "s6-1",
        order: 1,
        roleName: "Supervisor",
        department: "Taxation",
        description: "Tax calculation & e-billing validation",
      },
      {
        id: "s6-2",
        order: 2,
        roleName: "Finance Reviewer",
        department: "Finance",
        description: "Tax filing review and NTPN settlement verification",
      },
    ],
    isActive: true,
  },
];

export function createApprovalWorkflow(item: ApprovalWorkflowItem): void {
  initialApprovalWorkflows.unshift(item);
}

export function updateApprovalWorkflow(
  id: string,
  update: Partial<ApprovalWorkflowItem>,
): void {
  const index = initialApprovalWorkflows.findIndex((w) => w.id === id);
  if (index !== -1) {
    initialApprovalWorkflows[index] = {
      ...initialApprovalWorkflows[index],
      ...update,
      updatedAt: new Date().toISOString(),
    };
  }
}

