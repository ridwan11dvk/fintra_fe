import { DataNotFoundPage, InvalidDataPage } from "@/features/errors";
import {
  EXTERNAL_USER_DETAIL_PAGE_TITLE,
  EXTERNAL_USER_LIST_PAGE_TITLE,
  SETTINGS_PAGE_TITLE,
  USER_LIST_PAGE_TITLE,
  USER_READ_PERMISSION,
  USER_UPDATE_PERMISSION,
  USER_URL,
  externalUserDetailUrl,
  externalUserEditUrl,
  useChangeExternalUserPasswordMutation,
  useGetExternalUser,
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
import { formatDate, toast } from "@railfinance/core/lib";
import { Badge } from "@railfinance/core/ui/badge";
import { Button } from "@railfinance/core/ui/button";
import {
  Building2,
  CalendarClock,
  History,
  IdCard,
  KeyRound,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChangePasswordModal } from "../components/change-password-modal";

export function ShowExternalUserPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const userId = id ? Number.parseInt(id, 10) : null;

  const { data: userData, isLoading } = useGetExternalUser(userId!, {
    enabled: !!userId,
  });

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const changePasswordMutation = useChangeExternalUserPasswordMutation({
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
      <InvalidDataPage title="View External User" message="Invalid user ID" />
    );
  }

  if (isLoading) {
    return <Page type="base" title="View External User" isLoading />;
  }

  if (!userData?.data) {
    return <DataNotFoundPage title="External User Not Found" />;
  }

  const user = userData.data;
  const roleNames =
    user.roles && user.roles.length > 0
      ? user.roles.map((role) => role.name).join(", ")
      : null;

  const identityEntries: UserDetailEntry[] = [
    { label: "NIK", value: user.nik },
    { label: "Date of Birth", value: formatOptionalDate(user.dateOfBirth) },
    { label: "Place of Birth", value: user.placeOfBirth },
    { label: "NPWP", value: user.npwp },
    { label: "Privy ID", value: user.privyId },
    { label: "KTP File", value: user.ktpFile },
    { label: "NPWP File", value: user.npwpFile },
    { label: "Address", value: user.address, full: true },
  ];

  const organizationEntries: UserDetailEntry[] = [
    { label: "Company Code", value: user.companyCode },
    { label: "Company Name", value: user.companyName },
    { label: "Partner Code", value: user.partnerCode },
    { label: "Business Area Code", value: user.businessAreaCode },
    { label: "Business Area Name", value: user.businessAreaName },
    { label: "Supervisor Position Code", value: user.supervisorPositionCode },
    { label: "Supervisor Position Name", value: user.supervisorPositionName },
    { label: "Purpose", value: user.purpose, full: true },
  ];

  const accessEntries: UserDetailEntry[] = [
    { label: "Start Date", value: formatOptionalDate(user.startDate) },
    { label: "End Date", value: formatOptionalDate(user.endDate) },
  ];

  const responsibleEntries: UserDetailEntry[] = [
    { label: "Responsible Name", value: user.responsibleName },
    { label: "Responsible Email", value: user.responsibleEmail },
    { label: "Responsible NIK", value: user.responsibleNik },
    {
      label: "Responsible Address",
      value: user.responsibleAddress,
      full: true,
    },
  ];

  const accountEntries: UserDetailEntry[] = [
    { label: "Username", value: user.username },
    { label: "Phone Number", value: user.phoneNumber },
    { label: "Roles", value: roleNames },
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
      title={EXTERNAL_USER_DETAIL_PAGE_TITLE}
      permission={USER_READ_PERMISSION}
      breadcrumbs={[
        { title: SETTINGS_PAGE_TITLE, url: "#" },
        { title: USER_LIST_PAGE_TITLE, url: USER_URL },
        { title: EXTERNAL_USER_LIST_PAGE_TITLE, url: USER_URL },
        { title: user.name, url: externalUserDetailUrl(user.id) },
      ]}
    >
      <div className="space-y-4">
        <UserIdentityCard
          name={user.name}
          email={user.email}
          photo={user.photo}
          badges={
            <>
              <Badge variant="outline">{user.userType}</Badge>
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
                onClick={() => navigate(externalUserEditUrl(user.id))}
                permission={USER_UPDATE_PERMISSION}
              />
            </>
          }
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {hasUserDetailValues(identityEntries) && (
              <UserInfoSection
                title="Identity Information"
                icon={<IdCard className="size-4" />}
              >
                <UserDetailGrid entries={identityEntries} />
              </UserInfoSection>
            )}

            {hasUserDetailValues(organizationEntries) && (
              <UserInfoSection
                title="Organization Information"
                icon={<Building2 className="size-4" />}
              >
                <UserDetailGrid entries={organizationEntries} />
              </UserInfoSection>
            )}

            {hasUserDetailValues(accessEntries) && (
              <UserInfoSection
                title="Access Period"
                icon={<CalendarClock className="size-4" />}
              >
                <UserDetailGrid entries={accessEntries} />
              </UserInfoSection>
            )}

            {hasUserDetailValues(responsibleEntries) && (
              <UserInfoSection
                title="Responsible Person"
                icon={<Users className="size-4" />}
              >
                <UserDetailGrid entries={responsibleEntries} />
              </UserInfoSection>
            )}
          </div>

          <div className="space-y-4">
            <UserInfoSection
              title="Account"
              icon={<UserCog className="size-4" />}
            >
              <UserDetailGrid entries={accountEntries} />
            </UserInfoSection>

            <UserInfoSection
              title="Security"
              icon={<ShieldCheck className="size-4" />}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  Two Factor Authentication
                </p>
                {user.twoFactorEnabled ? (
                  <Badge
                    variant="success-outline"
                    className="bg-success/15 text-success border-success/20"
                  >
                    Enabled
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    Disabled
                  </Badge>
                )}
              </div>
            </UserInfoSection>

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

export default ShowExternalUserPage;
