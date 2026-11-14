import type {
  PostingAuto,
  PostingAutoGroup,
  PostingAutoStatusSummary,
} from "@/features/monitoring/posting-auto/data/posting-auto.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE_URL = "*/monitoring/posting/auto";

export const mockPostingAutoGroup: PostingAutoGroup = {
  reversalFlag: "A",
  documentNumber: "DOC-001",
  reference: "REF-001",
  documentDate: "20250101",
  virtualAccount: "VA001",
  sapDocumentNumber: "SAP-001",
  sapStatus: "S",
  postingStatus: 0,
  assignment: null,
  fiscalYear: 2025,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
};

export const mockPostingAutoRecord: PostingAuto = {
  id: 1,
  fileName: "FILE001.DAT",
  recordNumber: "0001",
  transactionCode: "T001",
  withholdingTax: "10",
  reversalFlag: "A",
  documentType: "DT",
  postingDate: "20250101",
  documentDate: "20250101",
  documentNumber: "DOC-001",
  reference: "REF-001",
  debitCreditFlag: "S",
  accountNumber: "ACC-001",
  alternativeAccount: null,
  amount: 1000000,
  businessArea: "BA01",
  segment: "",
  fixedAssetNumber: "",
  costCenter: "",
  profitCenter: "",
  internalOrderFlag: null,
  assignment: null,
  vendor: null,
  customer: null,
  postingStatus: 0,
  postingTimestamp: null,
  sapStatus: "S",
  sapDocumentNumber: null,
  fiscalYear: 2025,
  statusMessage1: null,
  statusMessage2: null,
  statusMessage3: null,
  statusMessage4: null,
  statusMessage5: null,
  statusMessage6: null,
  statusMessage7: null,
  statusMessage8: null,
  statusMessage9: null,
  statusMessage10: null,
  assetAccountFlag: null,
  recordIndex: 1,
  totalIndex: 1,
  virtualAccount: "VA001",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: null,
};

export const mockStatusSummary: PostingAutoStatusSummary = {
  pendingCount: 10,
  postedCount: 20,
  errorCount: 5,
  sapSuccessCount: 15,
  sapErrorCount: 3,
  sapCancelCount: 2,
};

export const handlers = [
  http.get(`${BASE_URL}`, () => {
    const response: PagedApiResponse<PostingAutoGroup> = {
      success: true,
      message: "Success",
      data: {
        content: [mockPostingAutoGroup],
        totalElements: 1,
        totalPages: 1,
        number: 0,
        size: 10,
      },
    };
    return HttpResponse.json(response);
  }),

  http.get(`${BASE_URL}/summary/status`, () => {
    const response: ApiResponse<PostingAutoStatusSummary> = {
      success: true,
      message: "Success",
      data: mockStatusSummary,
    };
    return HttpResponse.json(response);
  }),

  http.get(`${BASE_URL}/:id`, ({ params }) => {
    const response: ApiResponse<PostingAuto> = {
      success: true,
      message: "Success",
      data: { ...mockPostingAutoRecord, id: Number(params.id) },
    };
    return HttpResponse.json(response);
  }),

  http.get(`${BASE_URL}/:reversalFlag/:documentNumber/:reference`, () => {
    const response: ApiResponse<PostingAuto[]> = {
      success: true,
      message: "Success",
      data: [mockPostingAutoRecord],
    };
    return HttpResponse.json(response);
  }),

  http.post(`${BASE_URL}`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const response: ApiResponse<PostingAuto> = {
      success: true,
      message: "Created",
      data: { ...mockPostingAutoRecord, ...body, id: 2 },
    };
    return HttpResponse.json(response);
  }),

  http.put(`${BASE_URL}/:id`, async ({ request, params }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const response: ApiResponse<PostingAuto> = {
      success: true,
      message: "Updated",
      data: { ...mockPostingAutoRecord, ...body, id: Number(params.id) },
    };
    return HttpResponse.json(response);
  }),

  http.delete(`${BASE_URL}/:id`, () => {
    const response: ApiResponse<number> = {
      success: true,
      message: "Deleted",
      data: 1,
    };
    return HttpResponse.json(response);
  }),
];
