import {
  rejectCategorySchema,
  useCreateRejectCategoryMutation,
  useUpdateRejectCategoryMutation,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import type { OptionItem } from "@railfinance/core/types";
import type { RejectCategoryResponse } from "@railfinance/core/masterdata";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { QuerySelect } from "@railfinance/core/components/input";
import { Textarea } from "@railfinance/core/ui/textarea";
import { useGetFeaturesByModuleId, useGetModuleOptions } from "@railfinance/core/masterdata";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";

type RejectCategoryFormData = z.output<typeof rejectCategorySchema>;

interface RejectCategoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<RejectCategoryResponse>;
  onSuccess?: () => void;
}

export function RejectCategoryFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<RejectCategoryFormModalProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    control,
    setValue,
  } = useForm({
    resolver: zodResolver(rejectCategorySchema),
    defaultValues: {
      code: defaultValues?.code || "",
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      moduleId: defaultValues?.moduleId ?? undefined,
      featureId: defaultValues?.featureId ?? undefined,
      isActive: defaultValues?.isActive ?? true,
    } satisfies RejectCategoryFormData,
  });

  const createMutation = useCreateRejectCategoryMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateRejectCategoryMutation({
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

  const { data: modulesData } = useGetModuleOptions({ enabled: open });
  const moduleId = useWatch({ control, name: "moduleId" });

  const { data: featuresData } = useGetFeaturesByModuleId(moduleId || 0, {
    enabled: open && moduleId != null && moduleId > 0,
  });
  const featureId = useWatch({ control, name: "featureId" });
  const isActive = useWatch({ control, name: "isActive" });

  useEffect(() => {
    if (open) {
      reset({
        code: defaultValues?.code || "",
        name: defaultValues?.name || "",
        description: defaultValues?.description || "",
        moduleId: defaultValues?.moduleId ?? undefined,
        featureId: defaultValues?.featureId ?? undefined,
        isActive: defaultValues?.isActive ?? true,
      });
    }
  }, [open, defaultValues, reset]);

  const handleModuleChange = (value: string | number | undefined) => {
    const newModuleId = value ? Number(value) : undefined;
    setValue("moduleId", newModuleId);
    setValue("featureId", undefined);
  };

  const onSubmit = (data: RejectCategoryFormData) => {
    const payload = { ...data, code: data.code || null };
    if (mode === "create") {
      createMutation.mutate(payload);
    } else if (defaultValues?.id) {
      updateMutation.mutate({
        id: defaultValues.id,
        data: payload,
      });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add Reject Category" : "Edit Reject Category"}
      size="default"
      onConfirm={handleSubmit(onSubmit)}
      confirmText={mode === "create" ? "Create" : "Update"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code" className="text-sm font-medium">
            Code
          </Label>
          <Input
            id="code"
            placeholder="e.g., INVALID_DATA"
            disabled={isLoading}
            maxLength={50}
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

        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., Invalid Data"
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

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Enter description"
            disabled={isLoading}
            className={cn(
              errors.description && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Module</Label>
          <QuerySelect
            value={moduleId?.toString() || ""}
            onValueChange={handleModuleChange}
            options={(modulesData?.data || []).map((mod: OptionItem) => ({
              value: mod.value.toString(),
              label: mod.label,
              description: mod.description,
            }))}
            placeholder="Select module"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Feature</Label>
          <QuerySelect
            value={featureId?.toString() || ""}
            onValueChange={(val) => val && setValue("featureId", Number(val))}
            options={(featuresData?.data || []).map((feat) => ({
              value: String(feat.id),
              label: feat.name,
              description: feat.description ?? "",
            }))}
            placeholder="Select feature"
            disabled={isLoading || !moduleId}
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setValue("isActive", e.target.checked)}
            disabled={isLoading}
            className="h-4 w-4 rounded border border-input"
          />
          <Label htmlFor="isActive" className="text-sm font-medium">
            Active
          </Label>
        </div>
      </form>
    </Modal>
  );
}

export default RejectCategoryFormModal;
