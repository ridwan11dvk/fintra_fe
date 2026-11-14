import {
  bankSchema,
  useCreateBankMutation,
  useUpdateBankMutation,
  type BankResponse,
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

type BankFormData = z.output<typeof bankSchema>;

interface BankFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<BankResponse>;
  onSuccess?: () => void;
}

export function BankFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<BankFormModalProps>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
  } = useForm<BankFormData>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      code: defaultValues?.code || "",
      color: defaultValues?.color || "",
      rtgsCode: defaultValues?.rtgsCode || "",
      onlineCode: defaultValues?.onlineCode || "",
      bifastCode: defaultValues?.bifastCode || "",
      sknCode: defaultValues?.sknCode || "",
      pgCode: defaultValues?.pgCode || "",
      isActive: defaultValues?.isActive ?? true,
    },
  });

  const createMutation = useCreateBankMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateBankMutation({
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
        code: defaultValues?.code || "",
        color: defaultValues?.color || "",
        rtgsCode: defaultValues?.rtgsCode || "",
        onlineCode: defaultValues?.onlineCode || "",
        bifastCode: defaultValues?.bifastCode || "",
        sknCode: defaultValues?.sknCode || "",
        pgCode: defaultValues?.pgCode || "",
        isActive: defaultValues?.isActive ?? true,
      });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data: BankFormData) => {
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
      title={mode === "create" ? "Add Bank" : "Edit Bank"}
      size="default"
      onConfirm={handleSubmit(onSubmit)}
      confirmText={mode === "create" ? "Create" : "Update"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Bank Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., Bank Central Asia"
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

        {/* Code Field */}
        <div className="space-y-2">
          <Label htmlFor="code" className="text-sm font-medium">
            Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="code"
            placeholder="e.g., BCA, MANDIRI"
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

        {/* Color Field */}
        <div className="space-y-2">
          <Label htmlFor="color" className="text-sm font-medium">
            Color
          </Label>
          <div className="flex items-center gap-3">
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <input
                  type="color"
                  id="colorPicker"
                  disabled={isLoading}
                  className="h-10 w-16 cursor-pointer"
                  value={field.value || "#CCCCCC"}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <Input
                  id="color"
                  placeholder="#0066CC (optional)"
                  disabled={isLoading}
                  className={cn(
                    "h-10 flex-1",
                    errors.color && "border-red-500 focus-visible:ring-red-500",
                  )}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          {errors.color && (
            <p className="text-xs text-red-500">{errors.color.message}</p>
          )}
        </div>

        {/* Payment System Codes Section */}
        <div className="pt-2 border-t">
          <h3 className="text-sm font-medium mb-3">Payment System Codes</h3>

          {/* RTGS Code */}
          <div className="space-y-2 mb-3">
            <Label htmlFor="rtgsCode" className="text-sm">
              RTGS Code
            </Label>
            <Input
              id="rtgsCode"
              placeholder="e.g., BCAINID31"
              disabled={isLoading}
              className="h-10"
              {...register("rtgsCode")}
            />
            {errors.rtgsCode && (
              <p className="text-xs text-red-500">{errors.rtgsCode.message}</p>
            )}
          </div>

          {/* Online Code */}
          <div className="space-y-2 mb-3">
            <Label htmlFor="onlineCode" className="text-sm">
              Online Code
            </Label>
            <Input
              id="onlineCode"
              placeholder="e.g., 014"
              disabled={isLoading}
              className="h-10"
              {...register("onlineCode")}
            />
            {errors.onlineCode && (
              <p className="text-xs text-red-500">
                {errors.onlineCode.message}
              </p>
            )}
          </div>

          {/* BIFAST Code */}
          <div className="space-y-2 mb-3">
            <Label htmlFor="bifastCode" className="text-sm">
              BIFAST Code
            </Label>
            <Input
              id="bifastCode"
              placeholder="e.g., 014"
              disabled={isLoading}
              className="h-10"
              {...register("bifastCode")}
            />
            {errors.bifastCode && (
              <p className="text-xs text-red-500">
                {errors.bifastCode.message}
              </p>
            )}
          </div>

          {/* SKN Code */}
          <div className="space-y-2 mb-3">
            <Label htmlFor="sknCode" className="text-sm">
              SKN Code
            </Label>
            <Input
              id="sknCode"
              placeholder="e.g., 014"
              disabled={isLoading}
              className="h-10"
              {...register("sknCode")}
            />
            {errors.sknCode && (
              <p className="text-xs text-red-500">{errors.sknCode.message}</p>
            )}
          </div>

          {/* PG Code */}
          <div className="space-y-2">
            <Label htmlFor="pgCode" className="text-sm">
              PG Code
            </Label>
            <Input
              id="pgCode"
              placeholder="e.g., BCA_PG"
              disabled={isLoading}
              className="h-10"
              {...register("pgCode")}
            />
            {errors.pgCode && (
              <p className="text-xs text-red-500">{errors.pgCode.message}</p>
            )}
          </div>
        </div>

        {/* Active Checkbox */}
        <div className="flex items-center space-x-3 pt-2">
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

export default BankFormModal;
