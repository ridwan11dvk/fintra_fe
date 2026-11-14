import {
  ROLE_POSITION_CREATE_PAGE_TITLE,
  ROLE_POSITION_CREATE_PERMISSION,
  ROLE_POSITION_LIST_PAGE_TITLE,
  ROLE_POSITION_URL,
  RolePositionForm,
  rolePositionUrl,
} from "@/features/settings/role-position";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useNavigate } from "react-router";

export function CreateRolePositionPage() {
  const navigate = useNavigate();

  return (
    <Page
      type="base"
      title={ROLE_POSITION_CREATE_PAGE_TITLE}
      permission={ROLE_POSITION_CREATE_PERMISSION}
      breadcrumbs={[
        { title: "Settings", url: "#" },
        { title: ROLE_POSITION_LIST_PAGE_TITLE, url: ROLE_POSITION_URL },
        { title: ROLE_POSITION_CREATE_PAGE_TITLE, url: rolePositionUrl() },
      ]}
    >
      <PageHeader title="Add Role Position" />

      <div className="mt-6">
        <RolePositionForm
          onSuccess={() => navigate(rolePositionUrl())}
          onCancel={() => navigate(rolePositionUrl())}
        />
      </div>
    </Page>
  );
}

export default CreateRolePositionPage;
