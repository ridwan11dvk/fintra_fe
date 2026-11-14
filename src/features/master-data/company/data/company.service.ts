import type {
  CompanyFileRequest,
  CompanyRequest,
  CompanyResponse,
} from "@/features/master-data/company/data/company.types";
import type { ApiResponse, ImportResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance, objectToFormData } from "@railfinance/core/lib";

const COMPANY_BASE_URL = "/master/company";

export const companyService = {
  /**
   * Get all companies with pagination
   */
  listCompanies: async (
    params?: PaginationParams & { keyword?: string; isActive?: boolean },
  ): Promise<PagedApiResponse<CompanyResponse>> => {
    const response = await axiosInstance.get<PagedApiResponse<CompanyResponse>>(
      COMPANY_BASE_URL,
      {
        params,
      },
    );
    return response.data;
  },

  /**
   * Get company by ID with all associated files
   */
  getCompanyById: async (id: number): Promise<ApiResponse<CompanyResponse>> => {
    const response = await axiosInstance.get<ApiResponse<CompanyResponse>>(
      `${COMPANY_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Create a new company with optional file uploads
   */
  createCompany: async (
    data: CompanyRequest & { files?: File[]; fileAliases?: string },
  ): Promise<ApiResponse<CompanyResponse>> => {
    const formData = new FormData();
    formData.append("code", data.code);
    formData.append("name", data.name);
    if (data.alias) formData.append("alias", data.alias);
    if (data.npwp) formData.append("npwp", data.npwp);
    if (data.pgMerchantId) formData.append("pgMerchantId", data.pgMerchantId);
    if (data.city) formData.append("city", data.city);
    if (data.address) formData.append("address", data.address);
    if (data.businessType) formData.append("businessType", data.businessType);
    if (data.moduleIds && data.moduleIds.length > 0) {
      formData.append("moduleIds", data.moduleIds.join(","));
    }
    formData.append("isActive", String(data.isActive));
    formData.append(
      "companyFilesJson",
      JSON.stringify(data.companyFiles || []),
    );

    // Add files if provided
    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    // Add file aliases mapping if provided
    if (data.fileAliases) {
      formData.append("fileAliases", data.fileAliases);
    }

    const response = await axiosInstance.post<ApiResponse<CompanyResponse>>(
      COMPANY_BASE_URL,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  /**
   * Update company information and optionally replace logo, header, or footer files
   */
  updateCompany: async (
    id: number,
    data: Partial<CompanyRequest> & {
      logoFile?: File;
      headerDocFile?: File;
      footerDocFile?: File;
    },
  ): Promise<ApiResponse<CompanyResponse>> => {
    const formData = new FormData();

    if (data.code) formData.append("code", data.code);
    if (data.name) formData.append("name", data.name);
    if (data.alias) formData.append("alias", data.alias);
    if (data.npwp) formData.append("npwp", data.npwp);
    if (data.pgMerchantId) formData.append("pgMerchantId", data.pgMerchantId);
    if (data.city) formData.append("city", data.city);
    if (data.address) formData.append("address", data.address);
    if (data.businessType) formData.append("businessType", data.businessType);
    if (data.moduleIds) {
      // Always send moduleIds when present (even empty array clears modules)
      formData.append("moduleIds", data.moduleIds.join(","));
    }
    if (data.isActive !== undefined)
      formData.append("isActive", String(data.isActive));

    // Add optional files
    if (data.logoFile) formData.append("logoFile", data.logoFile);
    if (data.headerDocFile)
      formData.append("headerDocFile", data.headerDocFile);
    if (data.footerDocFile)
      formData.append("footerDocFile", data.footerDocFile);

    const response = await axiosInstance.put<ApiResponse<CompanyResponse>>(
      `${COMPANY_BASE_URL}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  /**
   * Delete company
   */
  deleteCompany: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${COMPANY_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Upload a new file to company
   */
  uploadCompanyFile: async (
    data: CompanyFileRequest,
  ): Promise<ApiResponse<CompanyResponse>> => {
    const formData = objectToFormData(data); // Convert the data object to FormData

    const response = await axiosInstance.post<ApiResponse<CompanyResponse>>(
      `${COMPANY_BASE_URL}/${data.companyId}/file`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  /**
   * Update company file metadata and optionally replace file content
   */
  updateCompanyFile: async (
    companyId: number,
    fileId: number,
    data: CompanyFileRequest,
  ): Promise<ApiResponse<CompanyResponse>> => {
    const formData = objectToFormData(data); // Convert the data object to FormData

    const response = await axiosInstance.put<ApiResponse<CompanyResponse>>(
      `${COMPANY_BASE_URL}/${companyId}/file/${fileId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  /**
   * Delete company file
   */
  deleteCompanyFile: async (
    companyId: number,
    fileId: number,
  ): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${COMPANY_BASE_URL}/${companyId}/file/${fileId}`,
    );
    return response.data;
  },

  /**
   * Get presigned URL for logo
   */
  getLogoPresignedUrl: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.get<ApiResponse<string>>(
      `${COMPANY_BASE_URL}/${id}/logo-url`,
    );
    return response.data;
  },

  /**
   * Get presigned URL for header document
   */
  getHeaderPresignedUrl: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.get<ApiResponse<string>>(
      `${COMPANY_BASE_URL}/${id}/header-url`,
    );
    return response.data;
  },

  /**
   * Get presigned URL for footer document
   */
  getFooterPresignedUrl: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.get<ApiResponse<string>>(
      `${COMPANY_BASE_URL}/${id}/footer-url`,
    );
    return response.data;
  },

  /**
   * Get presigned URL for company file
   */
  getCompanyFilePresignedUrl: async (
    companyId: number,
    fileId: number,
  ): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.get<ApiResponse<string>>(
      `${COMPANY_BASE_URL}/${companyId}/file/${fileId}/preview-url`,
    );
    return response.data;
  },

  /**
   * Export companies to Excel
   */
  exportCompanies: async (search?: string): Promise<Blob> => {
    const response = await axiosInstance.get<Blob>(
      `${COMPANY_BASE_URL}/export`,
      {
        params: search ? { search } : undefined,
        responseType: "blob",
      },
    );
    return response.data;
  },

  /**
   * Download company import template
   */
  downloadImportTemplate: async (): Promise<Blob> => {
    const response = await axiosInstance.get<Blob>(
      `${COMPANY_BASE_URL}/import/template`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  },

  /**
   * Import companies from Excel file
   */
  importCompanies: async (
    file: File,
    dryRun?: boolean,
  ): Promise<ApiResponse<ImportResponse>> => {
    const formData = new FormData();
    formData.append("file", file);
    if (dryRun !== undefined) {
      formData.append("dryRun", String(dryRun));
    }

    const response = await axiosInstance.post<ApiResponse<ImportResponse>>(
      `${COMPANY_BASE_URL}/import`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
};
