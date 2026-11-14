/* eslint-disable react-hooks/incompatible-library */
import {
  portSchema,
  useCreatePortMutation,
  useUpdatePortMutation,
  type PortResponse,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { QuerySelect } from "@railfinance/core/components/input";
import { useGetCustomsOfficeOptions } from "@railfinance/core/masterdata";
import { type OptionItem } from "@railfinance/core/types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type PortFormData = z.output<typeof portSchema>;

interface PortFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<PortResponse>;
  onSuccess?: () => void;
}

export function PortFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<PortFormModalProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    setValue,
  } = useForm<PortFormData>({
    resolver: zodResolver(portSchema),
    defaultValues: {
      customsOfficeId: defaultValues?.customsOfficeId || undefined,
      code: defaultValues?.code || "",
      name: defaultValues?.name || "",
      isActive: defaultValues?.isActive ?? true,
    },
  });

  const { data: customsOfficesData, isLoading: isLoadingCustomsOffices } =
    useGetCustomsOfficeOptions();

  const customsOffices: OptionItem[] = customsOfficesData?.data || [];

  const createMutation = useCreatePortMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdatePortMutation({
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
        customsOfficeId: defaultValues?.customsOfficeId || undefined,
        code: defaultValues?.code || "",
        name: defaultValues?.name || "",
        isActive: defaultValues?.isActive ?? true,
      });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data: PortFormData) => {
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
      title={mode === "create" ? "Add Port" : "Edit Port"}
      size="default"
      onConfirm={handleSubmit(onSubmit)}
      confirmText={mode === "create" ? "Create" : "Update"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Customs Office Field */}
        <div className="space-y-2">
          <Label htmlFor="customsOfficeId" className="text-sm font-medium">
            Customs Office <span className="text-red-500">*</span>
          </Label>
          <QuerySelect
            value={
              watch("customsOfficeId")
                ? watch("customsOfficeId").toString()
                : ""
            }
            onValueChange={(value) =>
              setValue("customsOfficeId", Number(value))
            }
            options={customsOffices || []}
            placeholder="Select a customs office"
            disabled={isLoading || isLoadingCustomsOffices}
            className={cn(
              errors.customsOfficeId &&
                "border-red-500 focus-visible:ring-red-500",
            )}
          />
          {errors.customsOfficeId && (
            <p className="text-xs text-red-500">
              {errors.customsOfficeId.message}
            </p>
          )}
        </div>

        {/* Port Code Field */}
        <div className="space-y-2">
          <Label htmlFor="code" className="text-sm font-medium">
            Port Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="code"
            placeholder="e.g., PORT-CGK-001"
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

        {/* Port Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Port Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., Pelabuhan Soekarno-Hatta Jakarta"
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

        {/* Active Checkbox */}
        <div className="flex items-center space-x-3 pt-2">
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

export default PortFormModal;
