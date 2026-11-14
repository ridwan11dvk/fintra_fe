/* eslint-disable react-hooks/incompatible-library */
import {
  useCreateVillageMutation,
  useUpdateVillageMutation,
  villageSchema,
  type VillageResponse,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import type { OptionItem } from "@railfinance/core/types";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { QuerySelect } from "@railfinance/core/components/input";
import { useGetDistrictOptions, useGetProvinceOptions, useGetRegencyOptions } from "@railfinance/core/masterdata";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type VillageFormData = z.output<typeof villageSchema>;

interface VillageFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<VillageResponse>;
  onSuccess?: () => void;
}

export function VillageFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<VillageFormModalProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(villageSchema),
    defaultValues: {
      code: defaultValues?.code || "",
      name: defaultValues?.name || "",
      postalCode: defaultValues?.postalCode || "",
      provinceId: 0,
      regencyId: 0,
      districtId: defaultValues?.districtId || 0,
      isActive: defaultValues?.isActive ?? true,
    } satisfies VillageFormData,
  });

  const provinceIdValue = watch("provinceId");
  const regencyIdValue = watch("regencyId");

  const createMutation = useCreateVillageMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateVillageMutation({
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
  const { data: districtsData } = useGetDistrictOptions(regencyIdValue || 0, {
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      reset({
        code: defaultValues?.code || "",
        name: defaultValues?.name || "",
        postalCode: defaultValues?.postalCode || "",
        provinceId: defaultValues?.provinceId || 0,
        regencyId: defaultValues?.regencyId || 0,
        districtId: defaultValues?.districtId || 0,
        isActive: defaultValues?.isActive ?? true,
      });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data: VillageFormData) => {
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
      title={mode === "create" ? "Add Village" : "Edit Village"}
      size="default"
      onConfirm={handleSubmit(onSubmit)}
      confirmText={mode === "create" ? "Create" : "Update"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Village Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Village Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., Cihampelas"
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

        {/* Village Code Field */}
        <div className="space-y-2">
          <Label htmlFor="code" className="text-sm font-medium">
            Village Code
          </Label>
          <Input
            id="code"
            placeholder="e.g., VIL001"
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

        {/* Postal Code Field */}
        <div className="space-y-2">
          <Label htmlFor="postalCode" className="text-sm font-medium">
            Postal Code
          </Label>
          <Input
            id="postalCode"
            placeholder="e.g., 40141"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.postalCode && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("postalCode")}
          />
          {errors.postalCode && (
            <p className="text-xs text-red-500">{errors.postalCode.message}</p>
          )}
        </div>

        {/* Province Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Province <span className="text-red-500">*</span>
          </Label>
          <QuerySelect
            value={watch("provinceId")?.toString() || ""}
            onValueChange={(value) => {
              if (value) setValue("provinceId", Number.parseInt(value, 10));
            }}
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
            onValueChange={(value) => {
              if (value) setValue("regencyId", Number.parseInt(value, 10));
            }}
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

        {/* District Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            District <span className="text-red-500">*</span>
          </Label>
          <QuerySelect
            value={watch("districtId")?.toString() || ""}
            onValueChange={(value) =>
              value && setValue("districtId", Number.parseInt(value, 10))
            }
            options={(districtsData?.data || []).map(
              (district: OptionItem) => ({
                value: district.value.toString(),
                label: district.description || district.label,
                description: district.description || district.label,
              }),
            )}
            placeholder="Select district"
            disabled={isLoading || !regencyIdValue}
            className={cn(
              errors.districtId && "border-red-500 focus-visible:ring-red-500",
            )}
          />
          {errors.districtId && (
            <p className="text-xs text-red-500">{errors.districtId.message}</p>
          )}
        </div>

        {/* Active Status Field */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={watch("isActive")}
            onCheckedChange={(checked) =>
              setValue("isActive", checked === true)
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
