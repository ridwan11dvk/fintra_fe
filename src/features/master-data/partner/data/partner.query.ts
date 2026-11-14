import type {
  Partner,
  PartnerBankAccount,
  PartnerContact,
  PartnerDocReference,
  PartnerDocument,
  PartnerErpCode,
  PartnerKbli,
  PartnerLegality,
  PartnerRole,
  PartnerTaxProfile,
  PartnerTaxRate,
  PartnerVirtualAccount,
} from "@/features/master-data/partner/data/partner.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { useHandleQueryResponse } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { partnerService } from "./partner.service";

// Query Keys
export const partnerQueryKeys = {
  all: ["partners"],
  lists: () => [...partnerQueryKeys.all, "list"],
  list: (params?: PaginationParams & { search?: string; status?: string }) => [
    ...partnerQueryKeys.lists(),
    params,
  ],
  details: () => [...partnerQueryKeys.all, "detail"],
  detail: (id: number) => [...partnerQueryKeys.details(), id],

  // Documents
  documents: (partnerId: number) => [
    ...partnerQueryKeys.all,
    "documents",
    partnerId,
  ],
  documentList: (
    partnerId: number,
    params?: PaginationParams & { search?: string },
  ) => [...partnerQueryKeys.documents(partnerId), params],

  // Contacts (replaces branches/correspondents)
  contacts: (partnerId: number) => [
    ...partnerQueryKeys.all,
    "contacts",
    partnerId,
  ],
  contactList: (
    partnerId: number,
    params?: PaginationParams & { search?: string },
  ) => [...partnerQueryKeys.contacts(partnerId), params],

  // Roles
  roles: (partnerId: number) => [...partnerQueryKeys.all, "roles", partnerId],
  roleList: (
    partnerId: number,
    params?: PaginationParams & { search?: string },
  ) => [...partnerQueryKeys.roles(partnerId), params],

  // KBLI entries
  kblis: (partnerId: number) => [...partnerQueryKeys.all, "kblis", partnerId],
  kbliList: (
    partnerId: number,
    params?: PaginationParams & { search?: string },
  ) => [...partnerQueryKeys.kblis(partnerId), params],

  // Legality + deed amendments (1:1)
  legality: (partnerId: number) => [
    ...partnerQueryKeys.all,
    "legality",
    partnerId,
  ],
  deedAmendments: (partnerId: number) => [
    ...partnerQueryKeys.legality(partnerId),
    "deed-amendments",
  ],

  // Tax profile (1:1)
  taxProfile: (partnerId: number) => [
    ...partnerQueryKeys.all,
    "taxProfile",
    partnerId,
  ],

  // Taxes (tax rate associations, kept path /tax)
  taxes: (partnerId: number) => [...partnerQueryKeys.all, "taxes", partnerId],
  taxList: (
    partnerId: number,
    params?: PaginationParams & { search?: string },
  ) => [...partnerQueryKeys.taxes(partnerId), params],

  docRef: (
    companyCode: string | undefined,
    countryId?: number,
    partnerCategoryId?: number,
    partnerTypeId?: number,
    partnerSubTypeId?: number,
    partnerLegalityId?: number,
    partnerRoleId?: number,
  ) => [
    ...partnerQueryKeys.all,
    "docReferences",
    companyCode,
    countryId,
    partnerCategoryId,
    partnerTypeId,
    partnerSubTypeId,
    partnerLegalityId,
    partnerRoleId,
  ],

  // Bank accounts
  bankAccounts: (partnerId: number) => [
    ...partnerQueryKeys.all,
    "bankAccounts",
    partnerId,
  ],
  bankAccountList: (
    partnerId: number,
    params?: PaginationParams & {
      search?: string;
      companyCode?: string;
      active?: boolean;
    },
  ) => [...partnerQueryKeys.bankAccounts(partnerId), params],

  // Virtual accounts
  virtualAccounts: (partnerId: number) => [
    ...partnerQueryKeys.all,
    "virtualAccounts",
    partnerId,
  ],
  virtualAccountList: (
    partnerId: number,
    params?: PaginationParams & {
      search?: string;
      bankCode?: string;
      companyCode?: string;
      active?: boolean;
    },
  ) => [...partnerQueryKeys.virtualAccounts(partnerId), params],

  // ERP Codes
  erpCodes: (partnerId: number) => [
    ...partnerQueryKeys.all,
    "erpCodes",
    partnerId,
  ],
  erpCodeList: (
    partnerId: number,
    params?: PaginationParams & { search?: string },
  ) => [...partnerQueryKeys.erpCodes(partnerId), params],
  erpCodeDetail: (partnerId: number, erpCodeId: number) => [
    ...partnerQueryKeys.erpCodes(partnerId),
    "detail",
    erpCodeId,
  ],
};

