import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@railfinance/core/components/modal";
import {
  useCreateMenu,
  useDeleteMenu,
  useMenu,
  useMenuTree,
  useMenus,
  useUpdateMenu,
} from "../data/menu-management.query";
import type { NavigationMenuSchema } from "../data/menu-management.schema";
import { MenuList } from "../components/menu-list";
import { MenuForm } from "../components/menu-form";

export function MenuManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: menuTree = [], isLoading: isLoadingTree } = useMenuTree();
  const { data: menus = [] } = useMenus();
  const { data: menu } = useMenu(selectedId ?? 0, selectedId !== null);

  const createMutation = useCreateMenu();
  const updateMutation = useUpdateMenu();
  const deleteMutation = useDeleteMenu();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleAdd = () => {
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this menu?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (data: NavigationMenuSchema) => {
    const transformedData = {
      ...data,
      icon: data.icon || null,
      badge: data.badge || null,
      parentId: data.parentId || null,
      featureId: data.featureId || null,
      moduleId: data.moduleId || null,
    };

    if (selectedId === null) {
      createMutation.mutate(transformedData, {
        onSuccess: () => setIsModalOpen(false),
      });
    } else {
      updateMutation.mutate(
        { id: selectedId, data: transformedData },
        {
          onSuccess: () => setIsModalOpen(false),
        },
      );
    }
  };

  if (isLoadingTree) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <MenuList
        menus={menuTree}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedId === null ? "Add Menu" : "Edit Menu"}
        size="2xl"
      >
        <MenuForm
          initialValues={menu}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
          menus={menus}
        />
      </Modal>
    </div>
  );
}

export default MenuManagementPage;
