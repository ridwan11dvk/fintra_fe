import {
  partnerContactSchema,
  useCreatePartnerContactMutation,
  useUpdatePartnerContactMutation,
  type PartnerContact,
  type PartnerContactFormData,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@railfinance/core/components/modal";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface PartnerContactFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  partnerId: number;
  defaultValues?: Partial<PartnerContact>;
  onSuccess?: (data?: PartnerContact) => void;
}

type FormData = z.input<typeof partnerContactSchema>;

export function PartnerContactFormModal({
  open,
  onOpenChange,
  mode,
  partnerId = 0,
  defaultValues,
  onSuccess,
}: Readonly<PartnerContactFormModalProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(partnerContactSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      position: defaultValues?.position || "",
      department: defaultValues?.department || "",
      phoneNumber: defaultValues?.phoneNumber || "",
      email: defaultValues?.email || "",
      preferredCommChannel: defaultValues?.preferredCommChannel || "",
    },
  });

  const createMutation = useCreatePartnerContactMutation(partnerId, {
    onSuccess: (data) => {
      reset();
      onOpenChange(false);
      onSuccess?.(data.data);
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdatePartnerContactMutation(partnerId, {
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
    const outputData = values as PartnerContactFormData;
    if (mode === "create") {
      createMutation.mutate(outputData);
    } else if (mode === "edit" && defaultValues?.id) {
      updateMutation.mutate({
        contactId: defaultValues.id,
        data: outputData,
      });
    }
  });

  useEffect(() => {
    if (open) {
      reset({
        name: defaultValues?.name || "",
        position: defaultValues?.position || "",
        department: defaultValues?.department || "",
        phoneNumber: defaultValues?.phoneNumber || "",
        email: defaultValues?.email || "",
        preferredCommChannel: defaultValues?.preferredCommChannel || "",
      });
    }
  }, [open, defaultValues, reset]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add Contact" : "Edit Contact"}
      description={
        mode === "create"
          ? "Add a contact person for this partner"
          : "Edit contact person details"
      }
      onConfirm={submitForm}
      isLoading={isLoading}
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="e.g., John Doe"
            className={cn(errors.name && "border-red-500")}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            {...register("position")}
            placeholder="e.g., Purchasing Manager"
            className={cn(errors.position && "border-red-500")}
            disabled={isLoading}
          />
          {errors.position && (
            <p className="text-sm text-red-500">{errors.position.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            {...register("department")}
            placeholder="e.g., Procurement"
            className={cn(errors.department && "border-red-500")}
            disabled={isLoading}
          />
          {errors.department && (
            <p className="text-sm text-red-500">{errors.department.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            {...register("phoneNumber")}
            placeholder="e.g., 081234567890"
            type="tel"
            className={cn(errors.phoneNumber && "border-red-500")}
            disabled={isLoading}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            {...register("email")}
            placeholder="e.g., john.doe@company.com"
            className={cn(errors.email && "border-red-500")}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredCommChannel">
            Preferred Communication Channel
          </Label>
          <Input
            id="preferredCommChannel"
            {...register("preferredCommChannel")}
            placeholder="e.g., EMAIL, WHATSAPP"
            className={cn(errors.preferredCommChannel && "border-red-500")}
            disabled={isLoading}
          />
          {errors.preferredCommChannel && (
            <p className="text-sm text-red-500">
              {errors.preferredCommChannel.message}
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default PartnerContactFormModal;