/**
 * Hook to fetch paginated partners
 */
export const useListPartners = (
  params?: PaginationParams & { search?: string; status?: string },
  options?: Omit<
    UseQueryOptions<PagedApiResponse<Partner>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerQueryKeys.list(params),
    queryFn: () => partnerService.listPartners(params),
    ...options,
  });

  useHandleQueryResponse(query);

  return query;
};

/**
 * Hook to fetch a specific partner by ID
 */
export const useGetPartnerById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<Partner>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerQueryKeys.detail(id),
    queryFn: () => partnerService.getPartnerById(id),
    ...options,
  });

  useHandleQueryResponse(query);
  return query;
};

/**
 * Hook to fetch partner documents
 */
export const useListPartnerDocuments = (
  partnerId: number,
  params?: PaginationParams & { search?: string },
  options?: Omit<
    UseQueryOptions<PagedApiResponse<PartnerDocument>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerQueryKeys.documentList(partnerId, params),
    queryFn: () => partnerService.listPartnerDocuments(partnerId, params),
    ...options,
  });

  useHandleQueryResponse(query);
  return query;
};

/**
 * Hook to fetch partner contacts
 */
export const useListPartnerContacts = (
  partnerId: number,
  params?: PaginationParams & { search?: string },
  options?: Omit<
    UseQueryOptions<PagedApiResponse<PartnerContact>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerQueryKeys.contactList(partnerId, params),
    queryFn: () => partnerService.listPartnerContacts(partnerId, params),
    ...options,
  });

  useHandleQueryResponse(query);
  return query;
};

/**
 * Hook to fetch partner roles
 */
export const useListPartnerRoles = (
  partnerId: number,
  params?: PaginationParams & { search?: string },
  options?: Omit<
    UseQueryOptions<PagedApiResponse<PartnerRole>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerQueryKeys.roleList(partnerId, params),
    queryFn: () => partnerService.listPartnerRoles(partnerId, params),
    ...options,
  });

  useHandleQueryResponse(query);
  return query;
};

/**
 * Hook to fetch partner KBLI entries
 */
export const useListPartnerKblis = (
  partnerId: number,
  params?: PaginationParams & { search?: string },
  options?: Omit<
    UseQueryOptions<PagedApiResponse<PartnerKbli>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerQueryKeys.kbliList(partnerId, params),
    queryFn: () => partnerService.listPartnerKblis(partnerId, params),
    ...options,
  });

  useHandleQueryResponse(query);
  return query;
};

/**
 * Returns true when a query error is an HTTP 404 "not found" response.
 * Used by 0..1 child resources (tax profile, legality) where a missing
 * record is a normal "not yet created" state, not an error.
 */
export function isNotFoundQueryError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const response = (error as { response?: { status?: number } }).response;
  if (response?.status === 404) return true;
  return (error as { status?: number }).status === 404;
}

/**
 * Hook to fetch the partner legality record (0..1). A 404 means the record
 * has not been created yet and is treated as empty state, not an error.
 */
export const useGetPartnerLegality = (
  partnerId: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<PartnerLegality>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerQueryKeys.legality(partnerId),
    queryFn: () => partnerService.getPartnerLegality(partnerId),
    retry: (failureCount, error) =>
      isNotFoundQueryError(error) ? false : failureCount < 3,
    ...options,
  });

  return query;
};

/**
 * Hook to fetch the partner tax profile (0..1). A 404 means the record has
 * not been created yet and is treated as empty state, not an error.
 */
