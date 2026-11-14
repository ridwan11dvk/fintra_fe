import {
  taxableItemSchema,
  TaxableItemType,
  useCreateTaxableItemMutation,
  useListTaxableItems,
  useUpdateTaxableItemMutation,
  type TaxableItemResponse,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuerySelect } from "@railfinance/core/components/input";
import { Modal } from "@railfinance/core/components/modal";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { type CostCenterResponse } from "@railfinance/core/masterdata";
import type { InputValue } from "@railfinance/core/types";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import {
  SelectContent,
  SelectItem,
  Select as SelectShadcn,
  SelectTrigger,
  SelectValue,
} from "@railfinance/core/ui/select";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

type TaxableItemFormData = z.input<typeof taxableItemSchema>;

interface TaxableItemFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<TaxableItemResponse>;
  defaultLevel?: number;
  defaultParentId?: number | null;
  onSuccess?: () => void;
}

export function TaxableItemFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  defaultLevel,
  defaultParentId,
  onSuccess,
}: Readonly<TaxableItemFormModalProps>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
  } = useForm<TaxableItemFormData>({
    resolver: zodResolver(taxableItemSchema),
    defaultValues: {
      code: defaultValues?.code || "",
      altCode: defaultValues?.altCode || "",
      fullCode: defaultValues?.fullCode || "",
      fullAltCode: defaultValues?.fullAltCode || "",
      name: defaultValues?.name || "",
      level: defaultValues?.level ?? defaultLevel,
      parentId: defaultValues?.parentId ?? defaultParentId ?? null,
      type: defaultValues?.type || TaxableItemType.GOODS,
      moduleId: defaultValues?.moduleId ?? undefined,
      costCenterIds:
        defaultValues?.costCenters?.map((cc: CostCenterResponse) => cc.id) ||
        [],
      isActive: defaultValues?.isActive ?? true,
    },
  });

  const createMutation = useCreateTaxableItemMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateTaxableItemMutation({
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

  useEffect(() => {
    if (open) {
      reset({
        code: defaultValues?.code || "",
        altCode: defaultValues?.altCode || "",
        fullCode: defaultValues?.fullCode || "",
        fullAltCode: defaultValues?.fullAltCode || "",
        name: defaultValues?.name || "",
        level: defaultValues?.level ?? defaultLevel,
        parentId: defaultValues?.parentId ?? defaultParentId ?? null,
        type: defaultValues?.type || TaxableItemType.GOODS,
        moduleId: defaultValues?.moduleId ?? undefined,
        costCenterIds:
          defaultValues?.costCenters?.map((cc: CostCenterResponse) => cc.id) ||
          [],
        isActive: defaultValues?.isActive ?? true,
      });
    }
  }, [open, defaultValues, defaultLevel, defaultParentId, reset]);

  const onSubmit = (data: TaxableItemFormData) => {
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
      title={mode === "create" ? "Add Taxable Item" : "Edit Taxable Item"}
      size="default"
      onConfirm={handleSubmit(onSubmit)}
      confirmText={mode === "create" ? "Create" : "Update"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Code */}
        <div className="space-y-2">
          <Label htmlFor="code" className="text-sm font-medium">
            Code
          </Label>
          <Input
            id="code"
            placeholder="e.g., TAX001"
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

        {/* Alternative Code */}
        {/* <div className="space-y-2">
          <Label htmlFor="altCode" className="text-sm font-medium">
            Alternative Code
          </Label>
          <Input
            id="altCode"
            placeholder="e.g., ITEM-001"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.altCode && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("altCode")}
          />
          {errors.altCode && (
            <p className="text-xs text-red-500">{errors.altCode.message}</p>
          )}
        </div> NOSONAR */}

        {/* Full Code */}
        <div className="space-y-2">
          <Label htmlFor="fullCode" className="text-sm font-medium">
            Full Code
          </Label>
          <Input
            id="fullCode"
            placeholder="e.g., TAX001-COMPLETE"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.fullCode && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("fullCode")}
          />
          {errors.fullCode && (
            <p className="text-xs text-red-500">{errors.fullCode.message}</p>
          )}
        </div>

        {/* Full Alternative Code */}
        {/* <div className="space-y-2">
          <Label htmlFor="fullAltCode" className="text-sm font-medium">
            Full Alternative Code
          </Label>
          <Input
            id="fullAltCode"
            placeholder="e.g., ITEM-001-ALT"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.fullAltCode && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("fullAltCode")}
          />
          {errors.fullAltCode && (
            <p className="text-xs text-red-500">{errors.fullAltCode.message}</p>
          )}
        </div> NOSONAR */}

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Name <span aria-hidden="true" className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., Goods"
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

        {/* Type */}
        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium">
            Type <span aria-hidden="true" className="text-red-500">*</span>
          </Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <SelectShadcn value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  disabled={isLoading}
                  className={cn(
                    "h-10 w-full",
                    errors.type && "border-red-500 focus-visible:ring-red-500",
                  )}
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaxableItemType.GOODS}>Goods</SelectItem>
                  <SelectItem value={TaxableItemType.SERVICE}>
                    Service
                  </SelectItem>
                </SelectContent>
              </SelectShadcn>
            )}
          />
          {errors.type && (
            <p className="text-xs text-red-500">
              {typeof errors.type.message === "string"
                ? errors.type.message
                : "Invalid type"}
            </p>
          )}
        </div>

        {/* Level */}
        <div className="space-y-2">
          <Label htmlFor="level" className="text-sm font-medium">
            Level
          </Label>
          <Input
            id="level"
            type="number"
            placeholder="e.g., 1"
            min={1}
            max={4}
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.level && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("level", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
          {errors.level && (
            <p className="text-xs text-red-500">{errors.level.message}</p>
          )}
        </div>

        {/* Parent ID */}
        <div className="space-y-2">
          <Label htmlFor="parentId" className="text-sm font-medium">
            Parent
          </Label>
          <Controller
            name="parentId"
            control={control}
            render={({ field }) => {
              return (
                <QuerySelect<InputValue, TaxableItemResponse>
                  id="parentId"
                  asyncOptionQuery={useListTaxableItems}
                  itemToOption={(item) => ({
                    label: item.name,
                    value: String(item.id),
                    description: "",
                  })}
                  value={field.value ? String(field.value) : undefined}
                  onValueChange={(val) =>
                    field.onChange(val ? Number(val) : null)
                  }
                  placeholder="Select parent item"
                  disabled={isLoading}
                  className={cn(
                    errors.parentId &&
                      "border-red-500 focus-visible:ring-red-500",
                  )}
                />
              );
            }}
          />
          {errors.parentId && (
            <p className="text-xs text-red-500">{errors.parentId.message}</p>
          )}
        </div>

        {/* Cost Centers */}
        {/* <div className="space-y-2">
          <Label htmlFor="costCenterIds" className="text-sm font-medium">
            Cost Centers
          </Label>
          <Controller
            name="costCenterIds"
            control={control}
            render={({ field }) => {
              return (
                <QuerySelect<InputValue, CostCenterResponse>
                  id="costCenterIds"
                  multiple={true}
                  asyncOptionQuery={usePaginateActiveCostCenters}
                  itemToOption={(item) => ({
                    label: item.costCenterCode,
                    value: String(item.id),
                    description: "",
                  })}
                  value={field.value ? String(field.value) : undefined}
                  onValueChange={(val) =>
                    field.onChange(val ? Number(val) : null)
                  }
                  placeholder="Select cost centers"
                  disabled={isLoading}
                  className={cn(
                    errors.costCenterIds &&
                      "border-red-500 focus-visible:ring-red-500",
                  )}
                />
              );
            }}
          />
          {errors.costCenterIds && (
            <p className="text-xs text-red-500">
              {errors.costCenterIds.message}
            </p>
          )}
        </div> NOSONAR */}

        {/* Is Active */}
        <div className="flex items-center space-x-2">
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="isActive"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isLoading}
              />
            )}
          />
          <Label
            htmlFor="isActive"
            className="cursor-pointer text-sm font-medium"
          >
            Active
          </Label>
        </div>
      </form>
    </Modal>
  );
}
