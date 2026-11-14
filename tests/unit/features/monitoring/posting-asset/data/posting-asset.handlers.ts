import type {
  PostingAsset,
  PostingAssetGroup,
  PostingAssetStatusSummary,
} from "@/features/monitoring";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockPostingAssetGroup: PostingAssetGroup = {
  sapStatus: "S",
  postingStatus: 1,
  reversalFlag: "A",
  documentDate: "2024-01-15",
  documentNumber: "DOC-001",
  reference: "REF-001",
  assignment: "ASG-001",
  sapDocumentNumber: "SAP-001",
  fiscalYear: 2024,
  virtualAccount: "VA-001",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

export const mockPostingAsset: PostingAsset = {
  id: 1,
  fileName: "file.xlsx",
  recordNumber: "001",
  transactionCode: "TC01",
  withholdingTax: "PPh23",
  reversalFlag: "A",
  documentType: "DR",
  postingDate: "2024-01-15",
  documentDate: "2024-01-15",
  documentNumber: "DOC-001",
  reference: "REF-001",
  debitCreditFlag: "S",
  accountNumber: "1234567890",
  alternativeAccount: "0987654321",
  amount: 1000000,
  businessArea: "BA01",
  segment: "SEG01",
  fixedAssetNumber: "FA001",
  costCenter: "CC001",
  profitCenter: "PC001",
  internalOrderFlag: "IO01",
  assignment: "ASG-001",
  vendor: "V123",
  customer: "C456",
  postingStatus: 1,
  postingTimestamp: "2024-01-15T10:00:00Z",
  sapStatus: "S",
  sapDocumentNumber: "SAP-001",
  fiscalYear: 2024,
  virtualAccount: "VA-001",
  recordIndex: 1,
  totalIndex: 10,
  assetAccountFlag: "Y",
  wwrvc: "WWRVC01",
  kndnr: "KNDNR01",
  wwprd: "WWPRD01",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

export const mockPostingAssetStatusSummary: PostingAssetStatusSummary = {
  pendingCount: 5,
  postedCount: 10,
  errorCount: 2,
  sapSuccessCount: 8,
  sapErrorCount: 3,
  sapCancelCount: 1,
};

export const pagedPostingAssetGroupResponse: PagedApiResponse<PostingAssetGroup> =
  {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: {
      content: [mockPostingAssetGroup],
      pagination: {
        total: 1,
        pageSize: 10,
        pageNumber: 1,
        totalPages: 1,
        currentPage: 1,
        from: 1,
        to: 1,
      },
    },
  };

export const singlePostingAssetResponse: ApiResponse<PostingAsset> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockPostingAsset,
};

export const postingAssetByTransactionResponse: ApiResponse<PostingAsset[]> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: [mockPostingAsset],
};

export const statusSummaryResponse: ApiResponse<PostingAssetStatusSummary> = {
  status: "SUCCESS",
  message: "Status summary fetched successfully",
  data: mockPostingAssetStatusSummary,
};

export const postingAssetHandlers = [
  http.get(`${BASE}/monitoring/posting/asset/summary/status`, () =>
    HttpResponse.json(statusSummaryResponse),
  ),

  http.get(`${BASE}/monitoring/posting/asset`, () =>
    HttpResponse.json(pagedPostingAssetGroupResponse),
  ),

  http.get(
    `${BASE}/monitoring/posting/asset/:reversalFlag/:documentNumber/:reference`,
    () => HttpResponse.json(postingAssetByTransactionResponse),
  ),

  http.get(`${BASE}/monitoring/posting/asset/:id`, () =>
    HttpResponse.json(singlePostingAssetResponse),
  ),

  http.post(`${BASE}/monitoring/posting/asset`, () =>
    HttpResponse.json(singlePostingAssetResponse, { status: 201 }),
  ),

  http.put(`${BASE}/monitoring/posting/asset/:id`, () =>
    HttpResponse.json(singlePostingAssetResponse),
  ),

  http.delete(`${BASE}/monitoring/posting/asset/:id`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    }),
  ),
];
