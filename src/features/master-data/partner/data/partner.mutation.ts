import type {
  Partner,
  PartnerBankAccount,
  PartnerBankAccountRequest,
  PartnerContact,
  PartnerContactRequest,
  PartnerDeedAmendment,
  PartnerDeedAmendmentRequest,
  PartnerDocument,
  PartnerDocumentRequest,
  PartnerErpCode,
  PartnerErpCodeRequest,
  PartnerKbli,
  PartnerKbliRequest,
  PartnerLegality,
  PartnerLegalityRequest,
  PartnerRequest,
  PartnerRole,
  PartnerRoleRequest,
  PartnerTaxProfile,
  PartnerTaxProfileRequest,
  PartnerTaxRate,
  PartnerTaxRateRequest,
  PartnerVirtualAccount,
  PartnerVirtualAccountRequest,
} from "@/features/master-data/partner/data/partner.types";
import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { partnerQueryKeys } from "./partner.query";
import { partnerService } from "./partner.service";

/**
 * Hook to create a new partner
 */
export const useCreatePartnerMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<Partner>, Error, PartnerRequest>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => partnerService.createPartner(data),
    ...options,
  });
  useHandleMutationResponse(mutation, [partnerQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a partner
 */
export const useUpdatePartnerMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<Partner>,
      Error,
      { id: number; data: Partial<PartnerRequest> }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => partnerService.updatePartner(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerQueryKeys.detail(mutation.variables?.id ?? 0),
  ]);
  return mutation;
};

/**
 * Hook to delete a partner
 */
export const useDeletePartnerMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => partnerService.deletePartner(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [partnerQueryKeys.all]);

  return mutation;
};

// ============== DOCUMENT MUTATIONS ==============

/**
 * Hook to upload partner document
 */
export const useUploadPartnerDocumentMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerDocument>,
      Error,
      {
        partnerId: number;
        data: PartnerDocumentRequest;
      }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ partnerId, data }) =>
      partnerService.uploadPartnerDocument(partnerId, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerQueryKeys.documents(mutation.variables?.partnerId ?? 0),
  ]);

  return mutation;
};

/**
 * Hook to update partner document
 */
export const useUpdatePartnerDocumentMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerDocument>,
      Error,
      {
        partnerId: number;
        documentId: number;
        data: Partial<PartnerDocumentRequest>;
      }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ partnerId, documentId, data }) =>
      partnerService.updatePartnerDocument(partnerId, documentId, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerQueryKeys.documents(mutation.variables?.partnerId ?? 0),
  ]);
  return mutation;
};

/**
 * Hook to delete partner document
 */
export const useDeletePartnerDocumentMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<string>,
      Error,
      { partnerId: number; documentId: number }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ partnerId, documentId }) =>
      partnerService.deletePartnerDocument(partnerId, documentId),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerQueryKeys.documents(mutation.variables?.partnerId ?? 0),
  ]);

  return mutation;
};

// ============== CONTACT MUTATIONS (replaces branches) ==============

/**
 * Hook to create partner contact
 */
export const useCreatePartnerContactMutation = (
  partnerId: number,
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerContact>,
      Error,
      PartnerContactRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) =>
      partnerService.createPartnerContact({ ...data, partnerId }),
    ...options,
  });

  useHandleMutationResponse(mutation, [partnerQueryKeys.contacts(partnerId)]);
  return mutation;
};

/**
 * Hook to update partner contact
 */
export const useUpdatePartnerContactMutation = (
  partnerId: number,
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerContact>,
      Error,
      {
        contactId: number;
        data: Partial<PartnerContactRequest>;
      }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ contactId, data }) =>
      partnerService.updatePartnerContact(contactId, { ...data, partnerId }),
    ...options,
  });

  useHandleMutationResponse(mutation, [partnerQueryKeys.contacts(partnerId)]);
  return mutation;
};

/**
 * Hook to delete partner contact
 */
