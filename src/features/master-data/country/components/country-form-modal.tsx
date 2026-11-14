import {
  countrySchema,
  useCreateCountryMutation,
  useUpdateCountryMutation,
  type CountryResponse,
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

type CountryFormData = z.output<typeof countrySchema>;

interface CountryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<CountryResponse>;
  onSuccess?: () => void;
}

export function CountryFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<CountryFormModalProps>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
  } = useForm<CountryFormData>({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      name: defaultValues?.name || "",
      iso2Code: defaultValues?.iso2Code?.toUpperCase() || "",
      iso3Code: defaultValues?.iso3Code?.toUpperCase() || "",
      dialCode: defaultValues?.dialCode || "",
      isActive: defaultValues?.isActive ?? true,
    },
  });

  const createMutation = useCreateCountryMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateCountryMutation({
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
        iso2Code: defaultValues?.iso2Code?.toUpperCase() || "",
        iso3Code: defaultValues?.iso3Code?.toUpperCase() || "",
        dialCode: defaultValues?.dialCode || "",
        isActive: defaultValues?.isActive ?? true,
      });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data: CountryFormData) => {
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
      title={mode === "create" ? "Add Country" : "Edit Country"}
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
            Country Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., Indonesia"
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

        {/* ISO 2 Code Field */}
        <div className="space-y-2">
          <Label htmlFor="iso2Code" className="text-sm font-medium">
            ISO 2 Code
          </Label>
          <Input
            id="iso2Code"
            placeholder="e.g., ID"
            maxLength={2}
            disabled={isLoading}
            className={cn(
              "h-10 uppercase",
              errors.iso2Code && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("iso2Code")}
          />
          {errors.iso2Code && (
            <p className="text-xs text-red-500">{errors.iso2Code.message}</p>
          )}
        </div>

        {/* ISO 3 Code Field */}
        <div className="space-y-2">
          <Label htmlFor="iso3Code" className="text-sm font-medium">
            ISO 3 Code
          </Label>
          <Input
            id="iso3Code"
            placeholder="e.g., IDN"
            maxLength={3}
            disabled={isLoading}
            className={cn(
              "h-10 uppercase",
              errors.iso3Code && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("iso3Code")}
          />
          {errors.iso3Code && (
            <p className="text-xs text-red-500">{errors.iso3Code.message}</p>
          )}
        </div>

        {/* Dial Code Field */}
        <div className="space-y-2">
          <Label htmlFor="dialCode" className="text-sm font-medium">
            Dial Code
          </Label>
          <Input
            id="dialCode"
            placeholder="e.g., +62"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.dialCode && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("dialCode")}
          />
          {errors.dialCode && (
            <p className="text-xs text-red-500">{errors.dialCode.message}</p>
          )}
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

export default CountryFormModal;
