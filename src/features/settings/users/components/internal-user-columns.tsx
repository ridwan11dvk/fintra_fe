"use client";

import {
  USER_DELETE_PERMISSION,
  USER_READ_PERMISSION,
  USER_UPDATE_PERMISSION,
  type InternalUserResponse,
} from "@/features/settings";
import { Badge } from "@railfinance/core/ui/badge";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { ColumnHeader } from "@railfinance/core/components/data-table";
import { EllipsisAction } from "@railfinance/core/components/actions";
import { formatDate } from "@railfinance/core/lib";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, KeyRound, Pencil, Trash2 } from "lucide-react";

interface ActionHandlers {
  onShow: (data: InternalUserResponse) => void;
  onEdit: (data: InternalUserResponse) => void;
  onChangePassword: (data: InternalUserResponse) => void;
  onChangeInputDate: (data: InternalUserResponse) => void;
  onDelete: (data: InternalUserResponse) => void;
}

export const internalUserColumns = (
  handlers: ActionHandlers,
): ColumnDef<InternalUserResponse>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="m-2"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="m-2"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    meta: { title: "Name" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => <div>{row.getValue(column.id)}</div>,
  },
  {
    accessorKey: "costCenterName",
    meta: { title: "Cost Center" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => <div>{row.getValue(column.id)}</div>,
  },
  {
    accessorKey: "nipp",
    meta: { title: "NIPP" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="font-medium">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "email",
    meta: { title: "Email" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="lowercase">{row.getValue(column.id)}</div>
    ),
  },
  {
    accessorKey: "roles",
    meta: { title: "Roles" },
    enableSorting: false,
    enableHiding: false,
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => {
      const roles = row.original.roles;
      return (
        <div className="flex flex-wrap gap-1">
          {roles?.map((role) => (
            <Badge
              key={role.id}
              variant="outline"
              className="px-2 py-1 text-xs"
            >
              {role.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "rkipInputPeriodUntil",
    meta: { title: "RKIP Input Limit" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ column, row }) => (
      <div className="lowercase">{formatDate(row.getValue(column.id))}</div>
    ),
  },
  {
    id: "actions",
    meta: { title: "Actions" },
    enableSorting: false,
    enableHiding: false,
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <EllipsisAction
          actions={[
            {
              label: "Show",
              icon: <Eye className="h-4 w-4" />,
              onClick: () => handlers.onShow(row.original),
              permission: USER_READ_PERMISSION,
            },
            {
              label: "Edit",
              icon: <Pencil className="h-4 w-4" />,
              onClick: () => handlers.onEdit(row.original),
              permission: USER_UPDATE_PERMISSION,
            },
            {
              label: "Change Password",
              icon: <KeyRound className="h-4 w-4" />,
              onClick: () => handlers.onChangePassword(row.original),
              permission: USER_UPDATE_PERMISSION,
            },
            {
              label: "Change RKIP Input",
              icon: <Pencil className="h-4 w-4" />,
              onClick: () => handlers.onChangeInputDate(row.original),
              permission: USER_UPDATE_PERMISSION,
            },
            {
              label: "Delete",
              icon: <Trash2 className="h-4 w-4" />,
              onClick: () => handlers.onDelete(row.original),
              permission: USER_DELETE_PERMISSION,
              className: "text-destructive",
            },
          ]}
        />
      </div>
    ),
  },
];
