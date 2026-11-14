import { DocumentNameFormModal } from "@/features/master-data/document-name/components/document-name-form-modal";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@tests/unit/utils/render-with-providers";
import { beforeEach, describe, expect, it, vi } from "vitest";

const createSpy = vi.hoisted(() =>
  vi.fn(() => Promise.resolve({ status: "SUCCESS", message: "OK", data: null })),
);
const updateSpy = vi.hoisted(() =>
  vi.fn(() => Promise.resolve({ status: "SUCCESS", message: "OK", data: null })),
);

vi.mock(
  "@/features/master-data/document-name/data/document-name.service",
  async (importOriginal) => {
    const actual =
      await importOriginal<typeof import("@/features/master-data/document-name/data/document-name.service")>();
    return {
      ...actual,
      documentNameService: {
        ...actual.documentNameService,
        createDocumentName: createSpy,
        updateDocumentName: updateSpy,
      },
    };
  },
);

const editDefaults = {
  id: 7,
  name: "Purchase Order",
  description: "Purchase order document",
  isActive: true,
};

describe("DocumentNameFormModal", () => {
  beforeEach(() => {
    createSpy.mockClear();
    updateSpy.mockClear();
  });

  it("renders create title and confirm button", () => {
    render(<DocumentNameFormModal open onOpenChange={vi.fn()} mode="create" />);

    expect(screen.getByText("Add Document Name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("renders edit title and confirm button", () => {
    render(
      <DocumentNameFormModal
        open
        onOpenChange={vi.fn()}
        mode="edit"
        defaultValues={editDefaults}
      />,
    );

    expect(screen.getByText("Edit Document Name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  });

  it("shows validation error and does not submit when name is empty", async () => {
    const user = userEvent.setup();
    render(<DocumentNameFormModal open onOpenChange={vi.fn()} mode="create" />);

    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(
        screen.getByText("Document name is required"),
      ).toBeInTheDocument();
    });
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("submits create with entered values and closes on success", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();
    render(
      <DocumentNameFormModal
        open
        onOpenChange={onOpenChange}
        onSuccess={onSuccess}
        mode="create"
      />,
    );

    await user.type(screen.getByLabelText(/^name/i), "Invoice");
    await user.type(screen.getByLabelText(/description/i), "Billing document");
    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledTimes(1);
    });
    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Invoice",
        description: "Billing document",
        isActive: true,
      }),
    );
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("submits update with the record id in edit mode", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <DocumentNameFormModal
        open
        onOpenChange={onOpenChange}
        mode="edit"
        defaultValues={editDefaults}
      />,
    );

    await user.clear(screen.getByLabelText(/^name/i));
    await user.type(screen.getByLabelText(/^name/i), "Renamed Document");
    await user.click(screen.getByRole("button", { name: "Update" }));

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledTimes(1);
    });
    expect(updateSpy).toHaveBeenCalledWith(
      7,
      expect.objectContaining({
        name: "Renamed Document",
        isActive: true,
      }),
    );
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("keeps the modal open when create fails", async () => {
    createSpy.mockRejectedValueOnce(
      Object.assign(new Error("API error"), {
        response: { data: { message: "API error", errors: {} } },
      }),
    );
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<DocumentNameFormModal open onOpenChange={onOpenChange} mode="create" />);

    await user.type(screen.getByLabelText(/^name/i), "Duplicate");
    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledTimes(1);
    });
    await new Promise((r) => setTimeout(r, 300));
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });
});
