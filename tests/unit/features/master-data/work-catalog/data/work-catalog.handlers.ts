import type { WorkCatalogResponse } from "@/features/master-data/work-catalog/data/work-catalog.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockWorkCatalog: WorkCatalogResponse = {
  id: 1,
  workType: "Pengangkutan",
  isActive: true,
  subCategory: {
    id: 1,
    code: "SUB-01.1",
    name: "SUB-01.1: Operasional & Utility",
  },
  groupCategory: {
    id: 1,
    name: "Utility & Fasilitas",
  },
  mainCategory: {
    id: 1,
    code: "CASH",
    name: "Cash",
  },
  cashflowCategory: {
    id: 1,
    code: "CAT-A",
    name: "Category A",
  },
  procurementSchema: {
    id: 1,
    code: "GOODS",
    name: "Pengadaan Barang Murni",
  },
  description: "Jasa angkut barang",
  taxes: [
    {
      id: 1,
      taxSubject: "BADAN_USAHA",
      taxRateId: 1,
      taxRateCode: "TR.0001",
      taxRateName: "PPN 11%",
      taxType: "PPN",
      coefficientNumerator: 11,
      coefficientDenominator: 100,
      coefficient: 0.11,
      ratePercent: 11,
      sortOrder: 0,
    },
    {
      id: 2,
      taxSubject: "PERORANGAN",
      taxRateId: 2,
      taxRateCode: "TR.0002",
      taxRateName: "PPh 2%",
      taxType: "PPh",
      coefficientNumerator: 2,
      coefficientDenominator: 1,
      coefficient: 2,
      ratePercent: 2,
      sortOrder: 1,
    },
  ],
};

export const pagedWorkCatalogResponse: PagedApiResponse<WorkCatalogResponse> =
  {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: {
      content: [mockWorkCatalog],
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

export const singleWorkCatalogResponse: ApiResponse<WorkCatalogResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockWorkCatalog,
};

export const workCatalogListResponse: ApiResponse<WorkCatalogResponse[]> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: [mockWorkCatalog],
};

export const workCatalogHandlers = [
  http.get(`${BASE}/master/work-catalog/active`, () => {
    return HttpResponse.json(workCatalogListResponse);
  }),

  http.get(
    `${BASE}/master/work-catalog/company/:companyCode/ba/:baCode`,
    () => {
      return HttpResponse.json(workCatalogListResponse);
    },
  ),

  http.get(`${BASE}/master/work-catalog`, () => {
    return HttpResponse.json(pagedWorkCatalogResponse);
  }),

  http.get(`${BASE}/master/work-catalog/:id`, () => {
    return HttpResponse.json(singleWorkCatalogResponse);
  }),

  http.post(`${BASE}/master/work-catalog`, () => {
    return HttpResponse.json(singleWorkCatalogResponse, { status: 201 });
  }),

  http.put(`${BASE}/master/work-catalog/:id`, () => {
    return HttpResponse.json(singleWorkCatalogResponse);
  }),

  http.delete(`${BASE}/master/work-catalog/:id`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    });
  }),

  http.patch(`${BASE}/master/work-catalog/:id/activate`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Work catalog activated",
      data: { ...mockWorkCatalog, isActive: true },
    });
  }),

  http.patch(`${BASE}/master/work-catalog/:id/deactivate`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Work catalog deactivated",
      data: { ...mockWorkCatalog, isActive: false },
    });
  }),
];
