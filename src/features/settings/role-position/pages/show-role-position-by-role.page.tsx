import { DataNotFoundPage } from "@/features/errors";
import {
  ROLE_POSITION_LIST_PAGE_TITLE,
  ROLE_POSITION_READ_PERMISSION,
  ROLE_POSITION_URL,
  RolePositionDetailByRole,
  rolePositionDetailByRoleUrl,
  rolePositionUpdateByRoleUrl,
  rolePositionUrl,
  useRolePositionDetailByRole,
} from "@/features/settings/role-position";
import { ActionButton } from "@railfinance/core/components/actions";
import { Page } from "@railfinance/core/components/page-shell";
import { ProgressLoader } from "@railfinance/core/components/loader";
import { useNavigate, useParams } from "react-router";

export function ShowRolePositionByRolePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const roleId = id ? Number.parseInt(id, 10) : null;

  const { data: detailData, isLoading } = useRolePositionDetailByRole(roleId!);

  const handleBack = () => {
    navigate(rolePositionUrl());
  };

  const handleEdit = () => {
    if (roleId) {
      navigate(rolePositionUpdateByRoleUrl(roleId));
    }
  };

  if (isLoading) {
    return (
      <Page
        type="base"
        title="View Role Position (By Role)"
        permission={ROLE_POSITION_READ_PERMISSION}
        breadcrumbs={[
          { title: "Settings", url: "#" },
          { title: ROLE_POSITION_LIST_PAGE_TITLE, url: ROLE_POSITION_URL },
          { title: "Loading...", url: "#" },
        ]}
      >
        <div className="flex items-center justify-center h-96">
          <ProgressLoader />
        </div>
      </Page>
    );
  }

  if (!detailData?.data) {
    return <DataNotFoundPage title="Role Position Not Found" />;
  }

  const detail = detailData.data;
  const roleTitle = detail.role
    ? `${detail.role.code} - ${detail.role.name}`
    : "Role Position";

  return (
    <Page
      type="base"
      title="View Role Position (By Role)"
      permission={ROLE_POSITION_READ_PERMISSION}
      breadcrumbs={[
        { title: "Settings", url: "#" },
        { title: ROLE_POSITION_LIST_PAGE_TITLE, url: ROLE_POSITION_URL },
        {
          title: roleTitle,
          url: rolePositionDetailByRoleUrl(roleId!),
        },
      ]}
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <ActionButton variant="back" showLabel onClick={handleBack} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                View Role Position (By Role)
              </h1>
            </div>
          </div>
          <ActionButton
            variant="edit"
            buttonVariant="success-outline"
            showLabel
            onClick={handleEdit}
            label="Edit"
            permission={ROLE_POSITION_READ_PERMISSION}
          />
        </div>

        <RolePositionDetailByRole data={detail} />
      </div>
    </Page>
  );
}

export default ShowRolePositionByRolePage;
