import {
  genderOptions,
  internalUserCreateSchema,
  internalUserSchema,
  useGetInternalUserByNippMutation,
  USER_CREATE_PERMISSION,
  USER_UPDATE_PERMISSION,
  type InternalUserFormData,
  type InternalUserResponse,
} from "@/features/settings";

import { useFilteredRoles } from "@/features/settings";
import { FormTextField } from "@/features/settings/users/components/user-form-fields";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@railfinance/core";
import { ActionButton } from "@railfinance/core/components/actions";
import {
  DatePicker,
  PasswordInput,
  QuerySelect,
} from "@railfinance/core/components/input";
import { useIsMobile } from "@railfinance/core/hooks";
import {
  cn,
  getZodErrorMessage,
  setFormErrorsFromApi,
  toast,
} from "@railfinance/core/lib";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@railfinance/core/ui/card";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as UISelect,
} from "@railfinance/core/ui/select";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface InternalUserFormProps {
  action: "create" | "edit";
  onSubmit: (data: InternalUserFormData) => void;
  onCancel?: () => void;
  defaultValues?: Partial<InternalUserFormData>;
  isLoading?: boolean;
  submitError?: Error | null;
}

function toDate(value: string | undefined | null): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function fromDate(date: Date | undefined): string | undefined {
  if (!date) return undefined;
  // Use the local calendar components instead of toISOString() so the day is not
  // shifted by the timezone offset.
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function FieldLabel({
  children,
  required,
  htmlFor,
}: Readonly<{ children: string; required?: boolean; htmlFor?: string }>) {
  return (
    <Label htmlFor={htmlFor} className="text-sm font-medium w-40 pt-2 shrink-0">
      {children} {required && <span className="text-destructive">*</span>}
    </Label>
  );
}

export function InternalUserForm({
  action,
  onSubmit,
  onCancel,
  defaultValues,
  isLoading = false,
  submitError,
}: Readonly<InternalUserFormProps>) {
  const { data: rolesData, isLoading: isLoadingRoles } = useFilteredRoles();
  const { user } = useAuth();
  const roles = (rolesData?.data || []).map((role) => ({
    value: String(role.id),
    label: role.name,
    description: role.description ?? role.name,
  }));

  // External accounts carry no company information, so they cannot seed the
  // company defaults of this internal-user form.
  const currentUser: InternalUserResponse | null =
    user && "nipp" in user ? user : null;
  const getUserByNippMutation = useGetInternalUserByNippMutation({
    onSuccess: (response) => {
      if (response.status === "SUCCESS" && response.data) {
        toast.success("User data fetched successfully from ESA");
        const d = response.data;
        reset(
          {
            ...getValues(),
            nipp: d.nipp || getValues("nipp") || "",
            name: d.name || "",
            email: d.email || "",
            phoneNumber: d.phoneNumber || "",
            photo: d.photo || "",
            companyCode: d.companyCode || "",
            companyName: d.companyName || "",
            directorateCode: d.directorateCode || "",
            directorateName: d.directorateName || "",
            directorateNomenclature: d.directorateNomenclature || "",
            personalAreaCode: d.personalAreaCode || "",
            personalAreaName: d.personalAreaName || "",
            businessAreaCode: d.businessAreaCode || "",
            businessAreaName: d.businessAreaName || "",
            organizationCode: d.organizationCode || "",
            organizationName: d.organizationName || "",
            organizationNomenclature: d.organizationNomenclature || "",
            costCenterCode: d.costCenterCode || "",
            costCenterName: d.costCenterName || "",
            corsaCode: d.corsaCode || "",
            corsaName: d.corsaName || "",
            corsaNomenclature: d.corsaNomenclature || "",
            jobCode: d.jobCode || "",
            jobName: d.jobName || "",
            jobFamilyCode: d.jobFamilyCode || "",
            jobFamilyName: d.jobFamilyName || "",
            subJobFamilyCode: d.subJobFamilyCode || "",
            subJobFamilyName: d.subJobFamilyName || "",
            grade: d.grade || "",
            positionCode: d.positionCode || "",
            positionName: d.positionName || "",
            positionNomenclature: d.positionNomenclature || "",
            workerGroupCode: d.workerGroupCode || "",
            workerGroupName: d.workerGroupName || "",
            subWorkerGroupCode: d.subWorkerGroupCode || "",
            subWorkerGroupName: d.subWorkerGroupName || "",
            tempSupervisorNipp: d.tempSupervisorNipp || "",
            tempSupervisorName: d.tempSupervisorName || "",
            supervisorLevelOneNipp: d.supervisorLevelOneNipp || "",
            supervisorLevelOneName: d.supervisorLevelOneName || "",
            supervisorLevelOnePosition: d.supervisorLevelOnePosition || "",
            supervisorLevelTwoNipp: d.supervisorLevelTwoNipp || "",
            supervisorLevelTwoName: d.supervisorLevelTwoName || "",
            supervisorLevelTwoPosition: d.supervisorLevelTwoPosition || "",
            employmentStartDate: d.employmentStartDate || "",
            mutationDate: d.mutationDate || "",
            gender: d.genderName || "",
            beginningDate: d.beginningDate || "",
            endingDate: d.endingDate ?? "",
            recordingDate: d.recordingDate || "",
            stat2: d.stat2 || "",
            psCode: d.psCode || "",
            psText: d.psText || "",
            psGroup: d.psGroup || "",
          },
          { keepFieldsRef: true },
        );
      }
    },
  });

  const formSchema =
    action === "create" ? internalUserCreateSchema : internalUserSchema;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    getValues,
    setError,
  } = useForm<z.input<typeof formSchema>, unknown, z.output<typeof formSchema>>(
    {
      resolver: zodResolver(formSchema),
      defaultValues: {
        ...defaultValues,
        companyCode:
          defaultValues?.companyCode ?? currentUser?.companyCode ?? "",
        companyName:
          defaultValues?.companyName ?? currentUser?.companyName ?? "",
      },
    },
  );
  const isMobile = useIsMobile();

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [errors]);

  useEffect(() => {
    setFormErrorsFromApi(submitError, setError);
  }, [submitError, setError]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        {/* Employee Identification */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Identification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:gap-4">
              <FieldLabel required>NIPP</FieldLabel>
              <div className="flex-1 flex gap-2 w-full">
                <div className="flex-1 space-y-1">
                  <Input
                    id="nipp"
                    placeholder="Input NIPP"
                    {...register("nipp")}
                    aria-invalid={!!errors.nipp}
                    disabled={isLoading}
                  />
                  {errors.nipp && (
                    <p className="text-sm text-destructive">
                      {errors.nipp.message}
                    </p>
                  )}
                </div>
                <ActionButton
                  type="button"
                  variant="generate"
                  label="Get Data"
                  tooltip="Fetch data from ESA"
                  showLabel={!isMobile}
                  onClick={() => {
                    const nipp = getValues("nipp");
                    if (nipp) {
                      getUserByNippMutation.mutate(nipp);
                    } else {
                      toast.error("Please enter NIPP first");
                    }
                  }}
                  disabled={isLoading || getUserByNippMutation.isPending}
                />
              </div>
            </div>

            {/* Status */}
            {/* <div className="flex flex-col md:flex-row items-start md:gap-4">
              <FieldLabel required>Status</FieldLabel>
              <div className="flex-1 space-y-1 w-full">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <UISelect
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <SelectTrigger
                        id="status"
                        className={cn(
                          "w-full",
                          errors.status && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Choose status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </UISelect>
                  )}
                />
                {errors.status && (
                  <p className="text-sm text-destructive">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div> */}
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormTextField
              id="name"
              label="Name"
              required
              {...register("name")}
              error={errors.name}
              disabled={isLoading}
            />
            <FormTextField
              id="email"
              label="Email"
              required
              {...register("email")}
              error={errors.email}
              disabled={isLoading}
            />
            <FormTextField
              id="phoneNumber"
              label="Phone Number"
              {...register("phoneNumber")}
              error={errors.phoneNumber}
              disabled={isLoading}
            />
            <FormTextField
              id="nik"
              label="NIK"
              {...register("nik")}
              error={errors.nik}
              disabled={isLoading}
            />
            <div className="flex flex-col md:flex-row items-start md:gap-4">
              <FieldLabel>Date of Birth</FieldLabel>
              <div className="flex-1 space-y-1 w-full">
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={toDate(field.value)}
                      onChange={(date) => field.onChange(fromDate(date))}
                      disabled={isLoading}
                    />
                  )}
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-destructive">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>
            </div>
            <FormTextField
              id="placeOfBirth"
              label="Place of Birth"
              {...register("placeOfBirth")}
              error={errors.placeOfBirth}
              disabled={isLoading}
            />
            <FormTextField
              id="privyId"
              label="Privy ID"
              {...register("privyId")}
              error={errors.privyId}
              disabled={isLoading}
            />
            {/* Gender */}
            <div className="flex flex-col md:flex-row items-start md:gap-4">
              <FieldLabel htmlFor="gender">Gender</FieldLabel>
              <div className="flex-1 space-y-1 w-full">
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <UISelect
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <SelectTrigger
                        id="gender"
                        className={cn(
                          "w-full",
                          errors.gender && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </UISelect>
                  )}
                />
                {errors.gender && (
                  <p className="text-sm text-destructive">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roles & Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Roles & Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:gap-4">
              <FieldLabel required>Password</FieldLabel>
              <div className="flex-1 space-y-1 w-full">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <PasswordInput
                      id="password"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Enter password"
                      disabled={isLoading}
                      aria-invalid={!!errors.password}
                    />
                  )}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {getZodErrorMessage(errors.password)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:gap-4">
              <FieldLabel required>Confirm Password</FieldLabel>
              <div className="flex-1 space-y-1 w-full">
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <PasswordInput
                      id="confirmPassword"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Enter password"
                      disabled={isLoading}
                      aria-invalid={!!errors.password}
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {getZodErrorMessage(errors.confirmPassword)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:gap-4">
              <FieldLabel required>Roles</FieldLabel>
              <div className="flex-1 space-y-1 w-full">
                <Controller
                  name="roles"
                  control={control}
                  render={({ field }) => (
                    <QuerySelect
                      id="roles"
                      multiple
                      value={field.value.map(String) || []}
                      onValueChange={(value) =>
                        field.onChange(value.map(Number))
                      }
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company & Directorate */}
        <Card>
          <CardHeader>
            <CardTitle>Company &amp; Directorate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormTextField
              id="companyCode"
              label="Company Code"
              required
              {...register("companyCode")}
              error={errors.companyCode}
              placeholder="e.g. C001"
              disabled={isLoading}
            />
            <FormTextField
              id="companyName"
              label="Company Name"
              required
              {...register("companyName")}
              error={errors.companyName}
              disabled={isLoading}
            />
            <FormTextField
              id="directorateCode"
              label="Directorate Code"
              {...register("directorateCode")}
              error={errors.directorateCode}
              placeholder="e.g. D001"
              disabled={isLoading}
            />
            <FormTextField
              id="directorateName"
              label="Directorate Name"
              {...register("directorateName")}
              error={errors.directorateName}
              disabled={isLoading}
            />
            <FormTextField
              id="directorateNomenclature"
              label="Directorate Nomenclature"
              {...register("directorateNomenclature")}
              error={errors.directorateNomenclature}
              disabled={isLoading}
            />
            <FormTextField
              id="personalAreaCode"
              label="Personal Area Code"
              {...register("personalAreaCode")}
              error={errors.personalAreaCode}
              placeholder="e.g. PA001"
              disabled={isLoading}
            />
            <FormTextField
              id="personalAreaName"
              label="Personal Area Name"
              {...register("personalAreaName")}
              error={errors.personalAreaName}
              disabled={isLoading}
            />
            <FormTextField
              id="businessAreaCode"
              label="Business Area Code"
              {...register("businessAreaCode")}
              error={errors.businessAreaCode}
              placeholder="e.g. BA001"
              disabled={isLoading}
            />
            <FormTextField
              id="businessAreaName"
              label="Business Area Name"
              {...register("businessAreaName")}
              error={errors.businessAreaName}
              disabled={isLoading}
            />
          </CardContent>
        </Card>

        {/* Job Information */}
        <Card>
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormTextField
              id="jobCode"
              label="Job Code"
              {...register("jobCode")}
              error={errors.jobCode}
              placeholder="e.g. J001"
              disabled={isLoading}
            />
            <FormTextField
              id="jobName"
              label="Job Name"
              {...register("jobName")}
              error={errors.jobName}
              disabled={isLoading}
            />
            <FormTextField
              id="positionCode"
              label="Position Code"
              required
              {...register("positionCode")}
              error={errors.positionCode}
              placeholder="e.g. P001"
              disabled={isLoading}
            />
            <FormTextField
              id="positionName"
              label="Position Name"
              required
              {...register("positionName")}
              error={errors.positionName}
              disabled={isLoading}
            />
            <FormTextField
              id="positionNomenclature"
              label="Position Nomenclature"
              {...register("positionNomenclature")}
              placeholder="e.g. PN001"
              error={errors.positionNomenclature}
              disabled={isLoading}
            />
            <FormTextField
              id="jobFamilyCode"
              label="Job Family Code"
              {...register("jobFamilyCode")}
              error={errors.jobFamilyCode}
              placeholder="e.g. JF001"
              disabled={isLoading}
            />
            <FormTextField
              id="jobFamilyName"
              label="Job Family Name"
              {...register("jobFamilyName")}
              error={errors.jobFamilyName}
              disabled={isLoading}
            />
            <FormTextField
              id="subJobFamilyCode"
              label="Sub Job Family Code"
              {...register("subJobFamilyCode")}
              error={errors.subJobFamilyCode}
              placeholder="e.g. SJF001"
              disabled={isLoading}
            />
            <FormTextField
              id="subJobFamilyName"
              label="Sub Job Family Name"
              {...register("subJobFamilyName")}
              error={errors.subJobFamilyName}
              disabled={isLoading}
            />
            <FormTextField
              id="grade"
              label="Grade"
              {...register("grade")}
              error={errors.grade}
              placeholder="e.g. 5A"
              disabled={isLoading}
            />
          </CardContent>
        </Card>

        {/* Organization Unit */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Unit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormTextField
              id="organizationCode"
              label="Organization Code"
              {...register("organizationCode")}
              error={errors.organizationCode}
              placeholder="e.g. O001"
              disabled={isLoading}
            />
            <FormTextField
              id="organizationName"
              label="Organization Name"
              {...register("organizationName")}
              error={errors.organizationName}
              disabled={isLoading}
            />
            <FormTextField
              id="organizationNomenclature"
              label="Organization Nomenclature"
              {...register("organizationNomenclature")}
              error={errors.organizationNomenclature}
              disabled={isLoading}
            />
            <FormTextField
              id="costCenterCode"
              label="Cost Center Code"
              {...register("costCenterCode")}
              error={errors.costCenterCode}
              placeholder="e.g. CC001"
              disabled={isLoading}
            />
            <FormTextField
              id="costCenterName"
              label="Cost Center Name"
              {...register("costCenterName")}
              error={errors.costCenterName}
              disabled={isLoading}
            />
            <FormTextField
              id="corsaCode"
              label="Corsa Code"
              {...register("corsaCode")}
              error={errors.corsaCode}
              placeholder="e.g. CR001"
              disabled={isLoading}
            />
            <FormTextField
              id="corsaName"
              label="Corsa Name"
              {...register("corsaName")}
              error={errors.corsaName}
              disabled={isLoading}
            />
            <FormTextField
              id="corsaNomenclature"
              label="Corsa Nomenclature"
              {...register("corsaNomenclature")}
              error={errors.corsaNomenclature}
              disabled={isLoading}
            />
          </CardContent>
        </Card>

        {/* Worker Group */}
        <Card>
          <CardHeader>
            <CardTitle>Worker Group</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormTextField
              id="workerGroupCode"
              label="Worker Group Code"
              {...register("workerGroupCode")}
              error={errors.workerGroupCode}
              placeholder="e.g. WG001"
              disabled={isLoading}
            />
            <FormTextField
              id="workerGroupName"
              label="Worker Group Name"
              {...register("workerGroupName")}
              error={errors.workerGroupName}
              disabled={isLoading}
            />
            <FormTextField
              id="subWorkerGroupCode"
              label="Sub Worker Group Code"
              {...register("subWorkerGroupCode")}
              error={errors.subWorkerGroupCode}
              placeholder="e.g. SWG001"
              disabled={isLoading}
            />
            <FormTextField
              id="subWorkerGroupName"
              label="Sub Worker Group Name"
              {...register("subWorkerGroupName")}
              error={errors.subWorkerGroupName}
              disabled={isLoading}
            />
          </CardContent>
        </Card>

        {/* Supervisor Information */}
        <Card>
          <CardHeader>
            <CardTitle>Supervisor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormTextField
              id="tempSupervisorNipp"
              label="Temp Supervisor NIPP"
              {...register("tempSupervisorNipp")}
              error={errors.tempSupervisorNipp}
              disabled={isLoading}
            />
            <FormTextField
              id="tempSupervisorName"
              label="Temp Supervisor Name"
              {...register("tempSupervisorName")}
              error={errors.tempSupervisorName}
              disabled={isLoading}
            />
            <FormTextField
              id="supervisorLevelOneNipp"
              label="Supervisor L1 NIPP"
              {...register("supervisorLevelOneNipp")}
              error={errors.supervisorLevelOneNipp}
              disabled={isLoading}
            />
            <FormTextField
              id="supervisorLevelOneName"
              label="Supervisor L1 Name"
              {...register("supervisorLevelOneName")}
              error={errors.supervisorLevelOneName}
              disabled={isLoading}
            />
            <FormTextField
              id="supervisorLevelOnePosition"
              label="Supervisor L1 Position"
              {...register("supervisorLevelOnePosition")}
              error={errors.supervisorLevelOnePosition}
              disabled={isLoading}
            />
            <FormTextField
              id="supervisorLevelTwoNipp"
              label="Supervisor L2 NIPP"
              {...register("supervisorLevelTwoNipp")}
              error={errors.supervisorLevelTwoNipp}
              disabled={isLoading}
            />
            <FormTextField
              id="supervisorLevelTwoName"
              label="Supervisor L2 Name"
              {...register("supervisorLevelTwoName")}
              error={errors.supervisorLevelTwoName}
              disabled={isLoading}
            />
            <FormTextField
              id="supervisorLevelTwoPosition"
              label="Supervisor L2 Position"
              {...register("supervisorLevelTwoPosition")}
              error={errors.supervisorLevelTwoPosition}
              disabled={isLoading}
            />
          </CardContent>
        </Card>

        {/* Employment Dates */}
        <Card>
          <CardHeader>
            <CardTitle>Employment Dates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:gap-4">
              <FieldLabel>Employment Start Date</FieldLabel>
              <div className="flex-1 space-y-1 w-full">
                <Controller
                  name="employmentStartDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={toDate(field.value)}
                      onChange={(date) => field.onChange(fromDate(date))}
                      disabled={isLoading}
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:gap-4">
              <FieldLabel>Beginning Date</FieldLabel>
              <div className="flex-1 space-y-1 w-full">
                <Controller
                  name="beginningDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={toDate(field.value)}
                      onChange={(date) => field.onChange(fromDate(date))}
                      disabled={isLoading}
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:gap-4">
              <FieldLabel>Ending Date</FieldLabel>
              <div className="flex-1 space-y-1 w-full">
                <Controller
                  name="endingDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={toDate(field.value)}
                      onChange={(date) => field.onChange(fromDate(date))}
                      disabled={isLoading}
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:gap-4">
              <FieldLabel>Mutation Date</FieldLabel>
              <div className="flex-1 space-y-1 w-full">
                <Controller
                  name="mutationDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={toDate(field.value)}
                      onChange={(date) => field.onChange(fromDate(date))}
                      disabled={isLoading}
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:gap-4">
              <FieldLabel>Recording Date</FieldLabel>
              <div className="flex-1 space-y-1 w-full">
                <Controller
                  name="recordingDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={toDate(field.value)}
                      onChange={(date) => field.onChange(fromDate(date))}
                      disabled={isLoading}
                    />
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
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
      </div>
    </form>
  );
}

export default InternalUserForm;