export const useGetPartnerTaxProfile = (
  partnerId: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<PartnerTaxProfile>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerQueryKeys.taxProfile(partnerId),
    queryFn: () => partnerService.getPartnerTaxProfile(partnerId),
    retry: (failureCount, error) =>
      isNotFoundQueryError(error) ? false : failureCount < 3,
    ...options,
  });

  return query;
};

/**
 * Hook to fetch partner taxes (tax rate associations)
 */
export const useListPartnerTaxes = (
  partnerId: number,
  params?: PaginationParams & { search?: string },
  options?: Omit<
    UseQueryOptions<PagedApiResponse<PartnerTaxRate>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerQueryKeys.taxList(partnerId, params),
    queryFn: () => partnerService.listPartnerTaxes(partnerId, params),
    ...options,
  });

  useHandleQueryResponse(query);
  return query;
};

type PartnerDocReferenceFilters = {
  companyCode?: string;
  countryId?: number;
  partnerCategoryId?: number;
  partnerTypeId?: number;
  partnerSubTypeId?: number;
  partnerLegalityId?: number;
  partnerRoleId?: number;
};

type PartnerDocReferenceQueryOptions = Omit<
  UseQueryOptions<ApiResponse<Array<PartnerDocReference>>, Error>,
  "queryKey" | "queryFn"
>;

/**
 * Hook to fetch doc references for a partner
 */
export const useListPartnerDocReferences = ({
  companyCode,
  countryId,
  partnerCategoryId,
  partnerTypeId,
  partnerSubTypeId,
  partnerLegalityId,
  partnerRoleId,
  options,
}: PartnerDocReferenceFilters & { options?: PartnerDocReferenceQueryOptions }) => {
  const query = useQuery({
    queryKey: partnerQueryKeys.docRef(
      companyCode,
      countryId,
      partnerCategoryId,
      partnerTypeId,
      partnerSubTypeId,
      partnerLegalityId,
      partnerRoleId,
    ),
    queryFn: () =>
      partnerService.getFilteredDocRef(
        companyCode,
        countryId,
        partnerCategoryId,
        partnerTypeId,
        partnerSubTypeId,
        partnerLegalityId,
        partnerRoleId,
      ),
    ...options,
  });

  useHandleQueryResponse(query);
  return query;
};

/**
 * Hook to fetch partner bank accounts
 */
export const useListPartnerBankAccounts = (
  partnerId: number,
  params?: PaginationParams & {
    search?: string;
    companyCode?: string;
    active?: boolean;
  },
  options?: Omit<
    UseQueryOptions<PagedApiResponse<PartnerBankAccount>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerQueryKeys.bankAccountList(partnerId, params),
    queryFn: () => partnerService.listPartnerBankAccounts(partnerId, params),
    ...options,
  });

  useHandleQueryResponse(query);
  return query;
};

/**
 * Hook to fetch partner virtual accounts
 */
export const useListPartnerVirtualAccounts = (
  partnerId: number,
  params?: PaginationParams & {
    search?: string;
    bankCode?: string;
    companyCode?: string;
    active?: boolean;
  },
  options?: Omit<
    UseQueryOptions<PagedApiResponse<PartnerVirtualAccount>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerQueryKeys.virtualAccountList(partnerId, params),
    queryFn: () => partnerService.listPartnerVirtualAccounts(partnerId, params),
    ...options,
  });

  useHandleQueryResponse(query);
  return query;
};

/**
 * Hook to fetch partner ERP codes
 */
export const useListPartnerErpCodes = (
  partnerId: number,
  params?: PaginationParams & { search?: string },
  options?: Omit<
    UseQueryOptions<PagedApiResponse<PartnerErpCode>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerQueryKeys.erpCodeList(partnerId, params),
    queryFn: () => partnerService.listPartnerErpCodes(partnerId, params),
    ...options,
  });

  useHandleQueryResponse(query);
  return query;
};

// NOTE: PartnerAddress data lives with the partner aggregate; no standalone
// paginated partner address resource exists (plan decision K3), so no
// address list hook is exposed here.
export type { PartnerAddress } from "./partner.types";
