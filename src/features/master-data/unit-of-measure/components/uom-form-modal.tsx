import {
  uomSchema,
  useCreateUomMutation,
  useUpdateUomMutation,
  type UomResponse,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

type UomFormData = z.output<typeof uomSchema>;

interface UomFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<UomResponse>;
  onSuccess?: () => void;
}

export function UomFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<UomFormModalProps>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
  } = useForm<UomFormData>({
    resolver: zodResolver(uomSchema),
    defaultValues: {
      code: defaultValues?.code || "",
      unit: defaultValues?.unit || "",
      unitEn: defaultValues?.unitEn || "",
      unitAlias: defaultValues?.unitAlias || "",
      isActive: defaultValues?.isActive ?? true,
    },
  });

  const createMutation = useCreateUomMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateUomMutation({
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
        unit: defaultValues?.unit || "",
        unitEn: defaultValues?.unitEn || "",
        unitAlias: defaultValues?.unitAlias || "",
        isActive: defaultValues?.isActive ?? true,
      });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data: UomFormData) => {
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
      title={mode === "create" ? "Add Unit of Measure" : "Edit Unit of Measure"}
      size="default"
      onConfirm={handleSubmit(onSubmit)}
      confirmText={mode === "create" ? "Create" : "Update"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Code Field */}
        <div className="space-y-2">
          <Label htmlFor="code" className="text-sm font-medium">
            Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="code"
            placeholder="e.g., UM.0001"
            disabled={isLoading || mode === "edit"}
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

        {/* Unit (ID) Field */}
        <div className="space-y-2">
          <Label htmlFor="unit" className="text-sm font-medium">
            Unit (ID) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="unit"
            placeholder="e.g., Kilogram, Liter"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.unit && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("unit")}
          />
          {errors.unit && (
            <p className="text-xs text-red-500">{errors.unit.message}</p>
          )}
        </div>

        {/* Unit (EN) Field */}
        <div className="space-y-2">
          <Label htmlFor="unitEn" className="text-sm font-medium">
            Unit (EN)
          </Label>
          <Input
            id="unitEn"
            placeholder="e.g., Kilogram, Liter (EN)"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.unitEn && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("unitEn")}
          />
          {errors.unitEn && (
            <p className="text-xs text-red-500">{errors.unitEn.message}</p>
          )}
        </div>

        {/* Alias Field */}
        <div className="space-y-2">
          <Label htmlFor="unitAlias" className="text-sm font-medium">
            Alias <span className="text-red-500">*</span>
          </Label>
          <Input
            id="unitAlias"
            placeholder="e.g., KG, LTR"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.unitAlias && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("unitAlias")}
          />
          {errors.unitAlias && (
            <p className="text-xs text-red-500">{errors.unitAlias.message}</p>
          )}
        </div>

        {/* Active Checkbox */}
        <div className="flex items-center space-x-3">
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
            className="text-sm font-medium cursor-pointer"
          >
            Active
          </Label>
        </div>
      </form>
    </Modal>
  );
}

export default UomFormModal;
