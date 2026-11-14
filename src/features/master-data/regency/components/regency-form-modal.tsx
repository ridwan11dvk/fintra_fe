/* eslint-disable react-hooks/incompatible-library */
import {
  regencySchema,
  useCreateRegencyMutation,
  useUpdateRegencyMutation,
  type RegencyResponse,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import type { OptionItem } from "@railfinance/core/types";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { QuerySelect } from "@railfinance/core/components/input";
import { useGetProvinceOptions } from "@railfinance/core/masterdata";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type RegencyFormData = z.output<typeof regencySchema>;

interface RegencyFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<RegencyResponse>;
  onSuccess?: () => void;
}

export function RegencyFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<RegencyFormModalProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(regencySchema),
    defaultValues: {
      code: defaultValues?.code || "",
      name: defaultValues?.name || "",
      provinceId: defaultValues?.provinceId || 0,
      isActive: defaultValues?.isActive ?? true,
    } satisfies RegencyFormData,
  });

  const createMutation = useCreateRegencyMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateRegencyMutation({
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

  useEffect(() => {
    if (open) {
      reset({
        code: defaultValues?.code || "",
        name: defaultValues?.name || "",
        provinceId: defaultValues?.provinceId || 0,
        isActive: defaultValues?.isActive ?? true,
      });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data: RegencyFormData) => {
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
      title={mode === "create" ? "Add Regency" : "Edit Regency"}
      size="default"
      onConfirm={handleSubmit(onSubmit)}
      confirmText={mode === "create" ? "Create" : "Update"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Regency Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Regency Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., Bandung"
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

        {/* Regency Code Field */}
        <div className="space-y-2">
          <Label htmlFor="code" className="text-sm font-medium">
            Regency Code
          </Label>
          <Input
            id="code"
            placeholder="e.g., REG001"
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

        {/* Province Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Province</Label>
          <QuerySelect
            value={watch("provinceId")?.toString() || ""}
            onValueChange={(value) =>
              value && setValue("provinceId", Number.parseInt(value, 10))
            }
            options={(provincesData?.data || []).map(
              (province: OptionItem) => ({
                value: province.value.toString(),
                label: province.description ?? "",
                description: province.description ?? "",
              }),
            )}
            placeholder="Select province..."
            disabled={isLoading}
            className={cn(
              errors.provinceId && "border-red-500 focus-visible:ring-red-500",
            )}
          />
          {errors.provinceId && (
            <p className="text-xs text-red-500">{errors.provinceId.message}</p>
          )}
        </div>

        {/* Active Status Checkbox */}
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="isActive"
            checked={watch("isActive")}
            onCheckedChange={(checked) =>
              setValue("isActive", checked === true)
            }
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
