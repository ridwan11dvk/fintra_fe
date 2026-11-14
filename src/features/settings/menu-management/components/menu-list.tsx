import { Edit, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import type { NavigationMenuItem } from "../data/menu-management.types";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@railfinance/core/ui";
import { useState, type ReactNode } from "react";

export interface MenuListProps {
  menus: NavigationMenuItem[];
  onAdd: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function MenuList({
  menus,
  onAdd,
  onEdit,
  onDelete,
}: Readonly<MenuListProps>) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpanded(newExpanded);
  };

  const renderRow = (menu: NavigationMenuItem, level = 0): ReactNode => {
    const hasChildren = menu.children && menu.children.length > 0;
    const isExpanded = expanded.has(menu.id);

    return (
      <>
        <TableRow key={menu.id}>
          <TableCell style={{ paddingLeft: `${level * 24 + 16}px` }}>
            <div className="flex items-center gap-2">
              {hasChildren && (
                <button
                  type="button"
                  onClick={() => toggleExpand(menu.id)}
                  className="flex h-6 w-6 items-center justify-center"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
              {!hasChildren && <div className="h-6 w-6" />}
              {menu.title}
            </div>
          </TableCell>
          <TableCell>{menu.code}</TableCell>
          <TableCell>{menu.url}</TableCell>
          <TableCell>{menu.type}</TableCell>
          <TableCell>{menu.category}</TableCell>
          <TableCell>{menu.sortOrder}</TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(menu.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(menu.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {isExpanded &&
          hasChildren &&
          menu.children?.map((child) => renderRow(child, level + 1))}
      </>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Menu Management</span>
          <Button onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Menu
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menus.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No menus found
                </TableCell>
              </TableRow>
            ) : (
              menus.map((menu) => renderRow(menu))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
