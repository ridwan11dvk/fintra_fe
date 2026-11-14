import { DataNotFoundPage, InvalidDataPage } from "@/features/errors";
import {
  INTERNAL_USER_DETAIL_PAGE_TITLE,
  INTERNAL_USER_LIST_PAGE_TITLE,
  SETTINGS_PAGE_TITLE,
  USER_LIST_PAGE_TITLE,
  USER_READ_PERMISSION,
  USER_UPDATE_PERMISSION,
  USER_URL,
  internalUserDetailUrl,
  internalUserEditUrl,
  useChangeInternalUserPasswordMutation,
  useGetInternalUser,
  type AdminChangePasswordFormData,
} from "@/features/settings";
import {
  UserDetailGrid,
  UserIdentityCard,
  UserInfoSection,
} from "@/features/settings/users/components/user-detail";
import {
  formatOptionalDate,
  hasUserDetailValues,
  type UserDetailEntry,
} from "@/features/settings/users/components/user-detail.utils";
import { ActionButton } from "@railfinance/core/components/actions";
import { Page } from "@railfinance/core/components/page-shell";
import { formatDate, toast, useGetProfilePicture } from "@railfinance/core/lib";
import { Badge } from "@railfinance/core/ui/badge";
import { Button } from "@railfinance/core/ui/button";
import {
  Briefcase,
  Building2,
  CalendarClock,
  History,
  IdCard,
  KeyRound,
  UserCog,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChangePasswordModal } from "../components/change-password-modal";

