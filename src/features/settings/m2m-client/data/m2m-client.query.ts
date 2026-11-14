import type { PaginationParams } from "@railfinance/core/types";
import { useQuery } from "@tanstack/react-query";
import { m2mClientService } from "./m2m-client.service";

export const m2mClientQueryKeys = {
  all: ["m2m-clients"] as const,
  lists: () => [...m2mClientQueryKeys.all, "list"] as const,
  list: (params: PaginationParams) =>
    [...m2mClientQueryKeys.lists(), params] as const,
  details: () => [...m2mClientQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...m2mClientQueryKeys.details(), id] as const,
  audit: (id: number) => [...m2mClientQueryKeys.all, "audit", id] as const,
  allPermissions: ["m2m-clients", "all-permissions"] as const,
};

export function useM2mClients(params: PaginationParams) {
  return useQuery({
    queryKey: m2mClientQueryKeys.list(params),
    queryFn: () => m2mClientService.getClients(params),
    enabled: params.enabled ?? true,
  });
}

export function useM2mClient(id: number) {
  return useQuery({
    queryKey: m2mClientQueryKeys.detail(id),
    queryFn: () => m2mClientService.getClientById(id),
    enabled: !!id,
  });
}

export function useM2mClientAudit(id: number, page = 0, size = 20) {
  return useQuery({
    queryKey: m2mClientQueryKeys.audit(id),
    queryFn: () => m2mClientService.getAuditLog(id, { page, size }),
    enabled: !!id,
  });
}
