import type { PermissionResponse } from "@railfinance/core/masterdata";
import { Badge } from "@railfinance/core/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

interface PermissionGroup {
  feature: string;
  permissions: PermissionResponse[];
}

interface RolePermissionGroupedViewProps {
  permissions: PermissionResponse[];
  moduleName?: string;
}

function groupPermissionsByFeature(
  permissions: PermissionResponse[],
): PermissionGroup[] {
  const groupMap = new Map<string, PermissionResponse[]>();

  for (const perm of permissions) {
    const feature = perm.featureName || "Uncategorized";
    const existing = groupMap.get(feature);
    if (existing) {
      existing.push(perm);
    } else {
      groupMap.set(feature, [perm]);
    }
  }

  return Array.from(groupMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([feature, perms]) => ({
      feature,
      permissions: perms,
    }));
}

export function RolePermissionGroupedView({
  permissions,
  moduleName,
}: Readonly<RolePermissionGroupedViewProps>) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(),
  );

  const grouped = useMemo(
    () => groupPermissionsByFeature(permissions || []),
    [permissions],
  );

  const totalPermissions = permissions?.length || 0;

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

  /** Expand or collapse all groups */
  const handleToggleAll = () => {
    if (expandedGroups.size === grouped.length) {
      setExpandedGroups(new Set());
    } else {
      setExpandedGroups(new Set(grouped.map((g) => g.feature)));
    }
  };

  const allExpanded = expandedGroups.size === grouped.length;

  return (
    <div className="rounded-md border bg-background">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {moduleName ? `${moduleName} Permissions` : "Permissions"}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {totalPermissions} permissions
          </span>
          {grouped.length > 0 && (
            <button
              type="button"
              onClick={handleToggleAll}
              className="text-sm text-primary hover:underline"
            >
              {allExpanded ? "Collapse All" : "Expand All"}
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        {grouped.length === 0 && (
          <div className="px-4 py-8 text-center text-muted-foreground">
            No permissions assigned
          </div>
        )}
        {grouped.map((group) => {
          const isExpanded = expandedGroups.has(group.feature);

          return (
            <div key={group.feature} className="border-b last:border-b-0">
              {/* Feature Header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-muted/30 hover:bg-muted/50 cursor-pointer">
                <button
                  type="button"
                  onClick={() => handleToggleExpand(group.feature)}
                  className="flex items-center justify-center w-5 h-5 text-muted-foreground hover:text-foreground"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <span className="font-semibold text-sm">{group.feature}</span>
                <Badge variant="secondary">{group.permissions.length}</Badge>
              </div>

              {/* Permission Items */}
              {isExpanded && (
                <div className="ml-10">
                  {group.permissions.map((perm) => (
                    <div
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RolePermissionGroupedView;
