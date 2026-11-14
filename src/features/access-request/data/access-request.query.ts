/**
 * Access Request Feature - TanStack Query Hooks
 * Query hooks for data fetching and caching
 */

import type { PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { accessRequestQueryKeys } from "@railfinance/core/access-request";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { accessRequestService } from "./access-request.service";
import type { AccessRequestDetailResponse } from "./access-request.types";

/**
 * Hook to fetch paginated list of access requests
 * Used in admin dashboard
 */
export const useListAccessRequests = (
  params?: PaginationParams,
  options?: UseQueryOptions<PagedApiResponse<AccessRequestDetailResponse>>,
) => {
  return useQuery({
    queryKey: accessRequestQueryKeys.list(params),
    queryFn: () => accessRequestService.listAccessRequests(params),
    ...options,
  });
};

/**
 * Hook to fetch single access request details
 * Used in request detail modal
 */
export const useGetAccessRequestById = (
  requestId: number | null,
  options?: UseQueryOptions<AccessRequestDetailResponse>,
) => {
  return useQuery({
    queryKey: accessRequestQueryKeys.detail(requestId ?? 0),
    queryFn: () => accessRequestService.getAccessRequestById(requestId!),
    enabled: requestId !== null && requestId !== undefined,
    ...options,
  });
};
