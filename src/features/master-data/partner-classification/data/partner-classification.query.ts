import type { PartnerClassificationResponse } from "@/features/master-data/partner-classification/data/partner-classification.types";
import type { ApiResponse, OptionItemResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { useHandleQueryResponse } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { partnerClassificationService } from "./partner-classification.service";

// Query Keys
export const partnerClassificationQueryKeys = {
  all: ["partner-classifications"],
  lists: () => [...partnerClassificationQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [
    ...partnerClassificationQueryKeys.lists(),
    params,
  ],
  details: () => [...partnerClassificationQueryKeys.all, "detail"],
  detail: (id: number) => [...partnerClassificationQueryKeys.details(), id],
  options: () => [...partnerClassificationQueryKeys.all, "options"],
};

/**
 * Hook to fetch paginated partner classifications
 */
export const useListPartnerClassifications = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<PartnerClassificationResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerClassificationQueryKeys.list(params),
    queryFn: () =>
      partnerClassificationService.listPartnerClassifications(params),
    ...options,
  });

  useHandleQueryResponse(query);

  return query;
};

/**
 * Hook to fetch a specific partner classification by ID
 */
export const useGetPartnerClassificationById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<PartnerClassificationResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerClassificationQueryKeys.detail(id),
    queryFn: () =>
      partnerClassificationService.getPartnerClassificationById(id),
    ...options,
  });

  useHandleQueryResponse(query);

  return query;
};

/**
 * Hook to fetch partner classification options for dropdowns
 */
export const useGetPartnerClassificationOptions = (
  options?: Omit<
    UseQueryOptions<OptionItemResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerClassificationQueryKeys.options(),
    queryFn: () =>
      partnerClassificationService.getPartnerClassificationOptions(),
    ...options,
  });

  useHandleQueryResponse(query);

  return query;
};
