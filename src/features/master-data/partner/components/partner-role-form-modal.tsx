import {
  partnerRoleSchema,
  useCreatePartnerRoleMutation,
  useUpdatePartnerRoleMutation,
  type PartnerRole,
  type PartnerRoleFormData,
  type PartnerRoleRequest,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuerySelect as Combobox } from "@railfinance/core/components/input";
import { Modal } from "@railfinance/core/components/modal";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import {
  useGetCompanyOptions,
  useGetLookupValueOptions,
} from "@railfinance/core/masterdata";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@railfinance/core/ui/select";
import { Textarea } from "@railfinance/core/ui/textarea";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

const ROLE_STATUSES = ["ACTIVE", "INACTIVE", "BLACKLISTED"] as const;

interface PartnerRoleFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  partnerId: number;
  defaultValues?: Partial<PartnerRole>;
  onSuccess?: (data?: PartnerRole) => void;
}

export function PartnerRoleFormModal({
  open,
  onOpenChange,
  mode,
  partnerId,
  defaultValues,
  onSuccess,
}: Readonly<PartnerRoleFormModalProps>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
    setValue,
  } = useForm({
    resolver: zodResolver(partnerRoleSchema),
    defaultValues: {
      type: defaultValues?.type ?? "",
      companyCode: defaultValues?.companyCode ?? "",
      status: (defaultValues?.status as (typeof ROLE_STATUSES)[number]) ?? null,
      blacklistReason: defaultValues?.blacklistReason ?? "",
      blacklistDocument: defaultValues?.blacklistDocument ?? "",
    },
  });

  const [blacklistFile, setBlacklistFile] = useState<File | null>(null);

  const status = useWatch({ control, name: "status" });

  const createMutation = useCreatePartnerRoleMutation(partnerId, {
    onSuccess: (data) => {
      reset();
      onOpenChange(false);
      onSuccess?.(data?.data);
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdatePartnerRoleMutation(partnerId, {
    onSuccess: (data) => {
      reset();
      onOpenChange(false);
      onSuccess?.(data?.data);
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const { data: roleTypeOptions } = useGetLookupValueOptions("PARTNER_ROLE", {
    enabled: open,
  });

  const { data: companiesData } = useGetCompanyOptions();

  const submitForm = handleSubmit((data: PartnerRoleFormData) => {
    const payload: PartnerRoleRequest = {
      partnerId,
      type: data.type,
      companyCode: data.companyCode || null,
      status: data.status ?? null,
      blacklistReason: data.blacklistReason || null,
      blacklistDocument: blacklistFile ? null : data.blacklistDocument || null,
      file: blacklistFile,
    };

    if (mode === "create") {
      createMutation.mutate(payload);
    } else if (defaultValues?.id) {
      updateMutation.mutate({ roleId: defaultValues.id, data: payload });
    }
  });

  useEffect(() => {
    if (open) {
      reset({
        type: defaultValues?.type ?? "",
        companyCode: defaultValues?.companyCode ?? "",
        status:
          (defaultValues?.status as (typeof ROLE_STATUSES)[number]) ?? null,
        blacklistReason: defaultValues?.blacklistReason ?? "",
        blacklistDocument: defaultValues?.blacklistDocument ?? "",
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBlacklistFile(null);
    }
  }, [open, reset, mode, defaultValues]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add Partner Role" : "Edit Partner Role"}
      description={
        mode === "create"
          ? "Assign a role (vendor, mitra, or customer) to this partner"
          : "Edit role information for this partner"
      }
      onConfirm={submitForm}
      isLoading={isLoading}
    >
      <form className="space-y-4">
        {/* Role Type */}
        <div className="space-y-2">
          <Label htmlFor="roleType">
            Role Type <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isLoading}
              >
                <SelectTrigger id="roleType" className="w-full">
                  <SelectValue placeholder="Select role type" />
                </SelectTrigger>
                <SelectContent>
                  {roleTypeOptions?.data?.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.alias ?? option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && (
            <p className="text-sm text-red-500">{errors.type.message}</p>
          )}
        </div>

        {/* Company Code */}
        <div className="space-y-2">
          <Label htmlFor="roleCompanyCode">Company</Label>
          <Controller
            name="companyCode"
            control={control}
            render={({ field }) => (
              <Combobox
                id="roleCompanyCode"
                options={
                  companiesData?.data?.map((company) => ({
                    value: company.alias ?? company.value,
                    label: company.label,
                    description: company.description ?? "",
                  })) ?? []
                }
                value={field.value || null}
                onValueChange={(val) => field.onChange(val || "")}
                placeholder="Select company"
                disabled={isLoading}
                aria-invalid={!!errors.companyCode}
              />
            )}
          />
          {errors.companyCode && (
            <p className="text-sm text-red-500">{errors.companyCode.message}</p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="roleStatus">Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ?? ""}
                onValueChange={(value) =>
                  field.onChange(value === "" ? null : value)
                }
                disabled={isLoading}
              >
                <SelectTrigger id="roleStatus" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_STATUSES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>

        {/* Blacklist info - only relevant for blacklisted roles */}
        {status === "BLACKLISTED" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="roleBlacklistReason">Blacklist Reason</Label>
              <Textarea
                id="roleBlacklistReason"
                placeholder="Explain why this role is blacklisted..."
                rows={3}
                {...register("blacklistReason")}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roleBlacklistDocument">Blacklist Document</Label>
              <Input
                id="roleBlacklistDocument"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setBlacklistFile(file);
                    setValue("blacklistDocument", file.name);
                  }
                }}
                disabled={isLoading}
                className={cn(errors.blacklistDocument && "border-red-500")}
              />
              {(blacklistFile || defaultValues?.blacklistDocument) && (
                <p className="text-sm text-gray-600">
                  Selected:{" "}
                  {blacklistFile?.name ?? defaultValues?.blacklistDocument}
                </p>
              )}
              {errors.blacklistDocument && (
                <p className="text-sm text-red-500">
                  {errors.blacklistDocument.message}
                </p>
              )}
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}

export default PartnerRoleFormModal;
