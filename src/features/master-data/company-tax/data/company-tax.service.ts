import type {
  CompanyTaxRequest,
  CompanyTaxResponse,
} from "@/features/master-data/company-tax/data/company-tax.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";

const COMPANY_TAX_BASE_URL = "/master/company-tax";

export const companyTaxService = {
  listCompanyTaxes: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<CompanyTaxResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<CompanyTaxResponse>
    >(COMPANY_TAX_BASE_URL, { params });
    return response.data;
  },

  getCompanyTaxById: async (
    id: number,
  ): Promise<ApiResponse<CompanyTaxResponse>> => {
    const response = await axiosInstance.get<ApiResponse<CompanyTaxResponse>>(
      `${COMPANY_TAX_BASE_URL}/${id}`,
    );
    return response.data;
  },

  createCompanyTax: async (
    data: CompanyTaxRequest,
  ): Promise<ApiResponse<CompanyTaxResponse>> => {
    const response = await axiosInstance.post<ApiResponse<CompanyTaxResponse>>(
      COMPANY_TAX_BASE_URL,
      data,
    );
    return response.data;
  },

  updateCompanyTax: async (
    id: number,
    data: CompanyTaxRequest,
  ): Promise<ApiResponse<CompanyTaxResponse>> => {
    const response = await axiosInstance.put<ApiResponse<CompanyTaxResponse>>(
      `${COMPANY_TAX_BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  deleteCompanyTax: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${COMPANY_TAX_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
