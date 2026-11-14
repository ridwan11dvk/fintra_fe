import type { FaqResponse } from "@/features/settings/faq/data/faq.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { faqService } from "./faq.service";

// Query Keys
export const faqQueryKeys = {
  all: ["faqs"],
  lists: () => [...faqQueryKeys.all, "list"],
  list: (params?: PaginationParams & { target?: string }) => [
    ...faqQueryKeys.lists(),
    params,
  ],
  details: () => [...faqQueryKeys.all, "detail"],
  detail: (id: number) => [...faqQueryKeys.details(), id],
};

/**
 * Hook to fetch paginated FAQs
 */
export const useListFaqs = (
  params?: PaginationParams & { target?: string },
  options?: Omit<
    UseQueryOptions<PagedApiResponse<FaqResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: faqQueryKeys.list(params),
    queryFn: () => faqService.listFaqs(params),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(axiosError?.response?.data?.message || "Failed to load FAQs");
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific FAQ by ID
 */
export const useGetFaqById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<FaqResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: faqQueryKeys.detail(id),
    queryFn: () => faqService.getFaqById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(axiosError?.response?.data?.message || "Failed to load FAQ");
    }
  }, [query.isError, query.error]);

  return query;
};
