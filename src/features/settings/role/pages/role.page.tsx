import {
  ROLE_CREATE_PERMISSION,
  ROLE_LIST_PAGE_TITLE,
  ROLE_LIST_PERMISSION,
  ROLE_URL,
  RoleList,
  SETTING_SECTION_TITLE,
  roleCreateUrl,
  roleDetailUrl,
  roleUpdateUrl,
} from "@/features/settings";
import { ActionButton } from "@railfinance/core/components/actions";
import { Page } from "@railfinance/core/components/page-shell";
import { type RoleResponse } from "@railfinance/core/masterdata";
import { useNavigate } from "react-router";

export function RolePage() {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate(roleCreateUrl());
  };

  const handleEdit = (role: RoleResponse) => {
    navigate(roleUpdateUrl(role.id));
  };

  const handleManagePermissions = (role: RoleResponse) => {
    navigate(roleDetailUrl(role.id));
  };

  return (
    <Page
      type="base"
      title={ROLE_LIST_PAGE_TITLE}
      permission={ROLE_LIST_PERMISSION}
      breadcrumbs={[
        { title: SETTING_SECTION_TITLE, url: "#" },
        { title: ROLE_LIST_PAGE_TITLE, url: ROLE_URL },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Role Management</h1>
            <p className="text-muted-foreground">
              Manage roles and their permissions
            </p>
          </div>
          <ActionButton
            variant="add"
            showLabel
            onClick={handleCreate}
            label="Create Role"
            permission={ROLE_CREATE_PERMISSION}
          />
        </div>

        <RoleList
          onEdit={handleEdit}
          onManagePermissions={handleManagePermissions}
        />
      </div>
    </Page>
  );
}

export default RolePage;
