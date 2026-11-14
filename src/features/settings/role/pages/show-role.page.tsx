import { DataNotFoundPage } from "@/features/errors";
import {
  ROLE_LIST_PAGE_TITLE,
  ROLE_READ_PERMISSION,
  ROLE_UPDATE_PERMISSION,
  ROLE_URL,
  roleDetailUrl,
  roleUpdateUrl,
  roleUrl,
  useRoleFullDetail,
} from "@/features/settings";
import type { ModulePermissionGroup, PermissionResponse } from "@railfinance/core/masterdata";
import { Accordion, AccordionCard } from "@railfinance/core/ui/accordion";
import { ActionButton } from "@railfinance/core/components/actions";
import { Badge } from "@railfinance/core/ui/badge";
import { Label } from "@railfinance/core/ui/label";
import { Page } from "@railfinance/core/components/page-shell";
import { Separator } from "@railfinance/core/ui/separator";
import { StatusBadge } from "@railfinance/core/components/badges";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@railfinance/core/ui/tabs";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

function FeaturePermissionGroupView({
  feature,
  permissions,
}: Readonly<{ feature: string; permissions: PermissionResponse[] }>) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-3 bg-muted/30 hover:bg-muted/50 cursor-pointer"
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
      >
        <span
          className="flex items-center justify-center w-5 h-5 text-muted-foreground hover:text-foreground"
          aria-hidden="true"
        >
          {expanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </span>
        <span className="font-semibold text-sm">{feature}</span>
        <Badge variant="secondary">
          {permissions.length} permission{permissions.length === 1 ? "" : "s"}
        </Badge>
      </button>
      {expanded && (
        <ul className="ml-10">
          {permissions.map((perm) => (
            <li
              key={perm.id}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 border-t first:border-t-0"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {perm.description || "-"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {perm.name}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ModulePermissionTab({
  moduleGroup,
}: Readonly<{ moduleGroup: ModulePermissionGroup }>) {
  const totalPermissions = useMemo(
    () =>
      moduleGroup.features.reduce((sum, f) => sum + f.permissions.length, 0),
    [moduleGroup.features],
  );

  return (
    <div className="rounded-md border bg-background">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {moduleGroup.module?.name || "Uncategorized"} Permissions
        </h3>
        <span className="text-sm text-muted-foreground">
          {totalPermissions} permission{totalPermissions === 1 ? "" : "s"}
        </span>
      </div>

      <div className="overflow-x-auto">
        {moduleGroup.features.length === 0 && (
          <div className="px-4 py-8 text-center text-muted-foreground">
            No permissions assigned for this module
          </div>
        )}
        {moduleGroup.features.map((featureGroup) => (
          <FeaturePermissionGroupView
            key={featureGroup.featureId ?? featureGroup.feature}
            feature={featureGroup.feature}
            permissions={featureGroup.permissions}
          />
        ))}
      </div>
    </div>
  );
}

export function ShowRolePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const roleId = id ? Number.parseInt(id, 10) : null;

  const { data: roleData, isLoading } = useRoleFullDetail(roleId!);
  const [selectedModuleTab, setSelectedModuleTab] = useState<string>("");

  const handleBack = () => {
    navigate(roleUrl());
  };

  const handleEdit = (roleId: number) => {
    navigate(roleUpdateUrl(roleId));
  };

  if (isLoading) {
    return <Page type="base" title="Loading role data" isLoading />;
  }

  if (!roleData?.data) {
    return <DataNotFoundPage title="Role Not Found" />;
  }

  const role = roleData.data;
  const modulePermissions = role.modulePermissions || [];

  return (
    <Page
      type="base"
      title={role.name}
      permission={ROLE_READ_PERMISSION}
      breadcrumbs={[
        { title: ROLE_LIST_PAGE_TITLE, url: ROLE_URL },
        { title: role.name, url: roleDetailUrl(role.id) },
      ]}
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <ActionButton variant="back" showLabel onClick={handleBack} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{role.name}</h1>
              </div>
              <p className="text-muted-foreground">{role.description}</p>
            </div>
          </div>
          <ActionButton
            variant="edit"
            buttonVariant="success-outline"
            showLabel
            onClick={() => handleEdit(role.id)}
            label="Edit Role"
            permission={ROLE_UPDATE_PERMISSION}
          />
        </div>

        <Accordion type="multiple" defaultValue={["role-info"]}>
          <AccordionCard trigger="Role Information" value="role-info">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Role Name</Label>
                  <div>{role.name}</div>
                </div>

                <div className="space-y-2">
                  <Label>Role Code</Label>
                  <div>{role.code}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <div>
                    {role.company
                      ? `${role.company.name}`
                      : role.companyCode || "-"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Business Area Assignment</Label>
                  <div>
                    {role.businessAreas && role.businessAreas.length > 0
                      ? role.businessAreas.map((ba) => (
                          <Badge key={ba.id} variant="outline">
                            {ba.name}
                          </Badge>
                        ))
                      : "-"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <StatusBadge status={role.isActive ? "active" : "inactive"} />
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <div>{role.type || "-"}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Description</Label>
                  <div>{role.description}</div>
                </div>
              </div>
            </div>
          </AccordionCard>
        </Accordion>

        {/* Module Permission Tabs */}
        {modulePermissions.length > 0 && (
          <Tabs
            value={
              selectedModuleTab ||
              String(modulePermissions[0].module?.id || "uncategorized")
            }
            onValueChange={setSelectedModuleTab}
            className="w-full"
          >
            <div className="w-full relative flex items-center justify-center">
              <Separator className="absolute inset-0 top-1/2" />

              <TabsList variant="boxed">
                {modulePermissions.map((mp) => (
                  <TabsTrigger
                    key={mp.module?.id || "uncategorized"}
                    value={String(mp.module?.id || "uncategorized")}
                    className="bg-background"
                  >
                    {mp.module?.name || "Uncategorized"}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {modulePermissions.map((mp) => (
              <TabsContent
                key={mp.module?.id || "uncategorized"}
                value={String(mp.module?.id || "uncategorized")}
                className="mt-4"
              >
                <ModulePermissionTab moduleGroup={mp} />
              </TabsContent>
            ))}
          </Tabs>
        )}

        {modulePermissions.length === 0 && (
          <div className="rounded-md border bg-background px-4 py-8 text-center text-muted-foreground">
            No permissions assigned to this role
          </div>
        )}
      </div>
    </Page>
  );
}

export default ShowRolePage;
