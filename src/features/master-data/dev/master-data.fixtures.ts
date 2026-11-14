import type { SegmentRecord } from "@/features/master-data/segment/data/segment.types";
import type { ProfitCenterRecord } from "@/features/master-data/profit-center/data/profit-center.types";
import type { KbliRecord } from "@/features/master-data/kbli/data/kbli.types";
import type { DepartmentRecord } from "@/features/master-data/department/data/department.types";
import type { ContentRecord } from "@/features/master-data/content/data/content.types";
import type { ChequeRegisterRecord } from "@/features/master-data/cheque-register/data/cheque-register.types";
import type { StageProcessRecord } from "@/features/master-data/stage-process/data/stage-process.types";
import type { ApprovalWorkflowItem } from "@/features/master-data/approval-workflow/data";
import type { DisputeWorkflowItem } from "@/features/master-data/dispute-workflow/data/dispute-workflow.types";

/** Development-only sample data shared by the Master Data feature adapters. */
export const masterDataFixtures = {
  segments: [
    {
      segmentId: "SEG-001",
      segmentName: "Corporate Banking",
      parentSegmentId: null,
      description: "Corporate banking services",
      status: "ACTIVE",
    },
    {
      segmentId: "SEG-002",
      segmentName: "Commercial Banking",
      parentSegmentId: null,
      description: "Commercial customer segment",
      status: "ACTIVE",
    },
    {
      segmentId: "SEG-003",
      segmentName: "Large Corporates",
      parentSegmentId: "SEG-001",
      description: "Large corporate customers",
      status: "ACTIVE",
    },
    {
      segmentId: "SEG-004",
      segmentName: "Small Business",
      parentSegmentId: "SEG-002",
      description: "Small business customers",
      status: "INACTIVE",
    },
  ] satisfies SegmentRecord[],
  profitCenters: [
    { profitCenterId: "PC-0001", profitCenterName: "Corporate Operations", parentProfitCenterId: "", segmentId: "SEG-001", businessUnitId: "BU-001", responsiblePerson: "John Smith", status: "ACTIVE" },
    { profitCenterId: "PC-1001", profitCenterName: "Sales Division", parentProfitCenterId: "PC-0001", segmentId: "SEG-002", businessUnitId: "BU-002", responsiblePerson: "John Smith", status: "ACTIVE" },
    { profitCenterId: "PC-1002", profitCenterName: "Marketing Operations", parentProfitCenterId: "PC-0001", segmentId: "SEG-002", businessUnitId: "BU-003", responsiblePerson: "", status: "ACTIVE" },
    { profitCenterId: "PC-1003", profitCenterName: "Finance & Accounting", parentProfitCenterId: "PC-0001", segmentId: "SEG-001", businessUnitId: "BU-004", responsiblePerson: "John Smith", status: "ACTIVE" },
    { profitCenterId: "PC-1004", profitCenterName: "Human Resources", parentProfitCenterId: "PC-0001", segmentId: "SEG-002", businessUnitId: "BU-005", responsiblePerson: "", status: "ACTIVE" },
    { profitCenterId: "PC-1005", profitCenterName: "Research & Development", parentProfitCenterId: "PC-0001", segmentId: "SEG-001", businessUnitId: "BU-006", responsiblePerson: "John Smith", status: "ACTIVE" },
    { profitCenterId: "PC-1006", profitCenterName: "Supply Chain Management", parentProfitCenterId: "PC-0001", segmentId: "SEG-002", businessUnitId: "BU-007", responsiblePerson: "", status: "INACTIVE" },
    { profitCenterId: "PC-1007", profitCenterName: "Customer Support", parentProfitCenterId: "PC-0001", segmentId: "SEG-001", businessUnitId: "BU-008", responsiblePerson: "John Smith", status: "ACTIVE" },
  ] satisfies ProfitCenterRecord[],
  responsiblePersons: ["John Smith"],
  // Illustrative development values follow examples in PRD 9.1.4.2 and 9.1.6;
  // production tax options and rates must come from the active tax master API.
  kbliRecords: [
    { id: "KBLI-47111", code: "47111", businessFieldName: "Perdagangan Eceran Berbagai Macam Barang", category: "Perdagangan Besar dan Eceran", status: "ACTIVE" },
    { id: "KBLI-62011", code: "62011", businessFieldName: "Aktivitas Pemrograman Komputer", category: "Aktivitas Profesional, Ilmiah dan Teknis", status: "ACTIVE" },
    { id: "KBLI-64191", code: "64191", businessFieldName: "Jasa Intermediasi Moneter Lainnya", category: "Aktivitas Keuangan dan Asuransi", status: "INACTIVE" },
  ] satisfies KbliRecord[],
  departments: [
    { id: "DEPT-FIN-001", name: "Finance", code: "FIN-001", parentDepartmentId: null, status: "ACTIVE" },
    { id: "DEPT-HR-001", name: "Human Resources", code: "HR-001", parentDepartmentId: null, status: "ACTIVE" },
    { id: "DEPT-IT-001", name: "Information Technology", code: "IT-001", parentDepartmentId: "DEPT-FIN-001", status: "ACTIVE" },
    { id: "DEPT-OPS-001", name: "Operations", code: "OPS-001", parentDepartmentId: null, status: "INACTIVE" },
    { id: "DEPT-FIN-002", name: "Finance Operations", code: "FIN-002", parentDepartmentId: "DEPT-FIN-001", status: "ACTIVE" },
    { id: "DEPT-HR-002", name: "Talent Management", code: "HR-002", parentDepartmentId: "DEPT-HR-001", status: "ACTIVE" },
    { id: "DEPT-PR-001", name: "Procurement", code: "PR-001", parentDepartmentId: null, status: "ACTIVE" },
    { id: "DEPT-CS-001", name: "Corporate Services", code: "CS-001", parentDepartmentId: null, status: "ACTIVE" },
    { id: "DEPT-RISK-001", name: "Risk Management", code: "RISK-001", parentDepartmentId: "DEPT-FIN-001", status: "ACTIVE" },
    { id: "DEPT-LEG-001", name: "Legal", code: "LEG-001", parentDepartmentId: null, status: "ACTIVE" },
    { id: "DEPT-IT-002", name: "IT Support", code: "IT-002", parentDepartmentId: "DEPT-IT-001", status: "ACTIVE" },
    { id: "DEPT-IT-003", name: "Network Engineering", code: "IT-003", parentDepartmentId: "DEPT-IT-001", status: "ACTIVE" },
    { id: "DEPT-AUD-001", name: "Internal Audit", code: "AUD-001", parentDepartmentId: null, status: "INACTIVE" },
    { id: "DEPT-STR-001", name: "Strategy", code: "STR-001", parentDepartmentId: null, status: "ACTIVE" },
    { id: "DEPT-CUST-001", name: "Customer Care", code: "CUST-001", parentDepartmentId: null, status: "ACTIVE" },
    { id: "DEPT-HR-003", name: "Payroll", code: "HR-003", parentDepartmentId: "DEPT-HR-001", status: "ACTIVE" },
  ] satisfies DepartmentRecord[],
  contents: [
    { id: "CONTENT-001", sectionName: "Hero Banner", content: "Kelola pembayaran Anda dengan mudah dan transparan", status: "ACTIVE" },
    { id: "CONTENT-002", sectionName: "Tentang Kami", content: "Kami membantu bisnis mengelola proses pembayaran.", status: "ACTIVE" },
    { id: "CONTENT-003", sectionName: "Cara Kerja", content: "Temukan cara kerja platform Core Finance.", status: "INACTIVE" },
  ] satisfies ContentRecord[],
  chequeRegisters: [
    { id: "CHQ-REG-001", houseBankId: "HB-BCA-001", houseBankName: "BCA - Operating Account", chequeNumber: "CHQ-001", status: "OPEN", releaseDate: "", isActive: true },
    { id: "CHQ-REG-002", houseBankId: "HB-BNI-001", houseBankName: "BNI - Payment Account", chequeNumber: "BG-014", status: "RELEASE", releaseDate: "2026-02-02", isActive: true },
    { id: "CHQ-REG-003", houseBankId: "HB-BRI-001", houseBankName: "BRI - Legacy Account", chequeNumber: "CHQ-501", status: "OPEN", releaseDate: "", isActive: false },
  ] satisfies ChequeRegisterRecord[],
  chequeRegisterHouseBanks: [
    { id: "HB-BCA-001", name: "BCA - Operating Account", status: "ACTIVE" },
    { id: "HB-BNI-001", name: "BNI - Payment Account", status: "ACTIVE" },
    { id: "HB-BRI-001", name: "BRI - Legacy Account", status: "INACTIVE" },
  ],
  stageProcesses: [
    { id: "STAGE-01", sequence: 1, roleGroup: "Business Partner", processName: "Partner Submission", processType: "Submission", slaDays: 1, version: 0 },
    { id: "STAGE-02", sequence: 2, roleGroup: "Business Partner", processName: "Update/Revise Invoice Submission", processType: "Submission", slaDays: 1, version: 0 },
    { id: "STAGE-03", sequence: 3, roleGroup: "Business Unit", processName: "Business Unit Submission", processType: "Submission", slaDays: 1, version: 0 },
    { id: "STAGE-04", sequence: 4, roleGroup: "Business Unit", processName: "Accountability Report", processType: "Submission", slaDays: 1, version: 0 },
    { id: "STAGE-05", sequence: 5, roleGroup: "Business Unit", processName: "Business Unit Verification", processType: "Verification", slaDays: 1, version: 0 },
    { id: "STAGE-06", sequence: 6, roleGroup: "Business Unit", processName: "Substantive Approval", processType: "Approval", slaDays: 1, version: 0 },
    { id: "STAGE-07", sequence: 7, roleGroup: "Business Unit", processName: "Budget Availability Request", processType: "Approval", slaDays: 1, version: 0 },
    { id: "STAGE-08", sequence: 8, roleGroup: "Budgeting", processName: "Budget Availability Approval", processType: "Approval", slaDays: 1, version: 0 },
    { id: "STAGE-09", sequence: 9, roleGroup: "FSSC Service", processName: "Payment Readiness Check", processType: "Verification", slaDays: 1, version: 0 },
    { id: "STAGE-10", sequence: 10, roleGroup: "FSSC Service", processName: "Dispute & Resolution", processType: "Execution", slaDays: 1, version: 0 },
    { id: "STAGE-11", sequence: 11, roleGroup: "FSSC Service", processName: "Reconciliation", processType: "Execution", slaDays: 1, version: 0 },
    { id: "STAGE-12", sequence: 12, roleGroup: "Finance", processName: "Financial Control", processType: "Approval", slaDays: 1, version: 0 },
    { id: "STAGE-13", sequence: 13, roleGroup: "Finance", processName: "Financial Authority", processType: "Approval", slaDays: 1, version: 0 },
    { id: "STAGE-14", sequence: 14, roleGroup: "Treasury", processName: "Set Source of Fund", processType: "Execution", slaDays: 1, version: 0 },
    { id: "STAGE-15", sequence: 15, roleGroup: "Treasury", processName: "Payment Preparation", processType: "Execution", slaDays: 1, version: 0 },
    { id: "STAGE-16", sequence: 16, roleGroup: "Treasury", processName: "Cashout Verification", processType: "Verification", slaDays: 1, version: 0 },
    { id: "STAGE-17", sequence: 17, roleGroup: "Treasury", processName: "Cashout Authorization", processType: "Approval", slaDays: 1, version: 0 },
    { id: "STAGE-18", sequence: 18, roleGroup: "Treasury", processName: "Payment Execution", processType: "Execution", slaDays: 1, version: 0 },
  ] as const satisfies readonly StageProcessRecord[],
  approvalRoles: ["Department Head", "Finance Reviewer", "Finance Manager", "Business Partner", "Budget Owner", "Treasury Reviewer", "Treasury Manager", "FSSC Reviewer"],
  approvalWorkflows: [
    {
      id: "WF-ADVANCE",
      code: "WF-ADVANCE",
      transactionType: "Advance Payment",
      title: "Advance Payment Approval",
      description: "Travel and operational cash advances",
      summarySla: "2 business days",
      steps: [
        { id: "WF-ADVANCE-S1", order: 1, roleName: "Department Head", description: "Review submitted data" },
        { id: "WF-ADVANCE-S2", order: 2, roleName: "Finance Reviewer", department: "Finance" },
      ],
      levels: [
        { id: "WF-ADVANCE-L1", order: 1, layer: "Business Layer", title: "Substantive Approval", description: "Approval of submitted data", outputStep: "Approval of submitted data", roleSetting: "manually", roleName: "Department Head" },
        { id: "WF-ADVANCE-L2", order: 2, layer: "Financial", title: "Financial Control", description: "Financial control approval", outputStep: "Financial control approval", roleSetting: "limit-based", limits: [{ id: "WF-ADVANCE-T1", minAmount: "0", maxAmount: "2,000,000,000", roleName: "Finance Reviewer" }, { id: "WF-ADVANCE-T2", minAmount: "2,000,000,000", maxAmount: "5,000,000,000", roleName: "Finance Manager" }] },
      ],
    },
    {
      id: "WF-SUPPLIER",
      code: "WF-SUPPLIER",
      transactionType: "Supplier Payment",
      title: "Supplier Payment Approval",
      description: "Supplier invoice payment workflow",
      summarySla: "3 business days",
      steps: [
        { id: "WF-SUPPLIER-S1", order: 1, roleName: "FSSC Reviewer", description: "Verify payment readiness" },
        { id: "WF-SUPPLIER-S2", order: 2, roleName: "Treasury Manager", department: "Treasury" },
      ],
      levels: [
        { id: "WF-SUPPLIER-L1", order: 1, layer: "FSSC POP", title: "Payment Readiness Check", description: "Verify payment readiness", outputStep: "Verify payment readiness", roleSetting: "manually", roleName: "FSSC Reviewer" },
        { id: "WF-SUPPLIER-L2", order: 2, layer: "Treasury", title: "Cashout Authorization", description: "Authorize cashout", outputStep: "Authorize cashout", roleSetting: "manually", roleName: "Treasury Manager" },
      ],
    },
  ] satisfies ApprovalWorkflowItem[],
  rejectReasons: ["Dokumen tidak lengkap", "Bisnis konteks tidak tepat", "Data tidak sesuai", "Perlu perbaikan dokumen"],
  disputeWorkflows: [
    {
      id: "DISPUTE-STAGE-06",
      stageProcessCategory: "Business Layer",
      stageProcessName: "Substantive Approval",
      isLinked: true,
      description: "Routing rules for rejected substantive approvals.",
      rejectDestinations: [
        { id: "DISPUTE-STAGE-06-R1", rejectReasonCategory: "Bisnis konteks tidak tepat", rejectDestination: "Dispute Resolution", afterCaseCloseDestination: "Back to submitter", description: "Review context with the submitter after case resolution." },
        { id: "DISPUTE-STAGE-06-R2", rejectReasonCategory: "Dokumen tidak lengkap", rejectDestination: "Non Dispute", nonDisputeRole: "Business Partner", afterCaseCloseDestination: "Another stage", stageProcess: "Budget Availability Approval", description: "Return for documents, then continue budget approval." },
      ],
    },
  ] satisfies DisputeWorkflowItem[],
};
