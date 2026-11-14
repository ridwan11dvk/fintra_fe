import {
  ROLE_CREATE_PAGE_TITLE,
  ROLE_CREATE_PERMISSION,
  ROLE_LIST_PAGE_TITLE,
  ROLE_URL,
  RoleForm,
  SETTING_SECTION_TITLE,
  roleCreateUrl,
} from "@/features/settings";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useNavigate } from "react-router";

export function CreateRolePage() {
  const navigate = useNavigate();

  return (
    <Page
      type="base"
      title={ROLE_CREATE_PAGE_TITLE}
      permission={ROLE_CREATE_PERMISSION}
      breadcrumbs={[
        { title: SETTING_SECTION_TITLE, url: "#" },
        { title: ROLE_LIST_PAGE_TITLE, url: ROLE_URL },
        { title: ROLE_CREATE_PAGE_TITLE, url: roleCreateUrl() },
      ]}
    >
      <PageHeader title="Create New Role" />

      <div className="mt-6">
        <RoleForm
          role={null}
          onSuccess={() => navigate(ROLE_URL)}
          onCancel={() => navigate(ROLE_URL)}
        />
      </div>
    </Page>
  );
}

export default CreateRolePage;
