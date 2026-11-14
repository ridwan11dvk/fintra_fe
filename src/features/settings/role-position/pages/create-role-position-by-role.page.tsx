import {
  ROLE_POSITION_CREATE_PERMISSION,
  ROLE_POSITION_LIST_PAGE_TITLE,
  ROLE_POSITION_URL,
  RolePositionReverseForm,
  rolePositionUrl,
} from "@/features/settings/role-position";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useNavigate } from "react-router";

export function CreateRolePositionByRolePage() {
  const navigate = useNavigate();

  return (
    <Page
      type="base"
      title="Add Role Position (By Role)"
      permission={ROLE_POSITION_CREATE_PERMISSION}
      breadcrumbs={[
        { title: "Settings", url: "#" },
        { title: ROLE_POSITION_LIST_PAGE_TITLE, url: ROLE_POSITION_URL },
        { title: "Add Role Position (By Role)", url: rolePositionUrl() },
      ]}
    >
      <PageHeader title="Add Role Position (By Role)" />

      <div className="mt-6">
        <RolePositionReverseForm
          onSuccess={() => navigate(rolePositionUrl())}
          onCancel={() => navigate(rolePositionUrl())}
        />
      </div>
    </Page>
  );
}

export default CreateRolePositionByRolePage;
