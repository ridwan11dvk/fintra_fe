import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";
import type { BannerRequest, BannerResponse } from "./banner.types";

const BANNER_BASE_URL = "/setting/banner";

/**
 * Builds the multipart form data for create/update requests:
 * regular form fields + optional `image` file part (matches the backend
 * @ModelAttribute BannerMultipartRequestDTO binding).
 */
export function buildBannerFormData(
  data: BannerRequest,
  image?: File | null,
): FormData {
  const formData = new FormData();
  formData.append("target", data.target);
  formData.append("title", data.title);
  formData.append("titleEn", data.titleEn ?? "");
  formData.append("subtitle", data.subtitle ?? "");
  formData.append("subtitleEn", data.subtitleEn ?? "");
  formData.append("description", data.description ?? "");
  formData.append("descriptionEn", data.descriptionEn ?? "");
  formData.append("startDate", data.startDate);
  formData.append("endDate", data.endDate ?? "");
  formData.append("sortOrder", String(data.sortOrder));
  if (image) {
    formData.append("image", image);
  }
  return formData;
}

export const bannerService = {
  /**
   * Get all banners with pagination and optional search/target filters
   */
  listBanners: async (
    params?: PaginationParams & { target?: string },
  ): Promise<PagedApiResponse<BannerResponse>> => {
    const response = await axiosInstance.get<PagedApiResponse<BannerResponse>>(
      BANNER_BASE_URL,
      { params },
    );
    return response.data;
  },

  /**
   * Get banner by ID
   */
  getBannerById: async (id: number): Promise<ApiResponse<BannerResponse>> => {
    const response = await axiosInstance.get<ApiResponse<BannerResponse>>(
      `${BANNER_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Create a new banner (multipart/form-data with optional image)
   */
  createBanner: async (
    data: BannerRequest,
    image?: File | null,
  ): Promise<ApiResponse<BannerResponse>> => {
    const formData = buildBannerFormData(data, image);
    const response = await axiosInstance.post<ApiResponse<BannerResponse>>(
      BANNER_BASE_URL,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  /**
   * Update a banner (multipart/form-data; removeImage clears the existing image)
   */
  updateBanner: async (
    id: number,
    data: BannerRequest,
    image?: File | null,
    removeImage?: boolean,
  ): Promise<ApiResponse<BannerResponse>> => {
    const formData = buildBannerFormData(data, image);
    const params = removeImage ? "?removeImage=true" : "";
    const response = await axiosInstance.put<ApiResponse<BannerResponse>>(
      `${BANNER_BASE_URL}/${id}${params}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  /**
   * Delete a banner
   */
  deleteBanner: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${BANNER_BASE_URL}/${id}`,
    );
    return response.data;
  },
};
