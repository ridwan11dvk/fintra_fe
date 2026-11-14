/* eslint-disable react-hooks/incompatible-library */
"use client";

import {
  partnerDocRefSchema,
  useCreatePartnerDocRefMutation,
  useUpdatePartnerDocRefMutation,
  type PartnerDocRefResponse,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuerySelect } from "@railfinance/core/components/input";
import { Modal } from "@railfinance/core/components/modal";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import {
  useGetActivePartnerCategories,
  useGetActivePartnerTypes,
  useGetCompanyOptions,
  useGetCountryOptions,
  useGetLookupValueOptions,
  useGetPartnerTypeSubtypes,
} from "@railfinance/core/masterdata";
import type { OptionItem } from "@railfinance/core/types";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { Label } from "@railfinance/core/ui/label";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type PartnerDocRefFormData = z.output<typeof partnerDocRefSchema>;

/**
 * Response defaults extended with lookup-id fields that are not yet part
 * of the published @railfinance/core response type.
 */
type PartnerDocRefFormDefaults = Partial<PartnerDocRefResponse> & {
  partnerLegalityId?: number | null;
  partnerRoleId?: number | null;
  documentNameId?: number | null;
};

interface PartnerDocRefFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: PartnerDocRefFormDefaults;
  onSuccess?: () => void;
}

