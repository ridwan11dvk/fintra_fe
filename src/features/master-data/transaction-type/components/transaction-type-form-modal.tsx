/* eslint-disable react-hooks/incompatible-library */
import {
  transactionTypeSchema,
  useCreateTransactionTypeMutation,
  useUpdateTransactionTypeMutation,
  type TransactionTypeResponse,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { QuerySelect } from "@railfinance/core/components/input";
import { useGetCompanyOptions, useGetModuleOptions } from "@railfinance/core/masterdata";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

type TransactionTypeFormData = z.output<typeof transactionTypeSchema>;

interface TransactionTypeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<TransactionTypeResponse>;
  onSuccess?: () => void;
}

function getDefaultTransactionTypeValues(
  defaultValues?: Partial<TransactionTypeResponse>,
): TransactionTypeFormData {
  return {
    companyCode: defaultValues?.companyCode || "",
    code: defaultValues?.code || "",
    tcode: defaultValues?.tcode || "",
    name: defaultValues?.name || "",
    description: defaultValues?.description || "",
    moduleId: defaultValues?.moduleId ?? undefined,
    docType: defaultValues?.docType || "",
    docBase: defaultValues?.docBase || "",
    formType: defaultValues?.formType || "",
    type: defaultValues?.type || "",
    customerCode: defaultValues?.customerCode || "",
    taxableItemCode: defaultValues?.taxableItemCode || "",
    invoiceCode: defaultValues?.invoiceCode || "",
    isVatUsed: defaultValues?.isVatUsed ?? false,
    hasVirtualPenalty: defaultValues?.hasVirtualPenalty ?? false,
    isRevenueRecorded: defaultValues?.isRevenueRecorded ?? false,
    isAutoBilling: defaultValues?.isAutoBilling ?? false,
    glRevenue: defaultValues?.glRevenue || "",
    glPrepaid: defaultValues?.glPrepaid || "",
    glFreight: defaultValues?.glFreight || "",
    wwprd: defaultValues?.wwprd || "",
    wwrvc: defaultValues?.wwrvc || "",
    vaSource: defaultValues?.vaSource || "",
    isActive: defaultValues?.isActive ?? true,
  };
}

