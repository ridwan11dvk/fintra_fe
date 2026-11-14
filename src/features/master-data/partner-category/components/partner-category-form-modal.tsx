import {
  partnerCategorySchema,
  useCreatePartnerCategoryMutation,
  useUpdatePartnerCategoryMutation,
  type PartnerCategoryResponse,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { Textarea } from "@railfinance/core/ui/textarea";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

type PartnerCategoryFormData = z.output<typeof partnerCategorySchema>;

interface PartnerCategoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<PartnerCategoryResponse>;
  onSuccess?: () => void;
}

export function PartnerCategoryFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<PartnerCategoryFormModalProps>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(partnerCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    } satisfies PartnerCategoryFormData,
  });

  const createMutation = useCreatePartnerCategoryMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdatePartnerCategoryMutation({
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
        name: defaultValues?.name || "",
        description: defaultValues?.description || "",
        isActive: defaultValues?.isActive ?? true,
      } satisfies PartnerCategoryFormData);
    }
  }, [open, mode, defaultValues, reset]);

  const onSubmit = (data: PartnerCategoryFormData) => {
    if (mode === "create") {
      createMutation.mutate(data);
    } else if (
      mode === "edit" &&
      defaultValues &&
      typeof defaultValues.id === "number"
    ) {
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
      title={
        mode === "create" ? "Add Partner Category" : "Edit Partner Category"
      }
      size="default"
      onConfirm={handleSubmit(onSubmit)}
      confirmText={mode === "create" ? "Create" : "Update"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <form className="space-y-4">
        {/* ID Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., Supplier"
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

        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Enter partner category description (optional)"
            disabled={isLoading}
            className={cn(
              "resize-none",
              errors.description && "border-red-500 focus-visible:ring-red-500",
            )}
            rows={4}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Active Status Checkbox */}
        <div className="flex items-center space-x-2 pt-2">
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
