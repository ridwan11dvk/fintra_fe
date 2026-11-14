/* eslint-disable react-hooks/incompatible-library */
import {
  partnerTypeSchema,
  useCreatePartnerTypeMutation,
  useUpdatePartnerTypeMutation,
  type PartnerTypeResponse,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { QuerySelect } from "@railfinance/core/components/input";
import { Textarea } from "@railfinance/core/ui/textarea";
import { useGetActivePartnerTypes, useGetLookupValueOptions } from "@railfinance/core/masterdata";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type PartnerTypeFormData = z.output<typeof partnerTypeSchema>;

interface PartnerTypeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<PartnerTypeResponse>;
  onSuccess?: () => void;
}

export function PartnerTypeFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<PartnerTypeFormModalProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(partnerTypeSchema),
    defaultValues: {
      code: defaultValues?.code || "",
      name: defaultValues?.name || "",
      partnerLegalityId: defaultValues?.partnerLegalityId || 0,
      parentId: defaultValues?.parentId || null,
      description: defaultValues?.description || "",
      isActive: defaultValues?.isActive ?? true,
      integratedToErp: defaultValues?.integratedToErp ?? false,
    } satisfies PartnerTypeFormData,
  });

  const createMutation = useCreatePartnerTypeMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdatePartnerTypeMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const mutation = mode === "create" ? createMutation : updateMutation;
  const isLoading = mutation.isPending;

  const { data: legalityData } = useGetLookupValueOptions("PARTNER_LEGALITY", {
    enabled: open,
  });

  const partnerLegalityId = watch("partnerLegalityId");
  const { data: partnerTypesData } = useGetActivePartnerTypes(
    partnerLegalityId || 0,
    { enabled: open && partnerLegalityId > 0 },
  );

  useEffect(() => {
    if (open) {
      reset({
        code: defaultValues?.code || "",
        name: defaultValues?.name || "",
        partnerLegalityId: defaultValues?.partnerLegalityId || 0,
        parentId: defaultValues?.parentId || null,
        description: defaultValues?.description || "",
        isActive: defaultValues?.isActive ?? true,
        integratedToErp: defaultValues?.integratedToErp ?? false,
      });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data: PartnerTypeFormData) => {
    if (mode === "create") {
      createMutation.mutate(data);
    } else if (defaultValues?.id) {
      updateMutation.mutate({
        id: defaultValues.id,
        data,
      });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add Partner Type" : "Edit Partner Type"}
      size="default"
      onConfirm={handleSubmit(onSubmit)}
      confirmText={mode === "create" ? "Create" : "Update"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Partner Type Code Field */}
        <div className="space-y-2">
          <Label htmlFor="code" className="text-sm font-medium">
            Partner Type Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="code"
            placeholder="e.g., DS"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.code && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("code")}
          />
          {errors.code && (
            <p className="text-xs text-red-500">{errors.code.message}</p>
          )}
        </div>

        {/* Partner Type Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Partner Type Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., Domestic Supplier"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.name && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
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
              value && setValue("partnerLegalityId", Number.parseInt(value, 10))
            }
            options={(legalityData?.data || []).map((legality) => ({
              value: String(legality.value),
              label: legality.label,
              description: legality.description,
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

        {/* Parent Type Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Parent Type (for hierarchy subtypes)
          </Label>
          <QuerySelect
            value={watch("parentId")?.toString() || ""}
            onValueChange={(val) =>
              val && setValue("parentId", Number.parseInt(val, 10))
            }
            options={(partnerTypesData?.data || []).map((type) => ({
              value: String(type.id),
              label: type.description ?? type.name,
              description: type.description ?? "",
            }))}
            placeholder="Select parent type (optional)"
            disabled={isLoading}
            className={cn(
              errors.parentId && "border-red-500 focus-visible:ring-red-500",
            )}
          />
          {errors.parentId && (
            <p className="text-xs text-red-500">{errors.parentId.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Enter partner type description (optional)"
            disabled={isLoading}
            className={cn(
              errors.description && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("description")}
            rows={3}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Checkboxes Row */}
        <div className="flex gap-6">
          {/* Is Active Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={watch("isActive")}
              onChange={(e) => setValue("isActive", e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border border-input"
            />
            <Label htmlFor="isActive" className="text-sm font-medium">
              Active
            </Label>
          </div>

          {/* Integrated to ERP Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="integratedToErp"
              checked={watch("integratedToErp")}
              onChange={(e) => setValue("integratedToErp", e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border border-input"
            />
            <Label htmlFor="integratedToErp" className="text-sm font-medium">
              Sync to ERP
            </Label>
          </div>
        </div>
      </form>
    </Modal>
  );
}
