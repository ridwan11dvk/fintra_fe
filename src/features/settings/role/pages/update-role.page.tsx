import { DataNotFoundPage } from "@/features/errors";
import {
  ROLE_LIST_PAGE_TITLE,
  ROLE_UPDATE_PAGE_TITLE,
  ROLE_UPDATE_PERMISSION,
  ROLE_URL,
  RoleForm,
  SETTING_SECTION_TITLE,
  roleDetailUrl,
  roleUpdateUrl,
  useRole,
} from "@/features/settings";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { ProgressLoader } from "@railfinance/core/components/loader";
import { useNavigate, useParams } from "react-router";

export function UpdateRolePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const roleId = id ? Number.parseInt(id, 10) : null;

  const { data: roleData, isLoading } = useRole(Number(roleId));

  if (isLoading) {
    return (
      <Page
        type="base"
        title={ROLE_UPDATE_PAGE_TITLE}
        permission={ROLE_UPDATE_PERMISSION}
        breadcrumbs={[
          { title: SETTING_SECTION_TITLE, url: "#" },
          { title: ROLE_LIST_PAGE_TITLE, url: ROLE_URL },
          { title: ROLE_UPDATE_PAGE_TITLE, url: "#" },
        ]}
      >
        <div className="flex items-center justify-center h-96">
          <ProgressLoader />
        </div>
      </Page>
    );
  }

  if (!roleData?.data) {
    return <DataNotFoundPage title="Role Not Found" />;
  }

  const role = roleData.data;

  return (
    <Page
      type="base"
      title={ROLE_UPDATE_PAGE_TITLE}
      permission={ROLE_UPDATE_PERMISSION}
      breadcrumbs={[
        { title: SETTING_SECTION_TITLE, url: "#" },
        { title: ROLE_LIST_PAGE_TITLE, url: ROLE_URL },
        { title: role.name, url: roleDetailUrl(role.id) },
        { title: ROLE_UPDATE_PAGE_TITLE, url: roleUpdateUrl(role.id) },
      ]}
    >
      <PageHeader title="Edit Role" />

      <div className="mt-6">
        <RoleForm
          role={role}
          onSuccess={() => navigate(roleDetailUrl(role.id))}
          onCancel={() => navigate(roleDetailUrl(role.id))}
        />
      </div>
    </Page>
  );
}

export default UpdateRolePage;
