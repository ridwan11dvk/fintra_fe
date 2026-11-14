/* eslint-disable react-hooks/incompatible-library */
import {
  termOfPaymentSchema,
  useCreateTermOfPaymentMutation,
  useUpdateTermOfPaymentMutation,
  type TermOfPaymentResponse,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { QuerySelect } from "@railfinance/core/components/input";
import { Textarea } from "@railfinance/core/ui/textarea";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { discountSetValueAs } from "@/features/master-data";

type TermOfPaymentFormData = z.output<typeof termOfPaymentSchema>;

interface TermOfPaymentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<TermOfPaymentResponse>;
  onSuccess?: () => void;
}

// Calculation type options
const CALCULATION_TYPES = [
  { value: "CALENDAR_DAYS", label: "Calendar Days", description: "" },
  { value: "WORKING_DAYS", label: "Working Days", description: "" },
];

// Discount type options
const DISCOUNT_TYPES = [
  { value: "PERCENTAGE", label: "Percentage (%)", description: "" },
  { value: "VALUE", label: "Fixed Value", description: "" },
];

export function TermOfPaymentFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<TermOfPaymentFormModalProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    setValue,
  } = useForm<TermOfPaymentFormData>({
    resolver: zodResolver(termOfPaymentSchema),
    defaultValues: {
      code: defaultValues?.code || "",
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      numberOfDays: defaultValues?.numberOfDays ?? 0,
      calculationType: defaultValues?.calculationType || "CALENDAR_DAYS",
      discount: defaultValues?.discount || null,
      discountType: defaultValues?.discountType || null,
      isActive: defaultValues?.isActive ?? true,
    },
  });

  const createMutation = useCreateTermOfPaymentMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateTermOfPaymentMutation({
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
        name: defaultValues?.name || "",
        description: defaultValues?.description || "",
        numberOfDays: defaultValues?.numberOfDays ?? 0,
        calculationType: defaultValues?.calculationType || "CALENDAR_DAYS",
        discount: defaultValues?.discount || null,
        discountType: defaultValues?.discountType || null,
        isActive: defaultValues?.isActive ?? true,
      });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data: TermOfPaymentFormData) => {
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
      title={mode === "create" ? "Add Payment Term" : "Edit Payment Term"}
      size="default"
      onConfirm={handleSubmit(onSubmit)}
      confirmText={mode === "create" ? "Create" : "Update"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-h-[60vh] overflow-y-auto pr-2"
      >
        {/* Code Field */}
        <div className="space-y-2">
          <Label htmlFor="code" className="text-sm font-medium">
            Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="code"
            placeholder="e.g., NET_30"
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

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., Net 30"
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
            placeholder="Payment term description"
            disabled={isLoading}
            className={cn(
              "min-h-20",
              errors.description && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Number of Days Field */}
        <div className="space-y-2">
          <Label htmlFor="numberOfDays" className="text-sm font-medium">
            Number of Days <span className="text-red-500">*</span>
          </Label>
          <Input
            id="numberOfDays"
            type="number"
            min="0"
            placeholder="0"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.numberOfDays &&
                "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("numberOfDays", { valueAsNumber: true })}
          />
          {errors.numberOfDays && (
            <p className="text-xs text-red-500">
              {errors.numberOfDays.message}
            </p>
          )}
        </div>

        {/* Calculation Type Field */}
        <div className="space-y-2">
          <Label htmlFor="calculationType" className="text-sm font-medium">
            Calculation Type <span className="text-red-500">*</span>
          </Label>
          <QuerySelect
            value={watch("calculationType")}
            onValueChange={(value) => setValue("calculationType", value)}
            options={CALCULATION_TYPES}
            placeholder="Select calculation type"
            disabled={isLoading}
            aria-invalid={!!errors.calculationType}
          />
          {errors.calculationType && (
            <p className="text-xs text-red-500">
              {errors.calculationType.message}
            </p>
          )}
        </div>

        {/* Discount Type Field */}
        <div className="space-y-2">
          <Label htmlFor="discountType" className="text-sm font-medium">
            Discount Type
          </Label>
          <QuerySelect
            value={watch("discountType") || undefined}
            onValueChange={(value) => setValue("discountType", value)}
            options={DISCOUNT_TYPES}
            placeholder="Select discount type (optional)"
            disabled={isLoading}
            aria-invalid={!!errors.discountType}
          />
          {errors.discountType && (
            <p className="text-xs text-red-500">
              {errors.discountType.message}
            </p>
          )}
        </div>

        {/* Discount Field */}
        <div className="space-y-2">
          <Label htmlFor="discount" className="text-sm font-medium">
            Discount Amount
          </Label>
          <Input
            id="discount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.discount && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("discount", {
              valueAsNumber: true,
              setValueAs: discountSetValueAs,
            })}
          />
          {errors.discount && (
            <p className="text-xs text-red-500">{errors.discount.message}</p>
          )}
        </div>

        {/* Active Status Field */}
        <div className="flex items-center space-x-3 pt-2">
          <input
            id="isActive"
            type="checkbox"
            checked={watch("isActive")}
            onChange={(e) => setValue("isActive", e.target.checked)}
            disabled={isLoading}
            className="h-4 w-4 cursor-pointer"
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

export default TermOfPaymentFormModal;
