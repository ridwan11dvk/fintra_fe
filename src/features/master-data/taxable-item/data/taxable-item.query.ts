import type {
  TaxableItemResponse,
  TaxableItemRow,
} from "@/features/master-data";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { taxableItemService } from "./taxable-item.service";

// Query Keys
export const taxableItemQueryKeys = {
  all: ["taxableItems"],
  lists: () => [...taxableItemQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [
    ...taxableItemQueryKeys.lists(),
    params,
  ],
  rows: (params?: PaginationParams) => [
    ...taxableItemQueryKeys.all,
    "rows",
    params,
  ],
  details: () => [...taxableItemQueryKeys.all, "detail"],
  detail: (id: number) => [...taxableItemQueryKeys.details(), id],
  children: () => [...taxableItemQueryKeys.all, "children"],
  childrenByParent: (parentId: number) => [
    ...taxableItemQueryKeys.children(),
    parentId,
  ],
  parents: (search?: string) => [
    ...taxableItemQueryKeys.all,
    "parents",
    search,
  ],
};

// Also export the old name for backwards compatibility with HEAD
export const taxableItemKeys = taxableItemQueryKeys;

/**
 * Hook to fetch paginated taxable items
 */
export const useListTaxableItems = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<TaxableItemResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: taxableItemQueryKeys.list(params),
    queryFn: () => taxableItemService.listTaxableItems(params),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load taxable items",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific taxable item by ID
 */
export const useTaxableItemById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<TaxableItemResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: taxableItemQueryKeys.detail(id),
    queryFn: () => taxableItemService.getTaxableItemById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load taxable item",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

export const useGetTaxableItemById = useTaxableItemById;

/**
 * Hook to fetch child taxable items by parent ID
 */
export const useTaxableItemsByParent = (
  parentId: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<TaxableItemResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: taxableItemQueryKeys.childrenByParent(parentId),
    queryFn: () => taxableItemService.getTaxableItemsByParent(parentId),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message ||
          "Failed to load taxable item children",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

export const useListChildrenByParentId = (parentId?: number) => {
  return useQuery({
    queryKey: taxableItemQueryKeys.childrenByParent(parentId!),
    queryFn: () => taxableItemService.getTaxableItemsByParent(parentId!),
    enabled: !!parentId,
  });
};

/**
 * Hook for level 1 dropdown (Alt/Simple list)
 */
export const useListParentTaxableItems = (search?: string) => {
  return useQuery({
    queryKey: taxableItemQueryKeys.parents(search),
    queryFn: () => taxableItemService.listParentTaxableItems(search),
  });
};

/**
 * Hook to fetch paginated flat rows for the hierarchy table UI
 */
export const useListTaxableItemRows = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<TaxableItemRow>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: taxableItemQueryKeys.rows(params),
    queryFn: () => taxableItemService.listTaxableItemRows(params),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message ||
          "Failed to load taxable item rows",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
