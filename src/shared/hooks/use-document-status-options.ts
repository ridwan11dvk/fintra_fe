import { DOCUMENT_STATUS_OPTIONS } from "@/shared/constants/document-status.constant";
import { useAuth } from "@railfinance/core";
import { useMemo } from "react";

interface UseDocumentStatusOptionsProps {
  permission: string;
}

/**
 * Custom hook to get document status options filtered by user permission
 * - Unit (with create permission): Shows all statuses including DRAFT
 * - Manager (without create permission): Hides DRAFT status
 *
 * @param permission - The permission key to check (e.g., "tax:procurement:import:create")
 * @returns Filtered status options based on user role
 */
export function useDocumentStatusOptions({
  permission,
}: UseDocumentStatusOptionsProps) {
  const { can } = useAuth();

  return useMemo(() => {
    // If user has create permission (Unit role), show all statuses
    // Otherwise (Manager role), filter out DRAFT status
    return can(permission)
      ? DOCUMENT_STATUS_OPTIONS
      : DOCUMENT_STATUS_OPTIONS.filter((opt) => opt.value !== "DRAFT");
  }, [can, permission]);
}