export function PartnerDocRefFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<PartnerDocRefFormModalProps>) {
  const { data: countriesData } = useGetCountryOptions({ enabled: open });
  const { data: companiesData } = useGetCompanyOptions({ enabled: open });
  const { data: categoriesData } = useGetActivePartnerCategories({
    enabled: open,
  });
  const { data: legalityData } = useGetLookupValueOptions("PARTNER_LEGALITY", {
    enabled: open,
  });
  const { data: roleData } = useGetLookupValueOptions("PARTNER_ROLE", {
    enabled: open,
  });
  const { data: documentNamesData } = useGetLookupValueOptions(
    "DOCUMENT_NAME",
    { enabled: open },
  );

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(partnerDocRefSchema),
    defaultValues: {
      countryId: defaultValues?.countryId ?? 0,
      companyCode: defaultValues?.companyCode ?? "",
      partnerClassificationId: defaultValues?.partnerClassificationId ?? null,
      partnerCategoryId: defaultValues?.partnerCategoryId ?? null,
      partnerLegalityId: defaultValues?.partnerLegalityId ?? 0,
      partnerRoleId: defaultValues?.partnerRoleId ?? 0,
      partnerTypeId: defaultValues?.partnerTypeId ?? null,
      partnerSubTypeId: defaultValues?.partnerSubTypeId ?? null,
      documentNameId: defaultValues?.documentNameId ?? 0,
      isActive: defaultValues?.isActive ?? true,
    } satisfies PartnerDocRefFormData,
  });

  const createMutation = useCreatePartnerDocRefMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdatePartnerDocRefMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const partnerLegalityIdValue = watch("partnerLegalityId");
  const partnerTypeIdValue = watch("partnerTypeId");
  const { data: typesData } = useGetActivePartnerTypes(
    partnerLegalityIdValue || 0,
    { enabled: !!partnerLegalityIdValue },
  );
  const { data: subTypesData } = useGetPartnerTypeSubtypes(
    partnerTypeIdValue || 0,
    { enabled: !!partnerTypeIdValue },
  );

  const mutation = mode === "create" ? createMutation : updateMutation;
  const isLoading = mutation.isPending;

  const onSubmit = (data: PartnerDocRefFormData) => {
    if (mode === "create") {
      createMutation.mutate(data);
    } else if (defaultValues?.id) {
      updateMutation.mutate({
        id: defaultValues.id,
        data,
      });
    }
  };

  useEffect(() => {
    if (open) {
      reset({
        countryId: defaultValues?.countryId ?? 0,
        companyCode: defaultValues?.companyCode ?? "",
        partnerClassificationId: defaultValues?.partnerClassificationId ?? null,
        partnerCategoryId: defaultValues?.partnerCategoryId ?? null,
        partnerLegalityId: defaultValues?.partnerLegalityId ?? 0,
        partnerRoleId: defaultValues?.partnerRoleId ?? 0,
        partnerTypeId: defaultValues?.partnerTypeId ?? null,
        partnerSubTypeId: defaultValues?.partnerSubTypeId ?? null,
        documentNameId: defaultValues?.documentNameId ?? 0,
        isActive: defaultValues?.isActive ?? true,
      });
    }
  }, [open, defaultValues, reset]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={
        mode === "create"
          ? "Create Partner Document Reference"
          : "Edit Partner Document Reference"
      }
      size="default"
      onConfirm={handleSubmit(onSubmit)}
      confirmText={mode === "create" ? "Create" : "Update"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Country Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Country <span className="text-red-500">*</span>
          </Label>
          <QuerySelect
            value={watch("countryId")?.toString() || ""}
            onValueChange={(value) =>
              value && setValue("countryId", Number.parseInt(value, 10))
            }
            options={(countriesData?.data || []).map((country: OptionItem) => ({
              value: country.value,
              label: country.label,
              description: country.description ?? "",
            }))}
            placeholder="Select country"
            disabled={isLoading}
            className={cn(
              errors.countryId && "border-red-500 focus-visible:ring-red-500",
            )}
          />
          {errors.countryId && (
            <p className="text-xs text-red-500">{errors.countryId.message}</p>
          )}
        </div>

        {/* Company Code Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Company <span className="text-red-500">*</span>
          </Label>
          <QuerySelect
            value={watch("companyCode") || ""}
            onValueChange={(value) => value && setValue("companyCode", value)}
            options={(companiesData?.data || []).map((company: OptionItem) => ({
              value: company.alias ?? company.value,
              label: company.label,
              description: company.description ?? "",
            }))}
            placeholder="Select company"
            disabled={isLoading}
            className={cn(
              errors.companyCode && "border-red-500 focus-visible:ring-red-500",
            )}
          />
          {errors.companyCode && (
            <p className="text-xs text-red-500">{errors.companyCode.message}</p>
          )}
        </div>




        {/* Partner Role Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Partner Role <span className="text-red-500">*</span>
          </Label>
          <QuerySelect
            value={watch("partnerRoleId")?.toString() || ""}
            onValueChange={(value) =>
              setValue("partnerRoleId", value ? Number.parseInt(value, 10) : 0)
            }
            options={(roleData?.data || []).map((role) => ({
              value: role.value,
              label: role.label,
              description: "",
            }))}
            placeholder="Select partner role"
            disabled={isLoading}
            className={cn(
              errors.partnerRoleId &&
              "border-red-500 focus-visible:ring-red-500",
            )}
          />
          {errors.partnerRoleId && (
            <p className="text-xs text-red-500">
              {errors.partnerRoleId.message}
            </p>
          )}
        </div>

        {/* Partner Legality Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Partner Legality <span className="text-red-500">*</span>
          </Label>
          <QuerySelect
            value={watch("partnerLegalityId")?.toString() || ""}
            onValueChange={(value) =>
              setValue(
                "partnerLegalityId",
                value ? Number.parseInt(value, 10) : 0,
              )
            }
            options={(legalityData?.data || []).map((legality) => ({
              value: legality.value,
              label: legality.label,
              description: "",
            }))}
            placeholder="Select partner legality"
            disabled={isLoading}
            className={cn(
              errors.partnerLegalityId &&
              "border-red-500 focus-visible:ring-red-500",
            )}
          />
          {errors.partnerLegalityId && (
            <p className="text-xs text-red-500">
              {errors.partnerLegalityId.message}
            </p>
          )}
        </div>

        {/* Partner Type Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Partner Type</Label>
          <QuerySelect
            value={watch("partnerTypeId")?.toString() || ""}
            onValueChange={(value) =>
              setValue(
                "partnerTypeId",
                value ? Number.parseInt(value, 10) : null,
              )
            }
            options={(typesData?.data || []).map((type) => ({
              value: String(type.id),
              label: type.name,
              description: type.description ?? "",
            }))}
            placeholder="Select partner type"
            disabled={isLoading}
          />
        </div>

        {/* Partner Sub-Type Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Partner Sub-Type</Label>
          <QuerySelect
            value={watch("partnerSubTypeId")?.toString() || ""}
            onValueChange={(value) =>
              setValue(
                "partnerSubTypeId",
                value ? Number.parseInt(value, 10) : null,
              )
            }
            options={(subTypesData?.data || []).map((subType) => ({
              value: String(subType.id),
              label: subType.name,
              description: subType.description ?? "",
            }))}
            placeholder="Select partner sub-type"
            disabled={isLoading}
          />
        </div>

        {/* Partner Category Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Partner Category</Label>
          <QuerySelect
            value={watch("partnerCategoryId")?.toString() || ""}
            onValueChange={(value) =>
              setValue(
                "partnerCategoryId",
                value ? Number.parseInt(value, 10) : null,
              )
            }
            options={(categoriesData?.data || []).map((category) => ({
              value: String(category.id),
              label: category.name,
              description: "",
            }))}
            placeholder="Select partner category"
            disabled={isLoading}
          />
        </div>

        {/* Document Name Field - selection from document name master data */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Document Name <span className="text-red-500">*</span>
          </Label>
          <QuerySelect
            value={watch("documentNameId")?.toString() || ""}
            onValueChange={(value) =>
              value &&
              setValue("documentNameId", Number.parseInt(value, 10))
            }
            options={(documentNamesData?.data || []).map(
              (documentName: OptionItem) => ({
                value: documentName.value,
                label: documentName.label,
                description: documentName.description ?? "",
              }),
            )}
            placeholder="Select document name"
            disabled={isLoading}
            className={cn(
              errors.documentNameId &&
              "border-red-500 focus-visible:ring-red-500",
            )}
          />
          {errors.documentNameId && (
            <p className="text-xs text-red-500">
              {errors.documentNameId.message}
            </p>
          )}
        </div>

        {/* Active Status */}
        <div className="flex items-center space-x-3 pt-2">
          <Checkbox
            id="isActive"
            name="isActive"
            checked={watch("isActive")}
            onCheckedChange={(value) => setValue("isActive", value as boolean)}
            disabled={isLoading}
          />
          <Label
            htmlFor="isActive"
            className="text-sm font-medium cursor-pointer"
          >
            Active
          </Label>
        </div>
      </form>
    </Modal>
  );
}
