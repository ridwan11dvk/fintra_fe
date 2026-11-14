/* eslint-disable react-hooks/incompatible-library */
import {
  districtSchema,
  useCreateDistrictMutation,
  useUpdateDistrictMutation,
  type DistrictResponse,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import type { OptionItem } from "@railfinance/core/types";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { QuerySelect } from "@railfinance/core/components/input";
import { useGetProvinceOptions, useGetRegencyOptions } from "@railfinance/core/masterdata";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type DistrictFormData = z.output<typeof districtSchema>;

interface DistrictFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<DistrictResponse>;
  onSuccess?: () => void;
}

export function DistrictFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<DistrictFormModalProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(districtSchema),
    defaultValues: {
      code: defaultValues?.code || "",
      name: defaultValues?.name || "",
      provinceId: 0,
      regencyId: defaultValues?.regencyId || 0,
      isActive: defaultValues?.isActive ?? true,
    } satisfies DistrictFormData,
  });

  const provinceIdValue = watch("provinceId");

  const createMutation = useCreateDistrictMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateDistrictMutation({
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

  const { data: provincesData } = useGetProvinceOptions({ enabled: open });
  const { data: regenciesData } = useGetRegencyOptions(provinceIdValue || 0, {
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      reset({
        code: defaultValues?.code || "",
        name: defaultValues?.name || "",
        provinceId: defaultValues?.provinceId || 0,
        regencyId: defaultValues?.regencyId || 0,
        isActive: defaultValues?.isActive ?? true,
      });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data: DistrictFormData) => {
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
      title={mode === "create" ? "Add District" : "Edit District"}
      size="default"
      onConfirm={handleSubmit(onSubmit)}
      confirmText={mode === "create" ? "Create" : "Update"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Code Field */}
        <div className="space-y-2">
          <Label htmlFor="code" className="text-sm font-medium">
            Code
          </Label>
          <Input
            id="code"
            placeholder="e.g., DIST001"
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

        {/* District Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            District Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., Bandung City"
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

        {/* Province Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Province <span className="text-red-500">*</span>
          </Label>
          <QuerySelect
            value={watch("provinceId")?.toString() || ""}
            onValueChange={(value) =>
              setValue("provinceId", value ? Number.parseInt(value) : 0)
            }
            options={(provincesData?.data || []).map(
              (province: OptionItem) => ({
                value: province.value.toString(),
                label: province.description || province.label,
                description: province.description || province.label,
              }),
            )}
            placeholder="Select province"
            disabled={isLoading}
            className={cn(
              errors.provinceId && "border-red-500 focus-visible:ring-red-500",
            )}
          />
          {errors.provinceId && (
            <p className="text-xs text-red-500">{errors.provinceId.message}</p>
          )}
        </div>

        {/* Regency Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Regency <span className="text-red-500">*</span>
          </Label>
          <QuerySelect
            value={watch("regencyId")?.toString() || ""}
            onValueChange={(value) =>
              value && setValue("regencyId", Number.parseInt(value, 10))
            }
            options={(regenciesData?.data || []).map((regency: OptionItem) => ({
              value: regency.value.toString(),
              label: regency.description || regency.label,
              description: regency.description || regency.label,
            }))}
            placeholder="Select regency"
            disabled={isLoading || !provinceIdValue}
            className={cn(
              errors.regencyId && "border-red-500 focus-visible:ring-red-500",
            )}
          />
          {errors.regencyId && (
            <p className="text-xs text-red-500">{errors.regencyId.message}</p>
          )}
        </div>

        {/* Active Status Field */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={watch("isActive")}
            onCheckedChange={(checked: boolean) =>
              setValue("isActive", checked)
            }
            disabled={isLoading}
          />
          <Label htmlFor="isActive" className="text-sm font-medium">
            Active
          </Label>
        </div>
      </form>
    </Modal>
  );
}
