/**
 * Posting Asset Legacy Form Modal
 * Create and edit posting asset legacy records
 */
import {
  postingAssetLegacyFormSchema,
  useCreatePostingAssetLegacyMutation,
  useUpdatePostingAssetLegacyMutation,
  type PostingAssetLegacyDetail,
  type PostingAssetLegacyFormData,
} from "@/features/monitoring";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FormMode } from "@railfinance/core/types";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@railfinance/core/ui/select";
import { setFormErrorsFromApi } from "@railfinance/core/lib";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

interface PostingAssetLegacyFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<PostingAssetLegacyDetail>;
  transactionKey?: {
    reversal: string;
    noDok: string;
    reference: string;
  };
  onSuccess?: () => void;
  mode: FormMode;
}

const emptyDefaults: PostingAssetLegacyFormData = {
  RECORD_NUMBER: 1,
  TCODE: "",
  REVERSAL: "A",
  DOC_TYPE: "",
  NO_DOK: "",
  DEBIT_KREDIT: "D",
  ACCOUNT: "",
  AMOUNT: "",
  BA: "",
  Fiscal_year: new Date().getFullYear(),
  virtual_acc: "",
};

export function PostingAssetLegacyFormModal({
  open,
  onOpenChange,
  defaultValues,
  transactionKey,
  onSuccess,
  mode,
}: Readonly<PostingAssetLegacyFormModalProps>) {
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    control,
  } = useForm<
    z.input<typeof postingAssetLegacyFormSchema>,
    unknown,
    PostingAssetLegacyFormData
  >({
    resolver: zodResolver(postingAssetLegacyFormSchema),
    defaultValues: emptyDefaults,
  });

  const createMutation = useCreatePostingAssetLegacyMutation({
    onSuccess: () => {
      reset(emptyDefaults);
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: Error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdatePostingAssetLegacyMutation({
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
          RECORD_NUMBER: defaultValues.RECORD_NUMBER ?? 1,
          TCODE: defaultValues.TCODE ?? "",
          REVERSAL: (defaultValues.REVERSAL as "A" | "B") ?? "A",
          DOC_TYPE: defaultValues.DOC_TYPE ?? "",
          NO_DOK: defaultValues.NO_DOK ?? "",
          REFERENCE: defaultValues.REFERENCE ?? undefined,
          DEBIT_KREDIT: (defaultValues.DEBIT_KREDIT as "D" | "K") ?? "D",
          ACCOUNT: defaultValues.ACCOUNT ?? "",
          AMOUNT: defaultValues.AMOUNT ?? "",
          BA: defaultValues.BA ?? "",
          Fiscal_year: defaultValues.Fiscal_year ?? new Date().getFullYear(),
          virtual_acc: defaultValues.virtual_acc ?? "",
          FILE_NAME: defaultValues.FILE_NAME ?? undefined,
          PPH: defaultValues.PPH ?? undefined,
          POSTING_DATE: defaultValues.POSTING_DATE ?? undefined,
          DOC_DATE: defaultValues.DOC_DATE ?? undefined,
          VALUE_DATE: defaultValues.VALUE_DATE ?? undefined,
          ALTERNATIVE_ACC: defaultValues.ALTERNATIVE_ACC ?? undefined,
          SEGMEN: defaultValues.SEGMEN ?? undefined,
          FA: defaultValues.FA ?? undefined,
          CC: defaultValues.CC ?? undefined,
          PC: defaultValues.PC ?? undefined,
          INTERNAL_ORDER: defaultValues.INTERNAL_ORDER ?? undefined,
          ASSIGNMENT: defaultValues.ASSIGNMENT ?? undefined,
          VENDOR: defaultValues.VENDOR ?? undefined,
          CUSTOMER: defaultValues.CUSTOMER ?? undefined,
          WWRVC: defaultValues.WWRVC ?? undefined,
          KNDNR: defaultValues.KNDNR ?? undefined,
          WWPRD: defaultValues.WWPRD ?? undefined,
        });
      } else {
        reset({
          ...emptyDefaults,
          NO_DOK: transactionKey?.noDok ?? "",
          REVERSAL: (transactionKey?.reversal as "A" | "B") ?? "A",
          REFERENCE: transactionKey?.reference ?? undefined,
        });
      }
    }
  }, [open, defaultValues, reset, transactionKey]);

  const onSubmit = (data: PostingAssetLegacyFormData) => {
    if (
      isEdit &&
      defaultValues &&
      transactionKey &&
      defaultValues.indeks != null
    ) {
      updateMutation.mutate({
        reversal: transactionKey.reversal,
        noDok: transactionKey.noDok,
        reference: transactionKey.reference,
        indeks: String(defaultValues.indeks),
        data,
      });
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
          ? "Update the invoice legacy record."
          : "Fill in the details to create a new invoice legacy record."
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
                  <Label htmlFor="FILE_NAME">File Name</Label>
                  <Input
                    id="FILE_NAME"
                    {...register("FILE_NAME")}
                    placeholder="Max 16 chars"
                    maxLength={16}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="RECORD_NUMBER">Record Number</Label>
                  <Input
                    id="RECORD_NUMBER"
                    type="number"
                    {...register("RECORD_NUMBER")}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="TCODE">
                    Transaction Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="TCODE"
                    {...register("TCODE")}
                    placeholder="Max 4 chars"
                    maxLength={4}
                  />
                  {errors.TCODE && (
                    <p className="text-xs text-destructive">
                      {errors.TCODE.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="virtual_acc">Virtual Account</Label>
                  <Input
                    id="virtual_acc"
                    {...register("virtual_acc")}
                    placeholder="Max 16 chars"
                    maxLength={16}
                  />
                </div>
              </div>
            </div>

            {/* Document Information */}
            <div className="rounded-lg border p-4">
              <h4 className="mb-3 font-semibold text-foreground">
                Document Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="DOC_TYPE">
                    Document Type <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="DOC_TYPE"
                    {...register("DOC_TYPE")}
                    placeholder="Max 2 chars"
                    maxLength={2}
                  />
                  {errors.DOC_TYPE && (
                    <p className="text-xs text-destructive">
                      {errors.DOC_TYPE.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="REFERENCE">Reference</Label>
                  <Input
                    id="REFERENCE"
                    {...register("REFERENCE")}
                    placeholder="Max 50 chars"
                    maxLength={50}
                  />
                </div>
                <div className="space-y-1">
                  <Label>
                    Reversal Flag <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="REVERSAL"
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
                </div>
                <div className="space-y-1">
                  <Label htmlFor="NO_DOK">
                    Document Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="NO_DOK"
                    {...register("NO_DOK")}
                    placeholder="Max 25 chars"
                    maxLength={25}
                  />
                  {errors.NO_DOK && (
                    <p className="text-xs text-destructive">
                      {errors.NO_DOK.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="POSTING_DATE">Posting Date</Label>
                  <Input
                    id="POSTING_DATE"
                    {...register("POSTING_DATE")}
                    placeholder="YYYYMMDD or YYYY-MM-DD"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="DOC_DATE">Document Date</Label>
                  <Input
                    id="DOC_DATE"
                    {...register("DOC_DATE")}
                    placeholder="YYYYMMDD or YYYY-MM-DD"
                  />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="rounded-lg border p-4">
              <h4 className="mb-3 font-semibold text-foreground">
                Financial Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="ACCOUNT">
                    Account <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="ACCOUNT"
                    {...register("ACCOUNT")}
                    placeholder="Max 10 chars"
                    maxLength={10}
                  />
                  {errors.ACCOUNT && (
                    <p className="text-xs text-destructive">
                      {errors.ACCOUNT.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="ALTERNATIVE_ACC">Alternative Account</Label>
                  <Input
                    id="ALTERNATIVE_ACC"
                    {...register("ALTERNATIVE_ACC")}
                    placeholder="Max 10 chars"
                    maxLength={10}
                  />
                </div>
                <div className="space-y-1">
                  <Label>
                    Type <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="DEBIT_KREDIT"
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
                          <SelectItem value="D">Debit</SelectItem>
                          <SelectItem value="K">Credit</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="AMOUNT">
                    Amount <span className="text-destructive">*</span>
                  </Label>
                  <Input id="AMOUNT" {...register("AMOUNT")} />
                  {errors.AMOUNT && (
                    <p className="text-xs text-destructive">
                      {errors.AMOUNT.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="PPH">PPH</Label>
                  <Input
                    id="PPH"
                    {...register("PPH")}
                    placeholder="Max 5 chars"
                    maxLength={5}
                  />
                </div>
              </div>
            </div>

            {/* Organization Information */}
            <div className="rounded-lg border p-4">
              <h4 className="mb-3 font-semibold text-foreground">
                Organization Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="BA">
                    Business Area <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="BA"
                    {...register("BA")}
                    placeholder="Max 4 chars"
                    maxLength={4}
                  />
                  {errors.BA && (
                    <p className="text-xs text-destructive">
                      {errors.BA.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="SEGMEN">Segment</Label>
                  <Input
                    id="SEGMEN"
                    {...register("SEGMEN")}
                    placeholder="Max 5 chars"
                    maxLength={5}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="FA">Fixed Asset Number</Label>
                  <Input
                    id="FA"
                    {...register("FA")}
                    placeholder="Max 7 chars"
                    maxLength={7}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="CC">Cost Center</Label>
                  <Input
                    id="CC"
                    {...register("CC")}
                    placeholder="Max 10 chars"
                    maxLength={10}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="PC">Profit Center</Label>
                  <Input
                    id="PC"
                    {...register("PC")}
                    placeholder="Max 10 chars"
                    maxLength={10}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="ASSIGNMENT">Assignment</Label>
                  <Input
                    id="ASSIGNMENT"
                    {...register("ASSIGNMENT")}
                    placeholder="Max 16 chars"
                    maxLength={16}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="INTERNAL_ORDER">Internal Order</Label>
                  <Input id="INTERNAL_ORDER" {...register("INTERNAL_ORDER")} />
                </div>
              </div>
            </div>

            {/* Partner Information */}
            <div className="rounded-lg border p-4">
              <h4 className="mb-3 font-semibold text-foreground">
                Partner Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="VENDOR">Vendor</Label>
                  <Input
                    id="VENDOR"
                    {...register("VENDOR")}
                    placeholder="Max 6 chars"
                    maxLength={6}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="CUSTOMER">Customer</Label>
                  <Input
                    id="CUSTOMER"
                    {...register("CUSTOMER")}
                    placeholder="Max 6 chars"
                    maxLength={6}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="KNDNR">KNDNR</Label>
                  <Input
                    id="KNDNR"
                    {...register("KNDNR")}
                    placeholder="Max 6 chars"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>

            {/* SAP Information */}
            <div className="rounded-lg border p-4">
              <h4 className="mb-3 font-semibold text-foreground">
                SAP Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="Fiscal_year">Fiscal Year</Label>
                  <Input
                    id="Fiscal_year"
                    type="number"
                    {...register("Fiscal_year")}
                    placeholder="e.g. 2024"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="WWRVC">WWRVC</Label>
                  <Input
                    id="WWRVC"
                    {...register("WWRVC")}
                    placeholder="Max 10 chars"
                    maxLength={10}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="WWPRD">WWPRD</Label>
                  <Input
                    id="WWPRD"
                    {...register("WWPRD")}
                    placeholder="Max 6 chars"
                    maxLength={6}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="VALUE_DATE">Value Date</Label>
                  <Input
                    id="VALUE_DATE"
                    {...register("VALUE_DATE")}
                    placeholder="YYYYMMDD or YYYY-MM-DD"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
