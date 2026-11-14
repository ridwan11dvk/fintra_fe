import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";
import type {
  TaxableItemImportResponse,
  TaxableItemRequest,
  TaxableItemResponse,
  TaxableItemRow,
  TaxableItemTreeNode,
} from "./taxable-item.types";

const TAXABLE_ITEM_BASE_URL = "/master/taxable-item";

export const taxableItemService = {
  /**
   * Get all taxable items with pagination
   */
  listTaxableItems: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<TaxableItemResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<TaxableItemResponse>
    >(TAXABLE_ITEM_BASE_URL, {
      params,
    });
    return response.data;
  },

  /**
   * Get child taxable items by parent ID
   */
  getTaxableItemsByParent: async (
    parentId: number,
  ): Promise<ApiResponse<TaxableItemResponse[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<TaxableItemResponse[]>
    >(`${TAXABLE_ITEM_BASE_URL}/parent/${parentId}`);
    return response.data;
  },

  /**
   * Get taxable item by ID
   */
  getTaxableItemById: async (
    id: number,
  ): Promise<ApiResponse<TaxableItemResponse>> => {
    const response = await axiosInstance.get<ApiResponse<TaxableItemResponse>>(
      `${TAXABLE_ITEM_BASE_URL}/${id}`,
    );
    return response.data;
  },

  /**
   * Create a new taxable item
   */
  createTaxableItem: async (
    data: TaxableItemRequest,
  ): Promise<ApiResponse<TaxableItemResponse>> => {
    const response = await axiosInstance.post<ApiResponse<TaxableItemResponse>>(
      TAXABLE_ITEM_BASE_URL,
      data,
    );
    return response.data;
  },

  /**
   * Update an existing taxable item
   */
  updateTaxableItem: async (
    id: number,
    data: TaxableItemRequest,
  ): Promise<ApiResponse<TaxableItemResponse>> => {
    const response = await axiosInstance.put<ApiResponse<TaxableItemResponse>>(
      `${TAXABLE_ITEM_BASE_URL}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete a taxable item
   */
  deleteTaxableItem: async (id: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `${TAXABLE_ITEM_BASE_URL}/${id}`,
    );
    return response.data;
  },

  // --- HEAD Methods ---

  /**
   * Get flat rows (level-4 leaves with full ancestor chain) for hierarchy table UI
   */
  listTaxableItemRows: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<TaxableItemRow>> => {
    const response = await axiosInstance.get<PagedApiResponse<TaxableItemRow>>(
      `${TAXABLE_ITEM_BASE_URL}/rows`,
      { params },
    );
    return response.data;
  },

  /**
   * Get taxable item tree structure
   */
  getTaxableItemTree: async (): Promise<ApiResponse<TaxableItemTreeNode[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<TaxableItemTreeNode[]>
    >(`${TAXABLE_ITEM_BASE_URL}/tree`);
    return response.data;
  },

  /**
   * Get level-2 child items for a given level-1 parent
   */
  getTaxableItemsByLevel2: async (
    parentId: number,
  ): Promise<ApiResponse<TaxableItemResponse[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<TaxableItemResponse[]>
    >(`${TAXABLE_ITEM_BASE_URL}/parent/${parentId}/level2`);
    return response.data;
  },

  /**
   * Get level-3 child items for a given level-2 parent
   */
  getTaxableItemsByLevel3: async (
    parentId: number,
  ): Promise<ApiResponse<TaxableItemResponse[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<TaxableItemResponse[]>
    >(`${TAXABLE_ITEM_BASE_URL}/parent/${parentId}/level3`);
    return response.data;
  },

  /**
   * Get level-4 leaf items for a given level-3 parent
   */
  getTaxableItemsByLevel4: async (
    parentId: number,
  ): Promise<ApiResponse<TaxableItemResponse[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<TaxableItemResponse[]>
    >(`${TAXABLE_ITEM_BASE_URL}/parent/${parentId}/level4`);
    return response.data;
  },

  /**
   * Get all level 1 taxable items without pagination (Dropdown Level 1)
   */
  listParentTaxableItems: async (
    search?: string,
  ): Promise<ApiResponse<TaxableItemResponse[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<TaxableItemResponse[]>
    >(`${TAXABLE_ITEM_BASE_URL}/parent/list`, {
      params: { search },
    });
    return response.data;
  },

  /**
   * Get taxable items by a collection of IDs
   */
  getByIds: async (
    ids: number[],
  ): Promise<ApiResponse<TaxableItemResponse[]>> => {
    const response = await axiosInstance.get<
      ApiResponse<TaxableItemResponse[]>
    >(`${TAXABLE_ITEM_BASE_URL}/ids`, {
      params: { ids: ids.join(",") },
    });
    return response.data;
  },

  /**
   * Export taxable items to Excel
   */
  exportTaxableItems: async (search?: string): Promise<Blob> => {
    const response = await axiosInstance.get<Blob>(
      `${TAXABLE_ITEM_BASE_URL}/export`,
      {
        params: search ? { search } : undefined,
        responseType: "blob",
      },
    );
    return response.data;
  },

  /**
   * Download taxable item import template
   */
  downloadImportTemplate: async (): Promise<Blob> => {
    const response = await axiosInstance.get<Blob>(
      `${TAXABLE_ITEM_BASE_URL}/import/template`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  },

  /**
   * Import taxable items from Excel file
   */
  importTaxableItems: async (
    file: File,
    dryRun?: boolean,
  ): Promise<ApiResponse<TaxableItemImportResponse>> => {
    const formData = new FormData();
    formData.append("file", file);
    if (dryRun !== undefined) {
      formData.append("dryRun", String(dryRun));
    }

    const response = await axiosInstance.post<
      ApiResponse<TaxableItemImportResponse>
    >(`${TAXABLE_ITEM_BASE_URL}/import`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Import taxable items from Excel file
   */
  convertHierarchicalTaxableItems: async (file: File): Promise<Blob> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post<Blob>(
      `${TAXABLE_ITEM_BASE_URL}/convert-hierarchical`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      },
    );
    return response.data;
  },
};
