/**
 * Digital Vault TanStack Query Hooks
 * Server state management for Digital Vault data
 */

import type { ApiResponse, InputValue, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { useHandleQueryResponse } from "@railfinance/core/lib";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { digitalVaultService } from "./digital-vault.service";
import type {
  VaultStationClosureDetail,
  VaultStationSummary,
  VaultStationSummaryTotal,
  VaultTransactionDetail,
} from "./digital-vault.types";

// ============================================================================
// QUERY KEY FACTORY
// ============================================================================

export const digitalVaultQueryKeys = {
  all: ["digitalVault"],
  stationSummary: () => [...digitalVaultQueryKeys.all, "stationSummary"],
  stationSummaryList: () => [...digitalVaultQueryKeys.stationSummary(), "list"],
  stationSummaryTotal: () => [
    ...digitalVaultQueryKeys.stationSummary(),
    "total",
  ],
  closureDetail: () => [...digitalVaultQueryKeys.all, "closureDetail"],
  closureDetailList: (stationName: string) => [
    ...digitalVaultQueryKeys.closureDetail(),
    stationName,
  ],
  transactionDetail: () => [...digitalVaultQueryKeys.all, "transactionDetail"],
  transactionDetailById: (id: number) => [
    ...digitalVaultQueryKeys.transactionDetail(),
    id,
  ],
  exportTransactionDetail: (id: number) => [
    ...digitalVaultQueryKeys.transactionDetail(),
    "export",
    id,
  ],
};

// ============================================================================
// STATION SUMMARY HOOKS
// ============================================================================

/**
 * Fetch paginated station summary list with optional filtering
 */
export function useStationSummaryList(
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<VaultStationSummary>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: digitalVaultQueryKeys.stationSummaryList(),
    queryFn: () => digitalVaultService.listStationSummary(params),
    ...options,
  });
}

/**
 * Fetch aggregated total summary across all stations
 */
export function useStationSummaryTotal(
  params?: Record<string, InputValue>,
  options?: Omit<
    UseQueryOptions<ApiResponse<VaultStationSummaryTotal>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  const query = useQuery({
    queryKey: [...digitalVaultQueryKeys.stationSummaryTotal(), params],
    queryFn: () => digitalVaultService.totalStationSummary(params),
    ...options,
  });
  useHandleQueryResponse(query);
  return query;
}

// ============================================================================
// CLOSURE DETAIL HOOKS
// ============================================================================

/**
 * Fetch paginated closure detail list for a specific station
 */
export function useClosureDetailList(
  stationName: string,
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<VaultStationClosureDetail>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: digitalVaultQueryKeys.closureDetailList(stationName),
    queryFn: () => digitalVaultService.listClosureDetail(stationName, params),
    enabled: !!stationName, // Only fetch if stationName is provided
    ...options,
  });
}

// ============================================================================
// TRANSACTION DETAIL HOOKS
// ============================================================================

/**
 * Fetch transaction detail (closure with all deposit items) by payment header ID
 */
export function useTransactionDetail(
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<VaultTransactionDetail>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: digitalVaultQueryKeys.transactionDetailById(id),
    queryFn: () => digitalVaultService.getTransactionDetail(id),
    enabled: !!id && id !== 0, // Only fetch if id is provided
    ...options,
  });
}
