import { ActionButton } from "@railfinance/core/components/actions";
import { StatusBadge } from "@railfinance/core/components/badges";
import {
  ColumnHeader,
  type TableActionHandlers,
} from "@railfinance/core/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { DocumentNameResponse } from "../data/document-name.types";
import {
  DOCUMENT_NAME_DELETE_PERMISSION,
  DOCUMENT_NAME_UPDATE_PERMISSION,
} from "../data/document-name.utils";

export const documentNameColumns = (
  handlers: TableActionHandlers<DocumentNameResponse>,
): ColumnDef<DocumentNameResponse>[] => [
  {
    id: "number",
    meta: { title: "No." },
    header: () => <div className="font-medium">No.</div>,
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return <div>{pageIndex * pageSize + row.index + 1}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    meta: { title: "Name" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "description",
    meta: { title: "Description" },
    header: ({ column }) => <ColumnHeader column={column} />,
    cell: ({ row }) => <div>{row.original.description || "-"}</div>,
  },
  {
    accessorKey: "isActive",
    meta: { title: "Status" },
    header: ({ column }) => <ColumnHeader column={column} align="center" />,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <StatusBadge status={row.original.isActive ? "active" : "inactive"} />
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    meta: { title: "Actions" },
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <ActionButton
          variant="edit"
          size="sm"
          onClick={() => handlers?.onEdit?.(row.original)}
          permission={DOCUMENT_NAME_UPDATE_PERMISSION}
        />
        <ActionButton
          variant="delete"
          size="sm"
          onClick={() => handlers?.onDelete?.(row.original)}
          permission={DOCUMENT_NAME_DELETE_PERMISSION}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