export const useDeletePartnerContactMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<string>,
      Error,
      { partnerId: number; contactId: number }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (vars) => partnerService.deletePartnerContact(vars.contactId),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerQueryKeys.contacts(mutation.variables?.partnerId ?? 0),
  ]);

  return mutation;
};

// ============== ROLE MUTATIONS ==============

/**
 * Hook to create partner role
 */
export const useCreatePartnerRoleMutation = (
  partnerId: number,
  options?: Omit<
    UseMutationOptions<ApiResponse<PartnerRole>, Error, PartnerRoleRequest>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) =>
      partnerService.createPartnerRole({ ...data, partnerId }),
    ...options,
  });

  useHandleMutationResponse(mutation, [partnerQueryKeys.roles(partnerId)]);
  return mutation;
};

/**
 * Hook to update partner role
 */
export const useUpdatePartnerRoleMutation = (
  partnerId: number,
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerRole>,
      Error,
      { roleId: number; data: Partial<PartnerRoleRequest> }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ roleId, data }) =>
      partnerService.updatePartnerRole(roleId, { ...data, partnerId }),
    ...options,
  });

  useHandleMutationResponse(mutation, [partnerQueryKeys.roles(partnerId)]);
  return mutation;
};

/**
 * Hook to delete partner role
 */
export const useDeletePartnerRoleMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<string>,
      Error,
      { partnerId: number; roleId: number }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (vars) => partnerService.deletePartnerRole(vars.roleId),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerQueryKeys.roles(mutation.variables?.partnerId ?? 0),
  ]);

  return mutation;
};

// ============== KBLI MUTATIONS ==============

/**
 * Hook to create partner KBLI entry
 */
export const useCreatePartnerKbliMutation = (
  partnerId: number,
  options?: Omit<
    UseMutationOptions<ApiResponse<PartnerKbli>, Error, PartnerKbliRequest>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) =>
      partnerService.createPartnerKbli({ ...data, partnerId }),
    ...options,
  });

  useHandleMutationResponse(mutation, [partnerQueryKeys.kblis(partnerId)]);
  return mutation;
};

/**
 * Hook to update partner KBLI entry
 */
export const useUpdatePartnerKbliMutation = (
  partnerId: number,
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerKbli>,
      Error,
      { kbliId: number; data: Partial<PartnerKbliRequest> }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ kbliId, data }) =>
      partnerService.updatePartnerKbli(kbliId, { ...data, partnerId }),
    ...options,
  });

  useHandleMutationResponse(mutation, [partnerQueryKeys.kblis(partnerId)]);
  return mutation;
};

/**
 * Hook to delete partner KBLI entry
 */
export const useDeletePartnerKbliMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<string>,
      Error,
      { partnerId: number; kbliId: number }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (vars) => partnerService.deletePartnerKbli(vars.kbliId),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerQueryKeys.kblis(mutation.variables?.partnerId ?? 0),
  ]);

  return mutation;
};

// ============== LEGALITY MUTATIONS ==============

/**
 * Hook to create partner legality
 */
export const useCreatePartnerLegalityMutation = (
  partnerId: number,
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerLegality>,
      Error,
      PartnerLegalityRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) =>
      partnerService.createPartnerLegality({ ...data, partnerId }),
    ...options,
  });

  useHandleMutationResponse(mutation, [partnerQueryKeys.legality(partnerId)]);
  return mutation;
};

/**
 * Hook to update partner legality
 */
export const useUpdatePartnerLegalityMutation = (
  partnerId: number,
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerLegality>,
      Error,
      { legalityId: number; data: Partial<PartnerLegalityRequest> }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ legalityId, data }) =>
      partnerService.updatePartnerLegality(legalityId, {
        ...data,
        partnerId,
      }),
    ...options,
  });

  useHandleMutationResponse(mutation, [partnerQueryKeys.legality(partnerId)]);
  return mutation;
};

/**
 * Hook to delete partner legality
 */
export const useDeletePartnerLegalityMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<string>,
      Error,
      { partnerId: number; legalityId: number }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (vars) => partnerService.deletePartnerLegality(vars.legalityId),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerQueryKeys.legality(mutation.variables?.partnerId ?? 0),
  ]);

  return mutation;
};

