import type {
  TaxableItemResponse,
  TaxableItemRow,
  TaxableItemTreeNode,
} from "@/features/master-data/taxable-item/data/taxable-item.types";
import type { ModuleResponse } from "@/features/settings";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockModule: ModuleResponse = {
  id: 1,
  name: "Sales",
  code: "SALES",
  isActive: true,
};

export const mockTaxableItem: TaxableItemResponse = {
  id: 1,
  code: "GOODS-001",
  altCode: "ALT-001",
  fullCode: "GOODS-CATEGORY-001",
  fullAltCode: "ALT-CATEGORY-001",
  name: "Electronic Goods",
  level: 1,
  parentId: null,
  parent: null,
  type: "GOODS",
  moduleId: 1,
  module: mockModule,
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const mockChildTaxableItem: TaxableItemResponse = {
  id: 2,
  code: "ELEC-001",
  altCode: "ALT-ELEC-001",
  fullCode: "GOODS-CATEGORY-001-ELEC",
  name: "Electronics",
  level: 2,
  parentId: 1,
  parent: mockTaxableItem,
  type: "GOODS",
  moduleId: 1,
  module: mockModule,
  isActive: true,
  createdAt: "2024-01-02T00:00:00Z",
  updatedAt: "2024-01-02T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const mockTaxableItemRow: TaxableItemRow = {
  level1: mockTaxableItem,
  level2: mockChildTaxableItem,
  level3: null,
  level4: null,
};

export const mockTaxableItemTreeNode: TaxableItemTreeNode = {
  id: 1,
  code: "GOODS-001",
  name: "Electronic Goods",
  level: 1,
  parentId: undefined,
  type: "GOODS",
  isActive: true,
  children: [],
};

export const pagedTaxableItemResponse: PagedApiResponse<TaxableItemResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockTaxableItem],
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

export const pagedTaxableItemRowResponse: PagedApiResponse<TaxableItemRow> = {
  status: "SUCCESS",
  message: "Rows fetched successfully",
  data: {
    content: [mockTaxableItemRow],
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

export const singleTaxableItemResponse: ApiResponse<TaxableItemResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockTaxableItem,
};

export const arrayTaxableItemResponse: ApiResponse<TaxableItemResponse[]> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: [mockTaxableItem, mockChildTaxableItem],
};

export const taxableItemTreeResponse: ApiResponse<TaxableItemTreeNode[]> = {
  status: "SUCCESS",
  message: "Tree fetched successfully",
  data: [mockTaxableItemTreeNode],
};

export const taxableItemHandlers = [
  // List
  http.get(`${BASE}/master/taxable-item`, () =>
    HttpResponse.json(pagedTaxableItemResponse),
  ),

  // List rows (for hierarchy table) - must be before :id
  http.get(`${BASE}/master/taxable-item/rows`, () =>
    HttpResponse.json(pagedTaxableItemRowResponse),
  ),

  // Get tree - must be before :id
  http.get(`${BASE}/master/taxable-item/tree`, () =>
    HttpResponse.json(taxableItemTreeResponse),
  ),

  // List parent taxable items - must be before :id and parent/:parentId
  http.get(`${BASE}/master/taxable-item/parent/list`, () =>
    HttpResponse.json(arrayTaxableItemResponse),
  ),

  // Get level 2 children - must be before parent/:parentId
  http.get(`${BASE}/master/taxable-item/parent/:parentId/level2`, () =>
    HttpResponse.json(arrayTaxableItemResponse),
  ),

  // Get level 3 children
  http.get(`${BASE}/master/taxable-item/parent/:parentId/level3`, () =>
    HttpResponse.json(arrayTaxableItemResponse),
  ),

  // Get level 4 children
  http.get(`${BASE}/master/taxable-item/parent/:parentId/level4`, () =>
    HttpResponse.json(arrayTaxableItemResponse),
  ),

  // Get children by parent - must be after level2/3/4
  http.get(`${BASE}/master/taxable-item/parent/:parentId`, () =>
    HttpResponse.json(arrayTaxableItemResponse),
  ),

  // Get by IDs - must be before :id
  http.get(`${BASE}/master/taxable-item/ids`, () =>
    HttpResponse.json(arrayTaxableItemResponse),
  ),

  // Get by ID - catch-all for /master/taxable-item/:id
  http.get(`${BASE}/master/taxable-item/:id`, () =>
    HttpResponse.json(singleTaxableItemResponse),
  ),

  // Create
  http.post(`${BASE}/master/taxable-item`, () =>
    HttpResponse.json(singleTaxableItemResponse, { status: 201 }),
  ),

  // Update
  http.put(`${BASE}/master/taxable-item/:id`, () =>
    HttpResponse.json(singleTaxableItemResponse),
  ),

  // Delete
  http.delete(`${BASE}/master/taxable-item/:id`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    }),
  ),
];
