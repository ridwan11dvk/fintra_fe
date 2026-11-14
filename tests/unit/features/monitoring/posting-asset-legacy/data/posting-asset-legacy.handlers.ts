import type { PostingAssetLegacyGroup } from "@/features/monitoring/posting-asset-legacy/data/posting-asset-legacy.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";
const URL = `${BASE}/monitoring-legacy/posting/invoices`;

export const mockPostingAssetLegacyGroup: PostingAssetLegacyGroup = {
  REVERSAL: "",
  DOC_DATE: "2024-06-01",
  NO_DOK: "INV-001",
  ASSIGNMENT: null,
  REFERENCE: "REF-001",
  NO_DOKSAP: null,
  POSTING_DATE: "2024-06-01",
  Fiscal_year: 2024,
  virtual_acc: null,
  pos_status: 0,
  pos_tgl: null,
  entry_date: null,
  status0: "OPEN",
};

const pagedResponse: PagedApiResponse<PostingAssetLegacyGroup> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockPostingAssetLegacyGroup],
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

const detailResponse: ApiResponse<unknown> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: [
    {
      id: 1,
      REVERSAL: "",
      TCODE: "FB01",
      DOC_TYPE: "KR",
      DOC_DATE: "2024-06-01",
      NO_DOK: "INV-001",
      REFERENCE: "REF-001",
      POSTING_DATE: "2024-06-01",
      Fiscal_year: 2024,
      pos_status: 0,
      indeks: 1,
      totalidx: 1,
      ACCOUNT: "200001",
      AMOUNT: "2000",
      DEBIT_KREDIT: "H",
      BA: "2000",
    },
  ],
};

const ok = { status: "SUCCESS", message: "OK", data: null };

export const postingAssetLegacyHandlers = [
  http.get(URL, () => HttpResponse.json(pagedResponse)),
  http.get(`${URL}/:reversal/:noDok/:reference`, () =>
    HttpResponse.json(detailResponse),
  ),
  http.post(URL, () => HttpResponse.json(ok, { status: 201 })),
  http.put(`${URL}/:reversal/:noDok/:reference/:indeks`, () =>
    HttpResponse.json(ok),
  ),
  http.delete(`${URL}/:reversal/:noDok/:reference/:indeks`, () =>
    HttpResponse.json(ok),
  ),
  http.post(`${URL}/generate`, () => HttpResponse.json(ok)),
  http.post(`${URL}/batch/send-to-sap`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "OK",
      data: { successful: [], failed: [], total_processed: 0 },
    }),
  ),
  http.post(`${URL}/batch/regenerate`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "OK",
      data: {
        successful: [],
        failed: [],
        total_processed: 0,
        total_old_entries: 0,
        total_new_entries: 0,
      },
    }),
  ),
  http.post(`${URL}/:reversal/:noDok/:reference/regenerate`, () =>
    HttpResponse.json(ok),
  ),
  http.post(`${URL}/:reversal/:noDok/:reference/send-to-sap`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "OK",
      data: { sap_doc_number: "SAP-002" },
    }),
  ),
];