/**
 * Hook to create a deed amendment under a legality
 */
export const useCreatePartnerDeedAmendmentMutation = (
  partnerId: number,
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerDeedAmendment>,
      Error,
      PartnerDeedAmendmentRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) =>
      partnerService.createPartnerDeedAmendment(data.legalityId ?? 0, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [partnerQueryKeys.legality(partnerId)]);
  return mutation;
};

/**
 * Hook to update a deed amendment under a legality
 */
export const useUpdatePartnerDeedAmendmentMutation = (
  partnerId: number,
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerDeedAmendment>,
      Error,
      {
        legalityId: number;
        amendmentId: number;
        data: Partial<PartnerDeedAmendmentRequest>;
      }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ legalityId, amendmentId, data }) =>
      partnerService.updatePartnerDeedAmendment(legalityId, amendmentId, {
        ...data,
        legalityId,
      }),
    ...options,
  });

  useHandleMutationResponse(mutation, [partnerQueryKeys.legality(partnerId)]);
  return mutation;
};

/**
 * Hook to delete a deed amendment under a legality
 */
export const useDeletePartnerDeedAmendmentMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<string>,
      Error,
      { partnerId: number; legalityId: number; amendmentId: number }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (vars) =>
      partnerService.deletePartnerDeedAmendment(
        vars.legalityId,
        vars.amendmentId,
      ),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerQueryKeys.legality(mutation.variables?.partnerId ?? 0),
  ]);

  return mutation;
};

// ============== TAX PROFILE MUTATIONS ==============

/**
 * Hook to create partner tax profile
 */
export const useCreatePartnerTaxProfileMutation = (
  partnerId: number,
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerTaxProfile>,
      Error,
      PartnerTaxProfileRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) =>
      partnerService.createPartnerTaxProfile({ ...data, partnerId }),
    ...options,
  });

  useHandleMutationResponse(mutation, [partnerQueryKeys.taxProfile(partnerId)]);
  return mutation;
};

/**
 * Hook to update partner tax profile
 */
export const useUpdatePartnerTaxProfileMutation = (
  partnerId: number,
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerTaxProfile>,
      Error,
      { taxProfileId: number; data: Partial<PartnerTaxProfileRequest> }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ taxProfileId, data }) =>
      partnerService.updatePartnerTaxProfile(taxProfileId, {
        ...data,
        partnerId,
      }),
    ...options,
  });

  useHandleMutationResponse(mutation, [partnerQueryKeys.taxProfile(partnerId)]);
  return mutation;
};

/**
 * Hook to delete partner tax profile
 */
export const useDeletePartnerTaxProfileMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<string>,
      Error,
      { partnerId: number; taxProfileId: number }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (vars) =>
      partnerService.deletePartnerTaxProfile(vars.taxProfileId),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerQueryKeys.taxProfile(mutation.variables?.partnerId ?? 0),
  ]);

  return mutation;
};

// ============== TAX RATE MUTATIONS ==============

/**
 * Hook to create partner tax (tax rate association)
 */
export const useCreatePartnerTaxMutation = (
  partnerId: number,
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerTaxRate>,
      Error,
      PartnerTaxRateRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => partnerService.createPartnerTax(partnerId, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [partnerQueryKeys.taxes(partnerId)]);
  return mutation;
};

/**
 * Hook to update partner tax (tax rate association)
 */
export const useUpdatePartnerTaxMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerTaxRate>,
      Error,
      { partnerId: number; taxId: number; data: Partial<PartnerTaxRateRequest> }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ partnerId, taxId, data }) =>
      partnerService.updatePartnerTax(partnerId, taxId, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerQueryKeys.taxes(mutation.variables?.partnerId ?? 0),
  ]);
  return mutation;
};

/**
 * Hook to delete partner tax (tax rate association)
 */
export const useDeletePartnerTaxMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<string>,
      Error,
      { partnerId: number; taxId: number }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ taxId }) => partnerService.deletePartnerTax(taxId),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerQueryKeys.taxes(mutation.variables?.partnerId ?? 0),
  ]);

  return mutation;
};

