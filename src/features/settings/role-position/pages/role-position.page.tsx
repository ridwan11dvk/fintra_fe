import {
  ROLE_POSITION_CREATE_PERMISSION,
  ROLE_POSITION_LIST_PAGE_TITLE,
  ROLE_POSITION_LIST_PERMISSION,
  ROLE_POSITION_URL,
  RolePositionGroupedList,
  RolePositionList,
  rolePositionCreateByRoleUrl,
  rolePositionCreateUrl,
  rolePositionDetailByRoleUrl,
  rolePositionDetailUrl,
  rolePositionUpdateByRoleUrl,
  rolePositionUpdateUrl,
  type RoleGroupedResponse,
  type RolePositionGroupedResponse,
} from "@/features/settings/role-position";
import { ActionButton } from "@railfinance/core/components/actions";
import { Page } from "@railfinance/core/components/page-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@railfinance/core/ui/tabs";
import { useState } from "react";
import { useNavigate } from "react-router";

export function RolePositionPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"position" | "role">("position");

  // Handlers for Position → Roles view
  const handleCreateByPosition = () => {
    navigate(rolePositionCreateUrl());
  };

  const handleViewByPosition = (item: RolePositionGroupedResponse) => {
    navigate(rolePositionDetailUrl(item.jobPositionId));
  };

  const handleEditByPosition = (item: RolePositionGroupedResponse) => {
    navigate(rolePositionUpdateUrl(item.jobPositionId));
  };

  // Handlers for Role → Positions view
  const handleCreateByRole = () => {
    navigate(rolePositionCreateByRoleUrl());
  };

  const handleViewByRole = (item: RoleGroupedResponse) => {
    navigate(rolePositionDetailByRoleUrl(item.roleId));
  };

  const handleEditByRole = (item: RoleGroupedResponse) => {
    navigate(rolePositionUpdateByRoleUrl(item.roleId));
  };

  return (
    <Page
      type="base"
      title={ROLE_POSITION_LIST_PAGE_TITLE}
      permission={ROLE_POSITION_LIST_PERMISSION}
      breadcrumbs={[
        { title: "Settings", url: "#" },
        { title: ROLE_POSITION_LIST_PAGE_TITLE, url: ROLE_POSITION_URL },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Role Position Management</h1>
          </div>
          <ActionButton
            variant="add"
            showLabel
            onClick={
              viewMode === "position"
                ? handleCreateByPosition
                : handleCreateByRole
            }
            label={
              viewMode === "position"
                ? "Add Role Position"
                : "Add Role Position (By Role)"
            }
            permission={ROLE_POSITION_CREATE_PERMISSION}
          />
        </div>

        {/* Tab Switcher */}
        <Tabs
          value={viewMode}
          onValueChange={(v) => setViewMode(v as "position" | "role")}
        >
          <TabsList>
            <TabsTrigger value="position">By Position</TabsTrigger>
            <TabsTrigger value="role">By Role</TabsTrigger>
          </TabsList>

          <TabsContent value="position" className="mt-4">
            <RolePositionList
              onView={handleViewByPosition}
              onEdit={handleEditByPosition}
            />
          </TabsContent>

          <TabsContent value="role" className="mt-4">
            <RolePositionGroupedList
              onView={handleViewByRole}
              onEdit={handleEditByRole}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Page>
  );
}

export default RolePositionPage;
