/**
 * Posting Auto Form Modal
 * Create and edit posting auto records
 */

import {
  postingAutoFormSchema,
  useCreatePostingAutoMutation,
  useUpdatePostingAutoMutation,
  type PostingAuto,
  type PostingAutoFormData,
} from "@/features/monitoring";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FormMode } from "@railfinance/core/types";
import { DatePicker } from "@railfinance/core/components/input";
import { formatDate, setFormErrorsFromApi } from "@railfinance/core/lib";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@railfinance/core/ui/select";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

interface PostingAutoFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<PostingAuto>;
  onSuccess?: () => void;
  mode: FormMode;
}

const emptyDefaults: PostingAutoFormData = {
  transactionCode: "",
  reversalFlag: "A",
  documentType: "",
  documentDate: "",
  documentNumber: "",
  debitCreditFlag: "S",
  accountNumber: "",
  businessArea: "",
};

export function PostingAutoFormModal({
  open,
  onOpenChange,
  defaultValues,
  onSuccess,
  mode,
}: Readonly<PostingAutoFormModalProps>) {
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    control,
  } = useForm<
    z.input<typeof postingAutoFormSchema>,
    unknown,
    PostingAutoFormData
  >({
    resolver: zodResolver(postingAutoFormSchema),
    defaultValues: emptyDefaults,
  });

  const createMutation = useCreatePostingAutoMutation({
    onSuccess: () => {
      reset(emptyDefaults);
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: Error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdatePostingAutoMutation({
    onSuccess: () => {
      reset(emptyDefaults);
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: Error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (open) {
      if (defaultValues) {
        reset({
          fileName: defaultValues.fileName ?? undefined,
          recordNumber: defaultValues.recordNumber ?? undefined,
          transactionCode: defaultValues.transactionCode ?? "",
          withholdingTax: defaultValues.withholdingTax ?? undefined,
          reversalFlag: defaultValues.reversalFlag ?? "A",
          documentType: defaultValues.documentType ?? "",
          postingDate: defaultValues.postingDate ?? undefined,
          documentDate: defaultValues.documentDate ?? "",
          documentNumber: defaultValues.documentNumber ?? "",
          reference: defaultValues.reference ?? undefined,
          debitCreditFlag: defaultValues.debitCreditFlag ?? "S",
          accountNumber: defaultValues.accountNumber ?? "",
          alternativeAccount: defaultValues.alternativeAccount ?? undefined,
          amount: defaultValues.amount ?? undefined,
          businessArea: defaultValues.businessArea ?? undefined,
          segment: defaultValues.segment ?? undefined,
          fixedAssetNumber: defaultValues.fixedAssetNumber ?? undefined,
          costCenter: defaultValues.costCenter ?? undefined,
          profitCenter: defaultValues.profitCenter ?? undefined,
          assignment: defaultValues.assignment ?? undefined,
          vendor: defaultValues.vendor ?? undefined,
          customer: defaultValues.customer ?? undefined,
          fiscalYear: defaultValues.fiscalYear ?? undefined,
          virtualAccount: defaultValues.virtualAccount ?? undefined,
        });
      } else {
        reset(emptyDefaults);
      }
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data: PostingAutoFormData) => {
    if (isEdit && defaultValues?.id) {
      updateMutation.mutate({ id: defaultValues.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Record" : "Create Record"}
      description={
        isEdit
          ? "Update the posting auto record."
          : "Fill in the details to create a new posting auto record."
      }
      onConfirm={handleSubmit(onSubmit)}
      size="xl"
      confirmText={isEdit ? "Update" : "Create"}
      isLoading={isLoading}
    >
      <form className="space-y-4">
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 gap-4">
            {/* Basic Information */}
            <div className="rounded-lg border p-4">
              <h4 className="mb-3 font-semibold text-foreground">
                Basic Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="fileName">File Name</Label>
                  <Input
                    id="fileName"
                    {...register("fileName")}
                    placeholder="Max 16 chars"
                    maxLength={16}
                  />
                  {errors.fileName && (
                    <p className="text-xs text-destructive">
                      {errors.fileName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="recordNumber">Record Number</Label>
                  <Input
                    id="recordNumber"
                    {...register("recordNumber")}
                    placeholder="Max 4 chars"
                    maxLength={4}
                  />
                  {errors.recordNumber && (
                    <p className="text-xs text-destructive">
                      {errors.recordNumber.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="transactionCode">
                    Transaction Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="transactionCode"
                    {...register("transactionCode")}
                    placeholder="Max 4 chars"
                    maxLength={4}
                  />
                  {errors.transactionCode && (
                    <p className="text-xs text-destructive">
                      {errors.transactionCode.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="virtualAccount">Virtual Account</Label>
                  <Input
                    id="virtualAccount"
                    {...register("virtualAccount")}
                    placeholder="Max 16 chars"
                    maxLength={16}
                  />
                </div>
              </div>
            </div>

            {/* Document Information */}
            <div className="rounded-lg border  p-4">
              <h4 className="mb-3 font-semibold text-foreground">
                Document Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="documentType">
                    Document Type <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="documentType"
                    {...register("documentType")}
                    placeholder="Max 2 chars"
                    maxLength={2}
                  />
                  {errors.documentType && (
                    <p className="text-xs text-destructive">
                      {errors.documentType.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="reference">Transaction Billing Number</Label>
                  <Input
                    id="reference"
                    {...register("reference")}
                    placeholder="Max 50 chars"
                    maxLength={50}
                  />
                  {errors.reference && (
                    <p className="text-xs text-destructive">
                      {errors.reference.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>
                    Reversal Flag <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="reversalFlag"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.reversalFlag && (
                    <p className="text-xs text-destructive">
                      {errors.reversalFlag.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="documentNumber">
                    Document Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="documentNumber"
                    {...register("documentNumber")}
                    placeholder="Max 25 chars"
                    maxLength={25}
                  />
                  {errors.documentNumber && (
                    <p className="text-xs text-destructive">
                      {errors.documentNumber.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="postingDate">Posting Date</Label>

                  <Controller
                    control={control}
                    name="postingDate"
                    render={({ field }) => (
                      <DatePicker
                        onChange={(date) => {
                          const formattedDate = formatDate(
                            date as Date,
                            "YYYYMMDD",
                          );
                          field.onChange(formattedDate);
                        }}
                        value={
                          field.value
                            ? new Date(formatDate(field.value, "YYYY-MM-DD"))
                            : undefined
                        }
                      />
                    )}
                  />
                  {errors.postingDate && (
                    <p className="text-xs text-destructive">
                      {errors.postingDate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="documentDate">
                    Document Date <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="documentDate"
                    render={({ field }) => (
                      <DatePicker
                        onChange={(date) => {
                          const formattedDate = formatDate(
                            date as Date,
                            "YYYYMMDD",
                          );
                          field.onChange(formattedDate);
                        }}
                        value={
                          field.value
                            ? new Date(formatDate(field.value, "YYYY-MM-DD"))
                            : undefined
                        }
                      />
                    )}
                  />
                  {errors.documentDate && (
                    <p className="text-xs text-destructive">
                      {errors.documentDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="rounded-lg border  p-4">
              <h4 className="mb-3 font-semibold text-foreground">
                Financial Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="accountNumber">
                    Account <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="accountNumber"
                    {...register("accountNumber")}
                    placeholder="Max 10 chars"
                    maxLength={10}
                  />
                  {errors.accountNumber && (
                    <p className="text-xs text-destructive">
                      {errors.accountNumber.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="alternativeAccount">
                    Alternative Account
                  </Label>
                  <Input
                    id="alternativeAccount"
                    {...register("alternativeAccount")}
                    placeholder="Max 10 chars"
                    maxLength={10}
                  />
                  {errors.alternativeAccount && (
                    <p className="text-xs text-destructive">
                      {errors.alternativeAccount.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>
                    Type <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="debitCreditFlag"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="S">Debit</SelectItem>
                          <SelectItem value="H">Credit</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.debitCreditFlag && (
                    <p className="text-xs text-destructive">
                      {errors.debitCreditFlag.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    {...register("amount")}
                    disabled
                  />
                  {errors.amount && (
                    <p className="text-xs text-destructive">
                      {errors.amount.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="withholdingTax">PPH</Label>
                  <Input
                    id="withholdingTax"
                    {...register("withholdingTax")}
                    placeholder="Max 5 chars"
                    maxLength={5}
                  />
                </div>
              </div>
            </div>

            {/* Organization Information */}
            <div className="rounded-lg border  p-4">
              <h4 className="mb-3 font-semibold text-foreground">
                Organization Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="businessArea">Business Area</Label>
                  <Input
                    id="businessArea"
                    {...register("businessArea")}
                    placeholder="Max 4 chars"
                    maxLength={4}
                  />
                  {errors.businessArea && (
                    <p className="text-xs text-destructive">
                      {errors.businessArea.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="segment">Segment</Label>
                  <Input
                    id="segment"
                    {...register("segment")}
                    placeholder="Max 5 chars"
                    maxLength={5}
                  />
                  {errors.segment && (
                    <p className="text-xs text-destructive">
                      {errors.segment.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="fixedAssetNumber">Fixed Asset Number</Label>
                  <Input
                    id="fixedAssetNumber"
                    {...register("fixedAssetNumber")}
                    placeholder="1-7 chars"
                    maxLength={7}
                  />
                  {errors.fixedAssetNumber && (
                    <p className="text-xs text-destructive">
                      {errors.fixedAssetNumber.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="costCenter">Cost Center</Label>
                  <Input
                    id="costCenter"
                    {...register("costCenter")}
                    placeholder="Max 10 chars"
                    maxLength={10}
                  />
                  {errors.costCenter && (
                    <p className="text-xs text-destructive">
                      {errors.costCenter.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="profitCenter">Profit Center</Label>
                  <Input
                    id="profitCenter"
                    {...register("profitCenter")}
                    placeholder="Max 10 chars"
                    maxLength={10}
                  />
                  {errors.profitCenter && (
                    <p className="text-xs text-destructive">
                      {errors.profitCenter.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="assignment">Assignment</Label>
                  <Input
                    id="assignment"
                    {...register("assignment")}
                    placeholder="Max 16 chars"
                    maxLength={16}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="sourceBusinessArea">
                    Source Business Area
                  </Label>
                  <Input
                    id="sourceBusinessArea"
                    {...register("sourceBusinessArea")}
                    placeholder="Max 4 chars"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>

            {/* Partner Information */}
            <div className="rounded-lg border  p-4">
              <h4 className="mb-3 font-semibold text-foreground">
                Partner Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Input
                    id="vendor"
                    {...register("vendor")}
                    placeholder="Max 6 chars"
                    maxLength={6}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="customer">Customer</Label>
                  <Input
                    id="customer"
                    {...register("customer")}
                    placeholder="Max 6 chars"
                    maxLength={6}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="kndnr">KNDNR</Label>
                  <Input
                    id="kndnr"
                    {...register("kndnr")}
                    placeholder="Max 6 chars"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>

            {/* SAP Information */}
            <div className="rounded-lg border  p-4">
              <h4 className="mb-3 font-semibold text-foreground">
                SAP Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="fiscalYear">Fiscal Year</Label>
                  <Input
                    id="fiscalYear"
                    type="number"
                    {...register("fiscalYear")}
                    placeholder="e.g. 2024"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="wwrvc">WWRVC</Label>
                  <Input
                    id="wwrvc"
                    {...register("wwrvc")}
                    placeholder="Max 10 chars"
                    maxLength={10}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="wwprd">WWPRD</Label>
                  <Input
                    id="wwprd"
                    {...register("wwprd")}
                    placeholder="Max 6 chars"
                    maxLength={6}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="valueDate">Value Date</Label>
                  <Controller
                    control={control}
                    name="valueDate"
                    render={({ field }) => (
                      <DatePicker
                        onChange={(date) => {
                          const formattedDate = formatDate(
                            date as Date,
                            "YYYYMMDD",
                          );
                          field.onChange(formattedDate);
                        }}
                        value={
                          field.value
                            ? new Date(formatDate(field.value, "YYYY-MM-DD"))
                            : undefined
                        }
                      />
                    )}
                  />
                  {errors.valueDate && (
                    <p className="text-xs text-destructive">
                      {errors.valueDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
