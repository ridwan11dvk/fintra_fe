import type { Partner } from "@/features/master-data/partner/data/partner.types";
import {
  PARTNER_DELETE_PERMISSION,
  PARTNER_UPDATE_PERMISSION,
} from "@/features/master-data/partner/data/partner.utils";
import { Button } from "@railfinance/core/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@railfinance/core/ui/dropdown-menu";
import { StatusBadge } from "@railfinance/core/components/badges";
import { Visibility } from "@railfinance/core/components/visibility";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

interface PartnerColumnsProps {
  onView?: (partner: Partner) => void;
  onEdit?: (partner: Partner) => void;
  onDelete?: (partner: Partner) => void;
}

export const partnerColumns = ({
  onView,
  onEdit,
  onDelete,
}: Readonly<PartnerColumnsProps>): ColumnDef<Partner>[] => [
  {
    accessorKey: "partnerCode",
    header: "Code",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("partnerCode")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="max-w-xs truncate">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "companyEmail",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">
        {row.getValue("companyEmail") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "companyPhoneNumber",
    header: "Phone",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("companyPhoneNumber") || "-"}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let badgeStatus: "active" | "inactive" | "error" | "info" = "info";
      if (status === "ACTIVE") {
        badgeStatus = "active";
      } else if (status === "INACTIVE") {
        badgeStatus = "inactive";
      } else if (status === "BLACKLISTED") {
        badgeStatus = "error";
      }
      return <StatusBadge status={badgeStatus} label={status ?? "DRAFT"} />;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const partner = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onView && (
              <DropdownMenuItem onClick={() => onView(partner)}>
                View
              </DropdownMenuItem>
            )}
            {onEdit && (
              <Visibility permission={PARTNER_UPDATE_PERMISSION}>
                <DropdownMenuItem onClick={() => onEdit(partner)}>
                  Edit
                </DropdownMenuItem>
              </Visibility>
            )}
            {onDelete && (
              <Visibility permission={PARTNER_DELETE_PERMISSION}>
                <DropdownMenuItem
                  onClick={() => onDelete(partner)}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </Visibility>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
