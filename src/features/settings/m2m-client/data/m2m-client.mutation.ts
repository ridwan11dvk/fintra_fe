import { toast } from "@railfinance/core/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { m2mClientQueryKeys } from "./m2m-client.query";
import { m2mClientService } from "./m2m-client.service";
import type {
  M2mClientPermissionRequest,
  M2mClientRequest,
  M2mClientUpdateRequest,
} from "./m2m-client.types";

export function useCreateM2mClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (client: M2mClientRequest) =>
      m2mClientService.createClient(client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: m2mClientQueryKeys.all });
      toast.success("API Client created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create API Client");
    },
  });
}

export function useUpdateM2mClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      client,
    }: {
      id: number;
      client: M2mClientUpdateRequest;
    }) => m2mClientService.updateClient(id, client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: m2mClientQueryKeys.all });
      toast.success("API Client updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update API Client");
    },
  });
}

export function useDeleteM2mClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => m2mClientService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: m2mClientQueryKeys.all });
      toast.success("API Client deactivated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to deactivate API Client");
    },
  });
}

export function useRegenerateM2mToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => m2mClientService.regenerateToken(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: m2mClientQueryKeys.all });
      toast.success("Token regenerated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to regenerate token");
    },
  });
}

export function useUpdateM2mPermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      permissions,
    }: {
      id: number;
      permissions: M2mClientPermissionRequest;
    }) => m2mClientService.updatePermissions(id, permissions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: m2mClientQueryKeys.all });
      toast.success("Permissions updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update permissions");
    },
  });
}
