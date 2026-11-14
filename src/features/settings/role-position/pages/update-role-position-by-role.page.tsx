import { DataNotFoundPage } from "@/features/errors";
import {
  ROLE_POSITION_LIST_PAGE_TITLE,
  ROLE_POSITION_UPDATE_PERMISSION,
  ROLE_POSITION_URL,
  RolePositionReverseForm,
  rolePositionDetailByRoleUrl,
  rolePositionUpdateByRoleUrl,
  useRolePositionDetailByRole,
} from "@/features/settings/role-position";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { ProgressLoader } from "@railfinance/core/components/loader";
import { useNavigate, useParams } from "react-router";

export function UpdateRolePositionByRolePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const roleId = id ? Number.parseInt(id, 10) : null;

  const { data: detailData, isLoading } = useRolePositionDetailByRole(roleId!);

  if (isLoading) {
    return (
      <Page
        type="base"
        title="Edit Role Position (By Role)"
        permission={ROLE_POSITION_UPDATE_PERMISSION}
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

  return (
    <Page
      type="base"
      title="Edit Role Position (By Role)"
      permission={ROLE_POSITION_UPDATE_PERMISSION}
      breadcrumbs={[
        { title: "Settings", url: "#" },
        { title: ROLE_POSITION_LIST_PAGE_TITLE, url: ROLE_POSITION_URL },
        {
          title: detail.role?.name || "Detail",
          url: rolePositionDetailByRoleUrl(roleId!),
        },
        {
          title: "Edit Role Position (By Role)",
          url: rolePositionUpdateByRoleUrl(roleId!),
        },
      ]}
    >
      <PageHeader title="Edit Role Position (By Role)" />

      <div className="mt-6">
        <RolePositionReverseForm
          data={detail}
          isEditing
          onSuccess={() => navigate(rolePositionDetailByRoleUrl(roleId!))}
          onCancel={() => navigate(rolePositionDetailByRoleUrl(roleId!))}
        />
      </div>
    </Page>
  );
}

export default UpdateRolePositionByRolePage;