// ============== BANK ACCOUNT MUTATIONS ==============

/**
 * Hook to create partner bank account
 */
export const useCreatePartnerBankAccountMutation = (
  partnerId: number,
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerBankAccount>,
      Error,
      PartnerBankAccountRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) =>
      partnerService.createPartnerBankAccount({ ...data, partnerId }),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerQueryKeys.bankAccounts(partnerId),
  ]);
  return mutation;
};

/**
 * Hook to update partner bank account
 */
export const useUpdatePartnerBankAccountMutation = (
  partnerId: number,
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerBankAccount>,
      Error,
      { bankAccountId: number; data: Partial<PartnerBankAccountRequest> }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ bankAccountId, data }) =>
      partnerService.updatePartnerBankAccount(bankAccountId, {
        ...data,
        partnerId,
      }),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerQueryKeys.bankAccounts(partnerId),
  ]);
  return mutation;
};

/**
 * Hook to delete partner bank account
 */
export const useDeletePartnerBankAccountMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<string>,
      Error,
      { partnerId: number; bankAccountId: number }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (vars) =>
      partnerService.deletePartnerBankAccount(vars.bankAccountId),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerQueryKeys.bankAccounts(mutation.variables?.partnerId ?? 0),
  ]);

  return mutation;
};

// ============== VIRTUAL ACCOUNT MUTATIONS ==============

/**
 * Hook to create partner virtual account
 */
export const useCreatePartnerVirtualAccountMutation = (
  partnerId: number,
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerVirtualAccount>,
      Error,
      PartnerVirtualAccountRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) =>
      partnerService.createPartnerVirtualAccount({ ...data, partnerId }),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerQueryKeys.virtualAccounts(partnerId),
  ]);
  return mutation;
};

/**
 * Hook to update partner virtual account
 */
export const useUpdatePartnerVirtualAccountMutation = (
  partnerId: number,
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerVirtualAccount>,
      Error,
      { virtualAccountId: number; data: Partial<PartnerVirtualAccountRequest> }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ virtualAccountId, data }) =>
      partnerService.updatePartnerVirtualAccount(virtualAccountId, {
        ...data,
        partnerId,
      }),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerQueryKeys.virtualAccounts(partnerId),
  ]);
  return mutation;
};

/**
 * Hook to delete partner virtual account
 */
export const useDeletePartnerVirtualAccountMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<string>,
      Error,
      { partnerId: number; virtualAccountId: number }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (vars) =>
      partnerService.deletePartnerVirtualAccount(vars.virtualAccountId),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerQueryKeys.virtualAccounts(mutation.variables?.partnerId ?? 0),
  ]);

  return mutation;
};

// ============== ERP CODE MUTATIONS ==============

/**
 * Hook to create partner ERP code
 */
export const useCreatePartnerErpCodeMutation = (
  partnerId: number,
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerErpCode>,
      Error,
      PartnerErpCodeRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => partnerService.createPartnerErpCode(partnerId, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [partnerQueryKeys.erpCodes(partnerId)]);
  return mutation;
};

/**
 * Hook to update partner ERP code
 */
export const useUpdatePartnerErpCodeMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerErpCode>,
      Error,
      {
        partnerId: number;
        erpCodeId: number;
        data: Partial<PartnerErpCodeRequest>;
      }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ partnerId, erpCodeId, data }) =>
      partnerService.updatePartnerErpCode(partnerId, erpCodeId, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerQueryKeys.erpCodes(mutation.variables?.partnerId ?? 0),
  ]);
  return mutation;
};

/**
 * Hook to delete partner ERP code
 */
export const useDeletePartnerErpCodeMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<string>,
      Error,
      { partnerId: number; erpCodeId: number }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ partnerId, erpCodeId }) =>
      partnerService.deletePartnerErpCode(partnerId, erpCodeId),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerQueryKeys.erpCodes(mutation.variables?.partnerId ?? 0),
  ]);

  return mutation;
};
