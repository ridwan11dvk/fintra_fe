import {
  externalUserSchema,
  useFilteredRoles,
  USER_CREATE_PERMISSION,
  USER_UPDATE_PERMISSION,
  userTypeOptions,
  type ExternalUserFormData,
} from "@/features/settings";
import {
  FormFieldRow,
  FormTextField,
  UserFormSection,
} from "@/features/settings/users/components/user-form-fields";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionButton } from "@railfinance/core/components/actions";
import { cn, getZodErrorMessage } from "@railfinance/core/lib";
import { DatePicker, QuerySelect } from "@railfinance/core/components/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as UISelect,
} from "@railfinance/core/ui/select";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface ExternalUserFormProps {
  action: "create" | "edit";
  onSubmit: (data: ExternalUserFormData) => void;
  onCancel?: () => void;
  defaultValues?: Partial<ExternalUserFormData>;
  isLoading?: boolean;
}

/**
 * Converts a local Date to an ISO calendar date (YYYY-MM-DD). Uses the local calendar
 * components instead of toISOString() so the day is not shifted by the timezone offset.
 */
function toIsoDate(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function ExternalUserForm({
  action,
  onSubmit,
  onCancel,
  defaultValues,
  isLoading = false,
}: Readonly<ExternalUserFormProps>) {
  const { data: rolesData, isLoading: isLoadingRoles } = useFilteredRoles();

  const roles = (rolesData?.data || []).map((role) => ({
    value: String(role.id),
    label: role.name,
    description: role.description ?? role.name,
  }));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<
    z.input<typeof externalUserSchema>,
    unknown,
    ExternalUserFormData
  >({
    resolver: zodResolver(externalUserSchema),
    defaultValues: {
      userType: "",
      name: "",
      email: "",
      username: "",
      ...(action === "create" && { password: "" }),
      roles: [],
      phoneNumber: "",
      dateOfBirth: "",
      placeOfBirth: "",
      privyId: "",
      photo: "",
      nik: "",
      npwp: "",
      ktpFile: "",
      npwpFile: "",
      address: "",
      companyCode: "",
      companyName: "",
      businessAreaCode: "",
      businessAreaName: "",
      supervisorPositionCode: "",
      supervisorPositionName: "",
      responsibleName: "",
      responsibleEmail: "",
      responsibleNik: "",
      responsibleAddress: "",
      purpose: "",
      startDate: "",
      endDate: "",
      twoFactorEnabled: false,
      otpSecret: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <UserFormSection title="Account Information">
        <FormFieldRow
          label="User Type"
          required
          error={errors.userType}
        >
          <Controller
            name="userType"
            control={control}
            render={({ field }) => (
              <UISelect
                value={field.value || ""}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  className={cn(errors.userType && "border-destructive")}
                >
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  {userTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </UISelect>
            )}
          />
        </FormFieldRow>

        <FormTextField
          id="username"
          label="Username"
          required
          placeholder="Enter username"
          error={errors.username}
          disabled={isLoading}
          {...register("username")}
        />

        {action === "create" && (
          <FormTextField
            id="password"
            label="Password"
            type="password"
            required
            placeholder="Enter password (minimum 8 characters)"
            error={errors.password}
            disabled={isLoading}
            {...register("password")}
          />
        )}

        <FormFieldRow label="Roles" required error={errors.roles}>
          <Controller
            name="roles"
            control={control}
            render={({ field }) => (
              <QuerySelect
                multiple
                value={field.value || []}
                onValueChange={(value) => field.onChange(value.map(Number))}
                options={roles}
                placeholder="Select roles..."
                disabled={isLoading || isLoadingRoles}
                aria-invalid={!!errors.roles}
              />
            )}
          />
          {errors.roles && (
            <p className="text-sm text-destructive">
              {getZodErrorMessage(errors.roles)}
            </p>
          )}
        </FormFieldRow>
      </UserFormSection>

      <UserFormSection title="Personal Information">
        <FormTextField
          id="name"
          label="Name"
          required
          placeholder="Enter full name"
          error={errors.name}
          disabled={isLoading}
          {...register("name")}
        />

        <FormTextField
          id="email"
          label="Email"
          type="email"
          required
          placeholder="Enter email address"
          error={errors.email}
          disabled={isLoading}
          {...register("email")}
        />

        <FormTextField
          id="phoneNumber"
          label="Phone number"
          placeholder="Enter phone number"
          error={errors.phoneNumber}
          disabled={isLoading}
          {...register("phoneNumber")}
        />
      </UserFormSection>

      <UserFormSection title="Identity Information">
        <FormTextField
          id="nik"
          label="NIK"
          placeholder="Enter NIK"
          error={errors.nik}
          disabled={isLoading}
          {...register("nik")}
        />

        <FormFieldRow label="Date of Birth" error={errors.dateOfBirth}>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => {
                  field.onChange(date ? toIsoDate(date) : "");
                }}
                placeholder="Select date of birth"
                disabled={isLoading}
              />
            )}
          />
        </FormFieldRow>

        <FormTextField
          id="placeOfBirth"
          label="Place of Birth"
          placeholder="Enter place of birth"
          error={errors.placeOfBirth}
          disabled={isLoading}
          {...register("placeOfBirth")}
        />

        <FormTextField
          id="npwp"
          label="NPWP"
          placeholder="Enter NPWP"
          error={errors.npwp}
          disabled={isLoading}
          {...register("npwp")}
        />

        <FormTextField
          id="address"
          label="Address"
          placeholder="Enter address"
          error={errors.address}
          disabled={isLoading}
          {...register("address")}
        />

        <FormTextField
          id="privyId"
          label="Privy ID"
          placeholder="Enter Privy ID"
          error={errors.privyId}
          disabled={isLoading}
          {...register("privyId")}
        />
      </UserFormSection>

      <UserFormSection title="Organization Information">
        <FormTextField
          id="companyCode"
          label="Company Code"
          placeholder="Enter company code"
          error={errors.companyCode}
          disabled={isLoading}
          {...register("companyCode")}
        />

        <FormTextField
          id="companyName"
          label="Company Name"
          placeholder="Enter company name"
          error={errors.companyName}
          disabled={isLoading}
          {...register("companyName")}
        />

        <FormTextField
          id="partnerCode"
          label="Partner Code"
          placeholder="Enter partner code"
          error={errors.partnerCode}
          disabled={isLoading}
          {...register("partnerCode")}
        />

        <FormTextField
          id="businessAreaCode"
          label="Business Area Code"
          placeholder="Enter business area code"
          error={errors.businessAreaCode}
          disabled={isLoading}
          {...register("businessAreaCode")}
        />

        <FormTextField
          id="businessAreaName"
          label="Business Area Name"
          placeholder="Enter business area name"
          error={errors.businessAreaName}
          disabled={isLoading}
          {...register("businessAreaName")}
        />

        <FormTextField
          id="supervisorPositionCode"
          label="Supervisor Position Code"
          placeholder="Enter supervisor position code"
          error={errors.supervisorPositionCode}
          disabled={isLoading}
          {...register("supervisorPositionCode")}
        />

        <FormTextField
          id="supervisorPositionName"
          label="Supervisor Position Name"
          placeholder="Enter supervisor position name"
          error={errors.supervisorPositionName}
          disabled={isLoading}
          {...register("supervisorPositionName")}
        />

        <FormTextField
          id="purpose"
          label="Purpose"
          placeholder="Enter access purpose"
          error={errors.purpose}
          disabled={isLoading}
          {...register("purpose")}
        />

        <FormFieldRow label="Start Date">
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => {
                  field.onChange(date ? toIsoDate(date) : "");
                }}
                placeholder="Select start date"
                disabled={isLoading}
              />
            )}
          />
        </FormFieldRow>

        <FormFieldRow label="End Date">
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => {
                  field.onChange(date ? toIsoDate(date) : "");
                }}
                placeholder="Select end date"
                disabled={isLoading}
              />
            )}
          />
        </FormFieldRow>
      </UserFormSection>

      <UserFormSection title="Responsible Person Information">
        <FormTextField
          id="responsibleName"
          label="Responsible Name"
          placeholder="Enter responsible person name"
          error={errors.responsibleName}
          disabled={isLoading}
          {...register("responsibleName")}
        />

        <FormTextField
          id="responsibleEmail"
          label="Responsible Email"
          type="email"
          placeholder="Enter responsible person email"
          error={errors.responsibleEmail}
          disabled={isLoading}
          {...register("responsibleEmail")}
        />

        <FormTextField
          id="responsibleNik"
          label="Responsible NIK"
          placeholder="Enter responsible person NIK"
          error={errors.responsibleNik}
          disabled={isLoading}
          {...register("responsibleNik")}
        />

        <FormTextField
          id="responsibleAddress"
          label="Responsible Address"
          placeholder="Enter responsible person address"
          error={errors.responsibleAddress}
          disabled={isLoading}
          {...register("responsibleAddress")}
        />
      </UserFormSection>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <ActionButton
            type="button"
            variant="cancel"
            showLabel
            onClick={onCancel}
            disabled={isLoading}
          />
        )}
        <ActionButton
          type="submit"
          variant="save"
          showLabel
          disabled={isLoading}
          label={isLoading ? "Saving..." : "Save"}
          permission={
            action === "create"
              ? USER_CREATE_PERMISSION
              : USER_UPDATE_PERMISSION
          }
        />
      </div>
    </form>
  );
}

export default ExternalUserForm;