export function ShowInternalUserPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const userId = id ? Number.parseInt(id, 10) : null;

  const { data: userData, isLoading } = useGetInternalUser(userId!, {
    enabled: !!userId,
  });

  const { data: profilePict } = useGetProfilePicture(
    userData?.data?.photo,
    !!userData?.data?.photo,
  );

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const changePasswordMutation = useChangeInternalUserPasswordMutation({
    onSuccess: () => {
      toast.success("Password changed successfully");
      setChangePasswordOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to change password: ${error.message}`);
    },
  });
  if (!userId) {
    return (
      <InvalidDataPage title="View Internal User" message="Invalid user ID" />
    );
  }

  if (isLoading) {
    return <Page type="base" title="View Internal User" isLoading />;
  }

  if (!userData?.data) {
    return <DataNotFoundPage title="Internal User Not Found" />;
  }

  const user = userData.data;
  const roleNames =
    user.roles && user.roles.length > 0
      ? user.roles.map((role) => role.name).join(", ")
      : null;

  const personalEntries: UserDetailEntry[] = [
    { label: "Phone Number", value: user.phoneNumber },
    { label: "NIK", value: user.nik },
    { label: "Date of Birth", value: formatOptionalDate(user.dateOfBirth) },
    { label: "Place of Birth", value: user.placeOfBirth },
    { label: "Privy ID", value: user.privyId },
  ];

  const jobEntries: UserDetailEntry[] = [
    { label: "Job", value: user.jobName },
    { label: "Job Family", value: user.jobFamilyName },
    { label: "Sub Job Family", value: user.subJobFamilyName },
    { label: "Grade", value: user.grade },
    { label: "Position", value: user.positionName },
    { label: "Position Nomenclature", value: user.positionNomenclature },
    { label: "Roles", value: roleNames },
  ];

  const organizationEntries: UserDetailEntry[] = [
    { label: "Company", value: user.companyName },
    { label: "Directorate", value: user.directorateName },
    { label: "Directorate Nomenclature", value: user.directorateNomenclature },
    { label: "Personal Area", value: user.personalAreaName },
    { label: "Business Area", value: user.businessAreaName },
    { label: "Cost Center", value: user.costCenterName },
    { label: "Unit", value: user.organizationName },
    {
      label: "Organization Nomenclature",
      value: user.organizationNomenclature,
    },
    { label: "Corsa", value: user.corsaName },
    { label: "Corsa Nomenclature", value: user.corsaNomenclature },
  ];

  const workerGroupEntries: UserDetailEntry[] = [
    { label: "Worker Group", value: user.workerGroupName },
    { label: "Sub Worker Group", value: user.subWorkerGroupName },
  ];

  const employmentEntries: UserDetailEntry[] = [
    {
      label: "Employment Start Date",
      value: formatOptionalDate(user.employmentStartDate),
    },
    { label: "Beginning Date", value: formatOptionalDate(user.beginningDate) },
    { label: "Ending Date", value: formatOptionalDate(user.endingDate) },
    { label: "Mutation Date", value: formatOptionalDate(user.mutationDate) },
    {
      label: "Recording Date",
      value: formatOptionalDate(user.recordingDate, true),
    },
  ];

  const temporarySupervisorEntries: UserDetailEntry[] = [
    { label: "Temporary Supervisor", value: user.tempSupervisorName },
    { label: "Temporary Supervisor NIPP", value: user.tempSupervisorNipp },
  ];

  const supervisorEntries: UserDetailEntry[] = [
    { label: "Supervisor Level One", value: user.supervisorLevelOneName },
    { label: "Level One NIPP", value: user.supervisorLevelOneNipp },
    {
      label: "Level One Position",
      value: user.supervisorLevelOnePositionName,
    },
    { label: "Supervisor Level Two", value: user.supervisorLevelTwoName },
    { label: "Level Two NIPP", value: user.supervisorLevelTwoNipp },
    {
      label: "Level Two Position",
      value: user.supervisorLevelTwoPositionName,
    },
  ];

  const payrollEntries: UserDetailEntry[] = [
    { label: "Status", value: user.stat2 },
    { label: "Personnel Status", value: user.psText },
    { label: "Personnel Status Group", value: user.psGroup },
  ];

  const auditEntries: UserDetailEntry[] = [
    {
      label: "Created At",
      value: formatDate(user.createdAt, "DD/MM/YYYY", true),
    },
    { label: "Created By", value: user.createdBy },
    {
      label: "Updated At",
      value: formatDate(user.updatedAt, "DD/MM/YYYY", true),
    },
    { label: "Updated By", value: user.updatedBy },
  ];

  return (
    <Page
      type="base"
      title={INTERNAL_USER_DETAIL_PAGE_TITLE}
      permission={USER_READ_PERMISSION}
      breadcrumbs={[
        { title: SETTINGS_PAGE_TITLE, url: "#" },
        { title: USER_LIST_PAGE_TITLE, url: USER_URL },
        { title: INTERNAL_USER_LIST_PAGE_TITLE, url: USER_URL },
        { title: user.name, url: internalUserDetailUrl(user.id) },
      ]}
    >
      <div className="space-y-4">
        <UserIdentityCard
          name={user.name}
          email={user.email}
          photo={profilePict ?? user.photo}
          badges={
            <>
              <Badge variant="outline" className="gap-1.5">
                <span className="text-muted-foreground">NIPP</span>
                {user.nipp}
              </Badge>
              {user.twoFactorEnabled ? (
                <Badge
                  variant="success-outline"
                  className="bg-success/15 text-success border-success/20"
                >
                  2FA Enabled
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  2FA Disabled
                </Badge>
              )}
            </>
          }
          action={
            <>
              <ActionButton
                variant="back"
                showLabel
                onClick={() => navigate(-1)}
              />
              <Button
                variant="outline"
                onClick={() => setChangePasswordOpen(true)}
              >
                <KeyRound className="mr-2 h-4 w-4" />
                Change Password
              </Button>
              <ActionButton
                variant="edit"
                buttonVariant="success-outline"
                showLabel
                onClick={() => navigate(internalUserEditUrl(user.id))}
                permission={USER_UPDATE_PERMISSION}
              />
            </>
          }
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {hasUserDetailValues(personalEntries) && (
              <UserInfoSection
                title="Personal Information"
                icon={<UserRound className="size-4" />}
              >
                <UserDetailGrid entries={personalEntries} />
              </UserInfoSection>
            )}

            {hasUserDetailValues(jobEntries) && (
              <UserInfoSection
                title="Job Information"
                icon={<Briefcase className="size-4" />}
              >
                <UserDetailGrid entries={jobEntries} />
              </UserInfoSection>
            )}

            {hasUserDetailValues(organizationEntries) && (
              <UserInfoSection
                title="Organization Structure"
                icon={<Building2 className="size-4" />}
              >
                <UserDetailGrid entries={organizationEntries} />
              </UserInfoSection>
            )}

            {hasUserDetailValues(employmentEntries) && (
              <UserInfoSection
                title="Employment Details"
                icon={<CalendarClock className="size-4" />}
              >
                <UserDetailGrid entries={employmentEntries} />
              </UserInfoSection>
            )}

            {hasUserDetailValues(supervisorEntries) && (
              <UserInfoSection
                title="Supervisor Information"
                icon={<Users className="size-4" />}
              >
                <UserDetailGrid entries={supervisorEntries} />
              </UserInfoSection>
            )}

            {hasUserDetailValues(payrollEntries) && (
              <UserInfoSection
                title="Payroll Information"
                icon={<Wallet className="size-4" />}
              >
                <UserDetailGrid entries={payrollEntries} />
              </UserInfoSection>
            )}
          </div>

          <div className="space-y-4">
            <UserInfoSection
              title="Employment"
              icon={<UserCog className="size-4" />}
            >
              <UserDetailGrid
                entries={[
                  { label: "Gender", value: user.genderName },
                  {
                    label: "RKIP Input Period Until",
                    value: formatOptionalDate(user.rkipInputPeriodUntil),
                  },
                ]}
              />
            </UserInfoSection>

            {hasUserDetailValues(workerGroupEntries) && (
              <UserInfoSection
                title="Worker Group Information"
                icon={<IdCard className="size-4" />}
              >
                <UserDetailGrid entries={workerGroupEntries} />
              </UserInfoSection>
            )}

            {hasUserDetailValues(temporarySupervisorEntries) && (
              <UserInfoSection
                title="Temporary Supervisor"
                icon={<Users className="size-4" />}
              >
                <UserDetailGrid entries={temporarySupervisorEntries} />
              </UserInfoSection>
            )}

            <UserInfoSection
              title="Audit Information"
              icon={<History className="size-4" />}
            >
              <UserDetailGrid entries={auditEntries} />
            </UserInfoSection>
          </div>
        </div>
      </div>
      <ChangePasswordModal
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
        userName={user.name}
        onSubmit={(data: AdminChangePasswordFormData) => {
          changePasswordMutation.mutate({ id: user.id, data });
        }}
        isLoading={changePasswordMutation.isPending}
      />
    </Page>
  );
}

export default ShowInternalUserPage;
