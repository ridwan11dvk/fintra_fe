import type {
  CompanyImportResponse,
  CompanyResponse,
} from "@/features/master-data/company/data/company.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockCompany: CompanyResponse = {
  id: 1,
  code: "COMP001",
  name: "PT Mitra Utama Indonesia",
  address: "Jl. Sudirman 123, Jakarta",
  logoFile: "logo.png",
  headerDocFile: "header.pdf",
  footerDocFile: "footer.pdf",
  files: [],
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const pagedCompanyResponse: PagedApiResponse<CompanyResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: {
    content: [mockCompany],
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

export const singleCompanyResponse: ApiResponse<CompanyResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockCompany,
};

export const companyHandlers = [
  // List companies
  http.get(`${BASE}/master/company/options`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      data: [{ value: 1, label: "PT ABC", description: "Company ABC" }],
    }),
  ),

  http.get(`${BASE}/master/company`, () => {
    return HttpResponse.json(pagedCompanyResponse);
  }),

  // Get company by ID
  http.get(`${BASE}/master/company/:id`, () => {
    return HttpResponse.json(singleCompanyResponse);
  }),

  // Create company
  http.post(`${BASE}/master/company`, () => {
    return HttpResponse.json(singleCompanyResponse, { status: 201 });
  }),

  // Update company
  http.put(`${BASE}/master/company/:id`, () => {
    return HttpResponse.json(singleCompanyResponse);
  }),

  // Delete company
  http.delete(`${BASE}/master/company/:id`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Data deleted successfully",
    });
  }),

  // Upload company file
  http.post(`${BASE}/master/company/:companyId/file`, () => {
    return HttpResponse.json(singleCompanyResponse, { status: 201 });
  }),

  // Update company file
  http.put(`${BASE}/master/company/:companyId/file/:fileId`, () => {
    return HttpResponse.json(singleCompanyResponse);
  }),

  // Delete company file
  http.delete(`${BASE}/master/company/:companyId/file/:fileId`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "File deleted successfully",
    });
  }),

  // Get logo presigned URL
  http.get(`${BASE}/master/company/:id/logo-url`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "URL retrieved successfully",
      data: "https://s3.example.com/logo.png",
    } as ApiResponse<string>);
  }),

  // Get header presigned URL
  http.get(`${BASE}/master/company/:id/header-url`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "URL retrieved successfully",
      data: "https://s3.example.com/header.pdf",
    } as ApiResponse<string>);
  }),

  // Get footer presigned URL
  http.get(`${BASE}/master/company/:id/footer-url`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "URL retrieved successfully",
      data: "https://s3.example.com/footer.pdf",
    } as ApiResponse<string>);
  }),

  // Get company file presigned URL
  http.get(`${BASE}/master/company/:companyId/file/:fileId/preview-url`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "URL retrieved successfully",
      data: "https://s3.example.com/company-file.pdf",
    } as ApiResponse<string>);
  }),

  // Export companies (returns blob)
  http.get(`${BASE}/master/company/export`, () => {
    return new HttpResponse(
      new Blob(["excel-data"], { type: "application/vnd.ms-excel" }),
      {
        headers: { "Content-Type": "application/vnd.ms-excel" },
      },
    );
  }),

  // Download import template (returns blob)
  http.get(`${BASE}/master/company/import/template`, () => {
    return new HttpResponse(
      new Blob(["template-data"], { type: "application/vnd.ms-excel" }),
      {
        headers: { "Content-Type": "application/vnd.ms-excel" },
      },
    );
  }),

  // Import companies
  http.post(`${BASE}/master/company/import`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "Import successful",
      data: {
        summary: {
          totalRows: 5,
          validRows: 5,
          invalidRows: 0,
          createdRows: 5,
          updatedRows: 0,
          skippedRows: 0,
          dryRun: false,
        },
        rowErrors: [],
        errorReport: {
          fileName: "import.xlsx",
          contentType: "application/vnd.ms-excel",
          base64Content: "",
        },
      },
    } as unknown as ApiResponse<CompanyImportResponse>);
  }),
];
