/* eslint-disable react-hooks/incompatible-library */
import {
  glAccountSchema,
  useCreateGLAccountMutation,
  useUpdateGLAccountMutation,
  type GeneralLedgerAccountResponse,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuerySelect } from "@railfinance/core/components/input";
import { Modal } from "@railfinance/core/components/modal";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import {
  useGetBusinessAreaOptions,
  useGetCompanyOptions,
} from "@railfinance/core/masterdata";
import type { OptionItem } from "@railfinance/core/types";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type GLAccountFormData = z.output<typeof glAccountSchema>;

interface GLAccountFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<GeneralLedgerAccountResponse>;
  onSuccess?: () => void;
}

export function GLAccountFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<GLAccountFormModalProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(glAccountSchema),
    defaultValues: {
      companyCode: defaultValues?.companyCode || "",
      baCode: defaultValues?.baCode || "",
      name: defaultValues?.name || "",
      account: defaultValues?.account || "",
      description: defaultValues?.description || "",
      commitmentItem: defaultValues?.commitmentItem || "",
      operationalCostComponent: defaultValues?.operationalCostComponent || "",
      imoCostComponent: defaultValues?.imoCostComponent || "",
      startDate: defaultValues?.startDate
        ? new Date(defaultValues.startDate).toISOString().split("T")[0]
        : "",
      endDate: defaultValues?.endDate
        ? new Date(defaultValues.endDate).toISOString().split("T")[0]
        : "",
    } satisfies GLAccountFormData,
  });

  const createMutation = useCreateGLAccountMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateGLAccountMutation({
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
  const { data: businessAreasData } = useGetBusinessAreaOptions(undefined, {
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      reset({
        companyCode: defaultValues?.companyCode || "",
        baCode: defaultValues?.baCode || "",
        name: defaultValues?.name || "",
        account: defaultValues?.account || "",
        description: defaultValues?.description || "",
        commitmentItem: defaultValues?.commitmentItem || "",
        operationalCostComponent: defaultValues?.operationalCostComponent || "",
        imoCostComponent: defaultValues?.imoCostComponent || "",
        startDate: defaultValues?.startDate
          ? new Date(defaultValues.startDate).toISOString().split("T")[0]
          : "",
        endDate: defaultValues?.endDate
          ? new Date(defaultValues.endDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data: GLAccountFormData) => {
    if (mode === "create") {
      createMutation.mutate({
        ...data,
        baCode: data.baCode || null,
        endDate: data.endDate || null,
      });
    } else if (defaultValues?.id) {
      updateMutation.mutate({
        id: defaultValues.id,
        data: {
          ...data,
          baCode: data.baCode || null,
          endDate: data.endDate || null,
        },
      });
    }
  };

  const companyOptions =
    companiesData?.data?.map((item: OptionItem) => ({
      value: item.alias ?? item.value,
      label: item.label,
      description: item.description,
    })) || [];

  const businessAreaOptions =
    businessAreasData?.data?.map((item: OptionItem) => ({
      value: item.alias ?? item.value,
      label: item.label,
      description: item.description,
    })) || [];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add GL Account" : "Edit GL Account"}
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
            value={watch("companyCode")}
            onValueChange={(value) => setValue("companyCode", value)}
            options={companyOptions}
            placeholder="Select company..."
            disabled={isLoading}
            aria-invalid={!!errors.companyCode}
          />
          {errors.companyCode && (
            <p className="text-xs text-red-500">{errors.companyCode.message}</p>
          )}
        </div>

        {/* Business Area Code Field (optional) */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Business Area Code</Label>
          <QuerySelect
            value={watch("baCode")}
            onValueChange={(value) => setValue("baCode", value)}
            options={businessAreaOptions}
            placeholder="All business areas..."
            disabled={isLoading}
            aria-invalid={!!errors.baCode}
          />
          {errors.baCode && (
            <p className="text-xs text-red-500">{errors.baCode.message}</p>
          )}
        </div>

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Name
          </Label>
          <Input
            id="name"
            placeholder="e.g., Kas di Loket"
            disabled={isLoading}
            maxLength={100}
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

        {/* Account Field */}
        <div className="space-y-2">
          <Label htmlFor="account" className="text-sm font-medium">
            Account <span className="text-red-500">*</span>
          </Label>
          <Input
            id="account"
            placeholder="e.g., 110120"
            disabled={isLoading}
            maxLength={20}
            className={cn(
              "h-10",
              errors.account && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("account")}
          />
          {errors.account && (
            <p className="text-xs text-red-500">{errors.account.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Input
            id="description"
            placeholder="e.g., Revenue from Product Sales"
            disabled={isLoading}
            maxLength={255}
            className={cn(
              "h-10",
              errors.description && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Commitment Item Field */}
        <div className="space-y-2">
          <Label htmlFor="commitmentItem" className="text-sm font-medium">
            Commitment Item
          </Label>
          <Input
            id="commitmentItem"
            placeholder="e.g., CMT-001"
            disabled={isLoading}
            maxLength={100}
            className={cn(
              "h-10",
              errors.commitmentItem &&
                "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("commitmentItem")}
          />
          {errors.commitmentItem && (
            <p className="text-xs text-red-500">
              {errors.commitmentItem.message}
            </p>
          )}
        </div>

        {/* Operational Cost Component Field */}
        <div className="space-y-2">
          <Label
            htmlFor="operationalCostComponent"
            className="text-sm font-medium"
          >
            Operational Cost Component
          </Label>
          <Input
            id="operationalCostComponent"
            placeholder="e.g., OPR-001"
            disabled={isLoading}
            maxLength={100}
            className={cn(
              "h-10",
              errors.operationalCostComponent &&
                "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("operationalCostComponent")}
          />
          {errors.operationalCostComponent && (
            <p className="text-xs text-red-500">
              {errors.operationalCostComponent.message}
            </p>
          )}
        </div>

        {/* IMO Cost Component Field */}
        <div className="space-y-2">
          <Label htmlFor="imoCostComponent" className="text-sm font-medium">
            IMO Cost Component
          </Label>
          <Input
            id="imoCostComponent"
            placeholder="e.g., IMO-001"
            disabled={isLoading}
            maxLength={100}
            className={cn(
              "h-10",
              errors.imoCostComponent &&
                "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("imoCostComponent")}
          />
          {errors.imoCostComponent && (
            <p className="text-xs text-red-500">
              {errors.imoCostComponent.message}
            </p>
          )}
        </div>

        {/* Start Date Field */}
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm font-medium">
            Start Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="startDate"
            type="date"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.startDate && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("startDate")}
          />
          {errors.startDate && (
            <p className="text-xs text-red-500">{errors.startDate.message}</p>
          )}
        </div>

        {/* End Date Field */}
        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-sm font-medium">
            End Date
          </Label>
          <Input
            id="endDate"
            type="date"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.endDate && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("endDate")}
            min={watch("startDate") || undefined}
          />
          {errors.endDate && (
            <p className="text-xs text-red-500">{errors.endDate.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default GLAccountFormModal;