export function TransactionTypeFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<TransactionTypeFormModalProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(transactionTypeSchema),
    defaultValues: getDefaultTransactionTypeValues(defaultValues),
  });

  const createMutation = useCreateTransactionTypeMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateTransactionTypeMutation({
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
  const { data: modulesData } = useGetModuleOptions({ enabled: open });

  const selectedModuleId = watch("moduleId");

  const isReceivableModule = useMemo(() => {
    if (!selectedModuleId || !modulesData?.data) return false;
    const selectedModule = modulesData.data.find(
      (m) => m.value === selectedModuleId.toString(),
    );
    return (
      selectedModule?.label?.toLowerCase().includes("receivable") ||
      selectedModule?.label?.toLowerCase().includes("accounts receivable")
    );
  }, [selectedModuleId, modulesData]);

  useEffect(() => {
    if (open) {
      reset(getDefaultTransactionTypeValues(defaultValues));
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data: TransactionTypeFormData) => {
    if (mode === "create") {
      createMutation.mutate(data);
    } else if (defaultValues?.id) {
      updateMutation.mutate({ id: defaultValues.id, data });
    }
  };

  const renderFormContent = () => {
    const eCls = (f: string) =>
      cn((errors as Record<string, unknown>)[f] ? "border-red-500" : undefined);
    const eMsg = (f: string) => {
      const m = (errors as Record<string, { message?: string }>)[f];
      return m ? <p className="text-xs text-red-500">{m.message}</p> : null;
    };

    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyCode">
              Company Code <span className="text-red-500">*</span>
            </Label>
            <QuerySelect
              value={watch("companyCode") || ""}
              onValueChange={(value) => value && setValue("companyCode", value)}
              options={(companiesData?.data || []).map((company) => ({
                value: String(company.label),
                label: company.label,
                description: `${company.label} - ${company.description}`,
              }))}
              placeholder="Select company"
              disabled={isLoading}
              className={eCls("companyCode")}
            />
            {eMsg("companyCode")}
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">
              Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="code"
              placeholder="e.g., SI"
              {...register("code")}
              className={eCls("code")}
            />
            {eMsg("code")}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Sales Invoice"
              {...register("name")}
              className={eCls("name")}
            />
            {eMsg("name")}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tcode">SAP TCode</Label>
            <Input
              id="tcode"
              placeholder="e.g., FB70"
              {...register("tcode")}
              className={eCls("tcode")}
            />
            {eMsg("tcode")}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="moduleId">Module</Label>
            <QuerySelect
              value={watch("moduleId") ? String(watch("moduleId")) : ""}
              onValueChange={(val) =>
                val && setValue("moduleId", Number.parseInt(val, 10))
              }
              options={(modulesData?.data || []).map((module) => ({
                value: String(module.value),
                label: module.label,
                description: module.label,
              }))}
              placeholder="Select module"
              disabled={isLoading}
              className={eCls("moduleId")}
            />
            {eMsg("moduleId")}
          </div>
          {isReceivableModule && (
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <QuerySelect
                value={watch("type") || ""}
                onValueChange={(value) => setValue("type", value || "")}
                options={[
                  {
                    value: "revenue",
                    label: "Revenue",
                    description: "Revenue",
                  },
                  {
                    value: "prepaid",
                    label: "Prepaid",
                    description: "Prepaid",
                  },
                  {
                    value: "freight",
                    label: "Freight",
                    description: "Freight",
                  },
                ]}
                placeholder="Select type"
                disabled={isLoading}
                className={eCls("type")}
              />
              {eMsg("type")}
            </div>
          )}
        </div>

        {isReceivableModule && (
          <>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Transaction type description"
                {...register("description")}
                className={eCls("description")}
              />
              {eMsg("description")}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="docType">SAP Document Type</Label>
                <Input
                  id="docType"
                  placeholder="e.g., F5"
                  {...register("docType")}
                  className={eCls("docType")}
                />
                {eMsg("docType")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerCode">Customer Code</Label>
                <Input
                  id="customerCode"
                  placeholder="e.g., CUST001"
                  {...register("customerCode")}
                  className={eCls("customerCode")}
                />
                {eMsg("customerCode")}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxableItemCode">Product Code</Label>
                <Input
                  id="taxableItemCode"
                  placeholder="e.g., TAX001"
                  {...register("taxableItemCode")}
                  className={eCls("taxableItemCode")}
                />
                {eMsg("taxableItemCode")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceCode">Invoice Code</Label>
                <Input
                  id="invoiceCode"
                  placeholder="e.g., INV-{YYYY}-{MM}-{NNNN}"
                  {...register("invoiceCode")}
                  className={eCls("invoiceCode")}
                />
                {eMsg("invoiceCode")}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="glRevenue">GL Revenue</Label>
                <Input
                  id="glRevenue"
                  placeholder="GL Account"
                  {...register("glRevenue")}
                  className={eCls("glRevenue")}
                />
                {eMsg("glRevenue")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="glPrepaid">GL Prepaid</Label>
                <Input
                  id="glPrepaid"
                  placeholder="GL Account"
                  {...register("glPrepaid")}
                  className={eCls("glPrepaid")}
                />
                {eMsg("glPrepaid")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="glFreight">GL Freight</Label>
                <Input
                  id="glFreight"
                  placeholder="GL Account"
                  {...register("glFreight")}
                  className={eCls("glFreight")}
                />
                {eMsg("glFreight")}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wwprd">WWPRD</Label>
                <Input
                  id="wwprd"
                  placeholder="WWPRD"
                  {...register("wwprd")}
                  className={eCls("wwprd")}
                />
                {eMsg("wwprd")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="wwrvc">WWRVC</Label>
                <Input
                  id="wwrvc"
                  placeholder="WWRVC"
                  {...register("wwrvc")}
                  className={eCls("wwrvc")}
                />
                {eMsg("wwrvc")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="vaSource">VA Source</Label>
                <Input
                  id="vaSource"
                  placeholder="VA Source"
                  {...register("vaSource")}
                  className={eCls("vaSource")}
                />
                {eMsg("vaSource")}
              </div>
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Controller
              name="isVatUsed"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="isVatUsed"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="isVatUsed" className="font-normal cursor-pointer">
              VAT Used
            </Label>
          </div>
          {isReceivableModule && (
            <>
              <div className="flex items-center space-x-2">
                <Controller
                  name="hasVirtualPenalty"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="hasVirtualPenalty"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label
                  htmlFor="hasVirtualPenalty"
                  className="font-normal cursor-pointer"
                >
                  Virtual Penalty
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Controller
                  name="isRevenueRecorded"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="isRevenueRecorded"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label
                  htmlFor="isRevenueRecorded"
                  className="font-normal cursor-pointer"
                >
                  Revenue Recorded
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Controller
                  name="isAutoBilling"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="isAutoBilling"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label
                  htmlFor="isAutoBilling"
                  className="font-normal cursor-pointer"
                >
                  Auto Billing
                </Label>
              </div>
            </>
          )}
          <div className="flex items-center space-x-2">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="isActive"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="isActive" className="font-normal cursor-pointer">
              Active
            </Label>
          </div>
        </div>
      </>
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={
        mode === "create" ? "Add Transaction Type" : "Edit Transaction Type"
      }
      onConfirm={handleSubmit(onSubmit)}
      confirmText={mode === "create" ? "Create" : "Update"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <form className="space-y-4">{renderFormContent()}</form>
    </Modal>
  );
}
