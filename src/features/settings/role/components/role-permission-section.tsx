import { useGroupedPermissions } from "@/features/settings";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { type PermissionGroupResponse } from "@railfinance/core/masterdata";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface RolePermissionSectionProps {
  roleId?: number;
  moduleId: number;
  moduleName: string;
  isEditing: boolean;
  isPending: boolean;
  selectedPermissionIds: Set<number>;
  onPermissionToggle: (permissionId: number) => void;
}

export function RolePermissionSection({
  moduleId,
  moduleName,
  isPending,
  selectedPermissionIds,
  onPermissionToggle,
}: Readonly<RolePermissionSectionProps>) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(),
  );

  const { data: groupedData, isLoading: isLoadingPermissions } =
    useGroupedPermissions({ moduleId }, !!moduleId);

  const grouped: PermissionGroupResponse[] = groupedData?.data || [];

  /** Toggle expand/collapse for a group */
  const handleToggleExpand = (feature: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(feature)) {
        next.delete(feature);
      } else {
        next.add(feature);
      }
      return next;
    });
  };

  /** Toggle all permissions in a group */
  const handleToggleAll = (group: PermissionGroupResponse) => {
    const allSelected = group.allIds.every((id) =>
      selectedPermissionIds.has(id),
    );
    for (const id of group.allIds) {
      // Selecting the "all" box fills every gap; clearing it drops every hit.
      const isSelected = selectedPermissionIds.has(id);
      if (allSelected !== isSelected) continue;
      onPermissionToggle(id);
    }
  };

  /** Check state for the All checkbox: true / false / indeterminate */
  const getAllCheckState = (
    group: PermissionGroupResponse,
  ): boolean | "indeterminate" => {
    const selectedCount = group.allIds.filter((id) =>
      selectedPermissionIds.has(id),
    ).length;
    if (selectedCount === 0) return false;
    if (selectedCount === group.allIds.length) return true;
    return "indeterminate";
  };

  return (
    <div className="rounded-md border bg-background">
      <div className="px-4 py-3 border-b">
        <h3 className="text-lg font-semibold">{moduleName} Permissions</h3>
      </div>

      <div className="overflow-x-auto">
        {isLoadingPermissions && (
          <div className="px-4 py-8 text-center text-muted-foreground">
            Loading permissions...
          </div>
        )}
        {!isLoadingPermissions && grouped.length === 0 && (
          <div className="px-4 py-8 text-center text-muted-foreground">
            No permissions available for this module
          </div>
        )}
        {!isLoadingPermissions &&
          grouped.map((group) => {
            const allState = getAllCheckState(group);
            const isExpanded = expandedGroups.has(group.feature);

            return (
              <div key={group.featureId ?? group.feature} className="border-b last:border-b-0">
                {/* Feature Header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-muted/30 hover:bg-muted/50">
                  <button
                    type="button"
                    onClick={() => handleToggleExpand(group.feature)}
                    className="flex items-center justify-center w-5 h-5 text-muted-foreground hover:text-foreground"
                    disabled={isPending}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  <Checkbox
                    checked={allState}
                    onCheckedChange={() => handleToggleAll(group)}
                    disabled={isPending}
                  />
                  <span className="font-semibold text-sm">
                    {group.feature}
                  </span>
                </div>

                {/* Permission Items */}
                {isExpanded && (
                  <div className="ml-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {group.permissions.map((perm) => {
                      const isChecked = selectedPermissionIds.has(perm.id);
                      return (
                        <div
                          key={perm.id}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 border-t"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => onPermissionToggle(perm.id)}
                            disabled={isPending}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {perm.description || "-"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {perm.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default RolePermissionSection;
