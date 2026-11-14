import {
  businessAreaSchema,
  useCreateBusinessAreaMutation,
  useUpdateBusinessAreaMutation,
  type BusinessAreaResponse,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import type { OptionItem } from "@railfinance/core/types";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { QuerySelect } from "@railfinance/core/components/input";
import { useGetCompanyOptions } from "@railfinance/core/masterdata";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { z } from "zod";

type BusinessAreaFormData = z.output<typeof businessAreaSchema>;

interface BusinessAreaFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<BusinessAreaResponse>;
  onSuccess?: () => void;
}

export function BusinessAreaFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<BusinessAreaFormModalProps>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
    setValue,
  } = useForm({
    resolver: zodResolver(businessAreaSchema),
    defaultValues: {
      companyCode: defaultValues?.companyCode || "",
      name: defaultValues?.name || "",
      baCode: defaultValues?.baCode || "",
      branchCode: defaultValues?.branchCode || "",
      email: defaultValues?.email || "",
      taxEmail: defaultValues?.taxEmail || "",
      nitku: defaultValues?.nitku || "",
      npwp: defaultValues?.npwp || "",
      clientId: defaultValues?.clientId || "",
      clientSecret: defaultValues?.clientSecret || "",
      isActive: defaultValues?.isActive ?? true,
    } satisfies BusinessAreaFormData,
  });

  // Watch companyCode value to properly track changes
  const companyCodeValue = useWatch({
    control,
    name: "companyCode",
  });

  const createMutation = useCreateBusinessAreaMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateBusinessAreaMutation({
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

  const { data: companiesData } = useGetCompanyOptions({ enabled: open });

  useEffect(() => {
    if (open) {
      reset({
        companyCode: defaultValues?.companyCode || "",
        name: defaultValues?.name || "",
        baCode: defaultValues?.baCode || "",
        branchCode: defaultValues?.branchCode || "",
        email: defaultValues?.email || "",
        taxEmail: defaultValues?.taxEmail || "",
        nitku: defaultValues?.nitku || "",
        npwp: defaultValues?.npwp || "",
        clientId: defaultValues?.clientId || "",
        clientSecret: defaultValues?.clientSecret || "",
        isActive: defaultValues?.isActive ?? true,
      });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data: BusinessAreaFormData) => {
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
      title={mode === "create" ? "Add Business Area" : "Edit Business Area"}
      size="default"
      onConfirm={handleSubmit(onSubmit)}
      confirmText={mode === "create" ? "Create" : "Update"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Company Code Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Company Code <span className="text-red-500">*</span>
          </Label>
          <QuerySelect
            name="companyCode"
            value={companyCodeValue}
            onValueChange={(value) => {
              setValue("companyCode", value, { shouldDirty: true });
            }}
            options={
              companiesData?.data?.map((company: OptionItem) => ({
                value: company.label,
                label: company.label,
                description: company.description,
              })) || []
            }
            placeholder="Select company..."
            disabled={isLoading}
            aria-invalid={!!errors.companyCode}
            className={cn(
              errors.companyCode && "border-red-500 focus-visible:ring-red-500",
            )}
          />

          {errors.companyCode && (
            <p className="text-xs text-red-500">{errors.companyCode.message}</p>
          )}
        </div>

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Business Area Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., Jakarta Head Office"
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

        {/* Business Area Code Field */}
        <div className="space-y-2">
          <Label htmlFor="baCode" className="text-sm font-medium">
            Business Area Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="baCode"
            placeholder="e.g., BA-JKT-01"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.baCode && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("baCode")}
          />
          {errors.baCode && (
            <p className="text-xs text-red-500">{errors.baCode.message}</p>
          )}
        </div>

        {/* Branch Code Field */}
        <div className="space-y-2">
          <Label htmlFor="branchCode" className="text-sm font-medium">
            Branch Code
          </Label>
          <Input
            id="branchCode"
            placeholder="e.g., BRN-001"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.branchCode && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("branchCode")}
          />
          {errors.branchCode && (
            <p className="text-xs text-red-500">{errors.branchCode.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="e.g., ba.jakarta@ptxyz.com"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.email && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Tax Email Field */}
        <div className="space-y-2">
          <Label htmlFor="taxEmail" className="text-sm font-medium">
            Tax Email
          </Label>
          <Input
            id="taxEmail"
            type="email"
            placeholder="e.g., tax.jakarta@ptxyz.com"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.taxEmail && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("taxEmail")}
          />
          {errors.taxEmail && (
            <p className="text-xs text-red-500">{errors.taxEmail.message}</p>
          )}
        </div>

        {/* NITKU Field */}
        <div className="space-y-2">
          <Label htmlFor="nitku" className="text-sm font-medium">
            NITKU
          </Label>
          <Input
            id="nitku"
            placeholder="e.g., 0012345678"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.nitku && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("nitku")}
          />
          {errors.nitku && (
            <p className="text-xs text-red-500">{errors.nitku.message}</p>
          )}
        </div>

        {/* NPWP Field */}
        <div className="space-y-2">
          <Label htmlFor="npwp" className="text-sm font-medium">
            NPWP
          </Label>
          <Input
            id="npwp"
            placeholder="e.g., 12345678901234"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.npwp && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("npwp")}
          />
          {errors.npwp && (
            <p className="text-xs text-red-500">{errors.npwp.message}</p>
          )}
        </div>

        {/* Client ID Field */}
        <div className="space-y-2">
          <Label htmlFor="clientId" className="text-sm font-medium">
            Client ID
          </Label>
          <Input
            id="clientId"
            placeholder="e.g., CLIENT_001"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.clientId && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("clientId")}
          />
          {errors.clientId && (
            <p className="text-xs text-red-500">{errors.clientId.message}</p>
          )}
        </div>

        {/* Client Secret Field */}
        <div className="space-y-2">
          <Label htmlFor="clientSecret" className="text-sm font-medium">
            Client Secret
          </Label>
          <Input
            id="clientSecret"
            placeholder="Enter client secret"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.clientSecret &&
                "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("clientSecret")}
          />
          {errors.clientSecret && (
            <p className="text-xs text-red-500">
              {errors.clientSecret.message}
            </p>
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

export default BusinessAreaFormModal;
