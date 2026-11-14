/* eslint-disable react-hooks/incompatible-library */
import {
  costCenterSchema,
  useCreateCostCenterMutation,
  useUpdateCostCenterMutation,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuerySelect } from "@railfinance/core/components/input";
import { Modal } from "@railfinance/core/components/modal";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import type { CostCenterResponse } from "@railfinance/core/masterdata";
import {
  LOOKUP_VALUE_TYPE_CODES,
  useGetBusinessAreaOptions,
  useGetCompanyOptions,
  useGetLookupValueOptions,
} from "@railfinance/core/masterdata";
import type { OptionItem } from "@railfinance/core/types";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";

type CostCenterFormInput = z.input<typeof costCenterSchema>;
type CostCenterFormData = z.output<typeof costCenterSchema>;

interface CostCenterFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<CostCenterResponse>;
  onSuccess?: () => void;
}

function getDefaultCostCenterValues(
  defaultValues?: Partial<CostCenterResponse>,
) {
  return {
    companyCode: defaultValues?.companyCode || "",
    businessAreaCode: defaultValues?.businessAreaCode || "",
    costCenterCode: defaultValues?.costCenterCode || "",
    costCenterName: defaultValues?.costCenterName || "",
    description: defaultValues?.description || "",
    startDate: defaultValues?.startDate
      ? new Date(defaultValues.startDate).toISOString().split("T")[0]
      : "",
    endDate: defaultValues?.endDate
      ? new Date(defaultValues.endDate).toISOString().split("T")[0]
      : "",
    categoryId: defaultValues?.categoryId ?? null,
  };
}

/** Convert numeric categoryId to string for the string-based QuerySelect. */
function toSelectValue(categoryId?: number | null): string {
  return categoryId == null ? "" : String(categoryId);
}

export function CostCenterFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<CostCenterFormModalProps>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
    watch,
    setValue,
  } = useForm<CostCenterFormInput, unknown, CostCenterFormData>({
    resolver: zodResolver(costCenterSchema),
    defaultValues: getDefaultCostCenterValues(defaultValues),
  });

  const createMutation = useCreateCostCenterMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateCostCenterMutation({
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

  const { data: companiesData } = useGetCompanyOptions({ enabled: open });
  const { data: businessAreasData } = useGetBusinessAreaOptions(undefined, {
    enabled: open,
  });
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetLookupValueOptions(LOOKUP_VALUE_TYPE_CODES.ASSET_CATEGORY, {
      enabled: open,
    });

  useEffect(() => {
    if (open) {
      reset(getDefaultCostCenterValues(defaultValues));
    }
  }, [open, defaultValues, reset]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = (data: CostCenterFormData) => {
    const payload = {
      ...data,
      businessAreaCode: data.businessAreaCode || null,
      description: data.description || null,
      categoryId: data.categoryId ?? null,
    };
    if (mode === "create") {
      createMutation.mutate(payload);
    } else if (defaultValues?.id) {
      updateMutation.mutate({
        id: defaultValues.id,
        data: payload,
      });
    }
  };

  const companyOptions =
    companiesData?.data?.map((item: OptionItem) => ({
      value: item.alias ?? item.value,
      label: item.label,
      description: item.description,
    })) || [];

  const businessAreaOptions =
    businessAreasData?.data?.map((item: OptionItem) => ({
      value: item.alias ?? item.value,
      label: item.label,
      description: item.description,
    })) || [];

  const categoryOptions =
    categoriesData?.data?.map((item: OptionItem) => ({
      value: String(item.value),
      label: item.label,
      description: item.description,
    })) || [];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add Cost Center" : "Edit Cost Center"}
      size="default"
      onConfirm={handleSubmit(onSubmit)}
      confirmText={mode === "create" ? "Create" : "Update"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Company Code Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Company Code <span className="text-red-500">*</span>
          </Label>
          <QuerySelect
            value={watch("companyCode")}
            onValueChange={(value) => setValue("companyCode", value)}
            options={companyOptions}
            placeholder="Select company..."
            disabled={isLoading}
            aria-invalid={!!errors.companyCode}
          />
          {errors.companyCode && (
            <p className="text-xs text-red-500">{errors.companyCode.message}</p>
          )}
        </div>

        {/* Business Area Code Field (optional) */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Business Area Code</Label>
          <QuerySelect
            value={watch("businessAreaCode")}
            onValueChange={(value) => setValue("businessAreaCode", value)}
            options={businessAreaOptions}
            placeholder="All business areas..."
            disabled={isLoading}
            aria-invalid={!!errors.businessAreaCode}
          />
          {errors.businessAreaCode && (
            <p className="text-xs text-red-500">
              {errors.businessAreaCode.message}
            </p>
          )}
        </div>

        {/* Cost Center Code Field */}
        <div className="space-y-2">
          <Label htmlFor="costCenterCode" className="text-sm font-medium">
            Cost Center Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="costCenterCode"
            placeholder="e.g., 10091200"
            disabled={isLoading}
            maxLength={20}
            className={cn(
              "h-10",
              errors.costCenterCode &&
                "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("costCenterCode")}
          />
          {errors.costCenterCode && (
            <p className="text-xs text-red-500">
              {errors.costCenterCode.message}
            </p>
          )}
        </div>

        {/* Cost Center Name Field */}
        <div className="space-y-2">
          <Label htmlFor="costCenterName" className="text-sm font-medium">
            Cost Center Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="costCenterName"
            placeholder="e.g., Jakarta Head Office Cost Center"
            disabled={isLoading}
            maxLength={150}
            className={cn(
              "h-10",
              errors.costCenterName &&
                "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("costCenterName")}
          />
          {errors.costCenterName && (
            <p className="text-xs text-red-500">
              {errors.costCenterName.message}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Input
            id="description"
            placeholder="e.g., Office operations cost center"
            disabled={isLoading}
            maxLength={255}
            className={cn(
              "h-10",
              errors.description && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Start Date Field */}
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm font-medium">
            Start Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="startDate"
            type="date"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.startDate && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("startDate")}
          />
          {errors.startDate && (
            <p className="text-xs text-red-500">{errors.startDate.message}</p>
          )}
        </div>

        {/* End Date Field */}
        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-sm font-medium">
            End Date
          </Label>
          <Input
            id="endDate"
            type="date"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.endDate && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("endDate")}
            min={useWatch({ name: "startDate", control }) || undefined}
          />
          {errors.endDate && (
            <p className="text-xs text-red-500">{errors.endDate.message}</p>
          )}
        </div>

        {/* Category Field (optional asset category) */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Category</Label>
          <QuerySelect
            value={toSelectValue(watch("categoryId"))}
            onValueChange={(value) =>
              setValue(
                "categoryId",
                value != null && value !== "" ? Number(value) : null,
              )
            }
            options={categoryOptions}
            placeholder="Select category..."
            disabled={isLoading || isLoadingCategories}
          />
        </div>
      </form>
    </Modal>
  );
}

export default CostCenterFormModal;
