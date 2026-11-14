/* eslint-disable react-hooks/incompatible-library */
import {
  partnerTaxProfileSchema,
  useCreatePartnerTaxProfileMutation,
  useUpdatePartnerTaxProfileMutation,
  type PartnerTaxProfile,
  type PartnerTaxProfileFormData,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { Textarea } from "@railfinance/core/ui/textarea";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface PartnerTaxProfileFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  partnerId: number;
  defaultValues?: Partial<PartnerTaxProfile>;
  onSuccess?: (data?: PartnerTaxProfile) => void;
}

type FormData = z.input<typeof partnerTaxProfileSchema>;

export function PartnerTaxProfileFormModal({
  open,
  onOpenChange,
  mode,
  partnerId = 0,
  defaultValues,
  onSuccess,
}: Readonly<PartnerTaxProfileFormModalProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(partnerTaxProfileSchema),
    defaultValues: {
      taxpayerName: defaultValues?.taxpayerName || "",
      vatStatus: defaultValues?.vatStatus || "",
      address: defaultValues?.address || "",
      taxableEmployerNo: defaultValues?.taxableEmployerNo || "",
      npwpNumber: defaultValues?.npwpNumber || "",
      npwpDocument: defaultValues?.npwpDocument || "",
      nitkuNumber: defaultValues?.nitkuNumber || "",
      document: defaultValues?.document || "",
      classification: defaultValues?.classification || "",
      vatRate: defaultValues?.vatRate || "",
      wapuStatus: defaultValues?.wapuStatus || "",
      isTaxExempt: defaultValues?.isTaxExempt ?? false,
      exemptDocument: defaultValues?.exemptDocument || "",
    },
  });

  const isTaxExempt = watch("isTaxExempt");

  const createMutation = useCreatePartnerTaxProfileMutation(partnerId, {
    onSuccess: (data) => {
      reset();
      onOpenChange(false);
      onSuccess?.(data.data);
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdatePartnerTaxProfileMutation(partnerId, {
    onSuccess: (data) => {
      reset();
      onOpenChange(false);
      onSuccess?.(data.data);
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const submitForm = handleSubmit((values) => {
    // After validation by zodResolver, values match the output type
    const outputData = values as PartnerTaxProfileFormData;
    if (mode === "create") {
      createMutation.mutate(outputData);
    } else if (mode === "edit" && defaultValues?.id) {
      updateMutation.mutate({
        taxProfileId: defaultValues.id,
        data: outputData,
      });
    }
  });

  useEffect(() => {
    if (open) {
      reset({
        taxpayerName: defaultValues?.taxpayerName || "",
        vatStatus: defaultValues?.vatStatus || "",
        address: defaultValues?.address || "",
        taxableEmployerNo: defaultValues?.taxableEmployerNo || "",
        npwpNumber: defaultValues?.npwpNumber || "",
        npwpDocument: defaultValues?.npwpDocument || "",
        nitkuNumber: defaultValues?.nitkuNumber || "",
        document: defaultValues?.document || "",
        classification: defaultValues?.classification || "",
        vatRate: defaultValues?.vatRate || "",
        wapuStatus: defaultValues?.wapuStatus || "",
        isTaxExempt: defaultValues?.isTaxExempt ?? false,
        exemptDocument: defaultValues?.exemptDocument || "",
      });
    }
  }, [open, defaultValues, reset]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add Tax Profile" : "Edit Tax Profile"}
      description={
        mode === "create"
          ? "Create the tax profile for this partner"
          : "Edit the tax profile of this partner"
      }
      onConfirm={submitForm}
      isLoading={isLoading}
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="taxpayerName">Taxpayer Name</Label>
          <Input
            id="taxpayerName"
            {...register("taxpayerName")}
            placeholder="e.g., PT Kereta Api Indonesia"
            className={cn(errors.taxpayerName && "border-red-500")}
            disabled={isLoading}
          />
          {errors.taxpayerName && (
            <p className="text-sm text-red-500">
              {errors.taxpayerName.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="npwpNumber">NPWP Number</Label>
            <Input
              id="npwpNumber"
              {...register("npwpNumber")}
              placeholder="e.g., 01.234.567.8-999.000"
              className={cn(errors.npwpNumber && "border-red-500")}
              disabled={isLoading}
            />
            {errors.npwpNumber && (
              <p className="text-sm text-red-500">{errors.npwpNumber.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nitkuNumber">NITKU Number</Label>
            <Input
              id="nitkuNumber"
              {...register("nitkuNumber")}
              placeholder="e.g., 01.234.567.8-999.000"
              className={cn(errors.nitkuNumber && "border-red-500")}
              disabled={isLoading}
            />
            {errors.nitkuNumber && (
              <p className="text-sm text-red-500">{errors.nitkuNumber.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="taxableEmployerNo">Taxable Employer Number</Label>
            <Input
              id="taxableEmployerNo"
              {...register("taxableEmployerNo")}
              placeholder="e.g., 01.234.567.8-999.000.000"
              className={cn(errors.taxableEmployerNo && "border-red-500")}
              disabled={isLoading}
            />
            {errors.taxableEmployerNo && (
              <p className="text-sm text-red-500">
                {errors.taxableEmployerNo.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="vatStatus">VAT Status</Label>
            <Input
              id="vatStatus"
              {...register("vatStatus")}
              placeholder="e.g., PKP"
              className={cn(errors.vatStatus && "border-red-500")}
              disabled={isLoading}
            />
            {errors.vatStatus && (
              <p className="text-sm text-red-500">{errors.vatStatus.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="vatRate">VAT Rate</Label>
            <Input
              id="vatRate"
              {...register("vatRate")}
              placeholder="e.g., 11"
              className={cn(errors.vatRate && "border-red-500")}
              disabled={isLoading}
            />
            {errors.vatRate && (
              <p className="text-sm text-red-500">{errors.vatRate.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="classification">Classification</Label>
            <Input
              id="classification"
              {...register("classification")}
              placeholder="e.g., BADAN"
              className={cn(errors.classification && "border-red-500")}
              disabled={isLoading}
            />
            {errors.classification && (
              <p className="text-sm text-red-500">
                {errors.classification.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="wapuStatus">WAPU Status</Label>
            <Input
              id="wapuStatus"
              {...register("wapuStatus")}
              placeholder="e.g., WAPU"
              className={cn(errors.wapuStatus && "border-red-500")}
              disabled={isLoading}
            />
            {errors.wapuStatus && (
              <p className="text-sm text-red-500">
                {errors.wapuStatus.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tpAddress">Tax Address</Label>
          <Textarea
            id="tpAddress"
            {...register("address")}
            placeholder="Registered tax address"
            className={cn(errors.address && "border-red-500")}
            disabled={isLoading}
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address.message}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="isTaxExempt"
            checked={isTaxExempt}
            onCheckedChange={(checked) =>
              setValue("isTaxExempt", checked as boolean)
            }
            disabled={isLoading}
          />
          <Label htmlFor="isTaxExempt" className="cursor-pointer">
            Tax exempt
          </Label>
        </div>

        {isTaxExempt && (
          <div className="space-y-2">
            <Label htmlFor="exemptDocument">Exempt Document</Label>
            <Input
              id="exemptDocument"
              {...register("exemptDocument")}
              placeholder="Document path or reference"
              className={cn(errors.exemptDocument && "border-red-500")}
              disabled={isLoading}
            />
            {errors.exemptDocument && (
              <p className="text-sm text-red-500">
                {errors.exemptDocument.message}
              </p>
            )}
          </div>
        )}
      </form>
    </Modal>
  );
}

export default PartnerTaxProfileFormModal;
