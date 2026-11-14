import type {
  ApiResponse,
  PagedApiResponse,
  PaginationParams,
} from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { documentNameService } from "./document-name.service";
import type { DocumentNameResponse } from "./document-name.types";

export const documentNameQueryKeys = {
  all: ["documentNames"],
  lists: () => [...documentNameQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [
    ...documentNameQueryKeys.lists(),
    params,
  ],
  details: () => [...documentNameQueryKeys.all, "detail"],
  detail: (id: number) => [...documentNameQueryKeys.details(), id],
};

export const useListDocumentNames = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<DocumentNameResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: documentNameQueryKeys.list(params),
    queryFn: () => documentNameService.listDocumentNames(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Document names loaded successfully",
        );
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message ||
          "Failed to load document names",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

export const useGetDocumentNameById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<DocumentNameResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: documentNameQueryKeys.detail(id),
    queryFn: () => documentNameService.getDocumentNameById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Document name loaded successfully",
        );
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load document name",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
