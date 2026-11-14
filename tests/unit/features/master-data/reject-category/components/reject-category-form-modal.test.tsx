import { RejectCategoryFormModal } from "@/features/master-data/reject-category/components/reject-category-form-modal";
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
  "@/features/master-data/reject-category/data/reject-category.service",
  async (importOriginal) => {
    const actual =
      await importOriginal<typeof import("@/features/master-data/reject-category/data/reject-category.service")>();
    return {
      ...actual,
      rejectCategoryService: {
        ...actual.rejectCategoryService,
        createRejectCategory: createSpy,
        updateRejectCategory: updateSpy,
      },
    };
  },
);

const editDefaults = {
  id: 7,
  name: "Invalid Data",
  description: "Data does not match",
  isActive: true,
};

describe("RejectCategoryFormModal", () => {
  beforeEach(() => {
    createSpy.mockClear();
    updateSpy.mockClear();
  });

  it("renders create title and confirm button", () => {
    render(<RejectCategoryFormModal open onOpenChange={vi.fn()} mode="create" />);

    expect(screen.getByText("Add Reject Category")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("renders edit title and confirm button", () => {
    render(
      <RejectCategoryFormModal
        open
        onOpenChange={vi.fn()}
        mode="edit"
        defaultValues={editDefaults}
      />,
    );

    expect(screen.getByText("Edit Reject Category")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  });

  it("shows validation error and does not submit when name is empty", async () => {
    const user = userEvent.setup();
    render(<RejectCategoryFormModal open onOpenChange={vi.fn()} mode="create" />);

    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(
        screen.getByText("Reject category name is required"),
      ).toBeInTheDocument();
    });
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("submits create with entered values and closes on success", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();
    render(
      <RejectCategoryFormModal
        open
        onOpenChange={onOpenChange}
        onSuccess={onSuccess}
        mode="create"
      />,
    );

    await user.type(screen.getByLabelText(/name/i), "Wrong Format");
    await user.type(screen.getByLabelText(/description/i), "Bad format");
    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledTimes(1);
    });
    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Wrong Format",
        description: "Bad format",
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
      <RejectCategoryFormModal
        open
        onOpenChange={onOpenChange}
        mode="edit"
        defaultValues={editDefaults}
      />,
    );

    await user.clear(screen.getByLabelText(/name/i));
    await user.type(screen.getByLabelText(/name/i), "Renamed Category");
    await user.click(screen.getByRole("button", { name: "Update" }));

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledTimes(1);
    });
    expect(updateSpy).toHaveBeenCalledWith(
      7,
      expect.objectContaining({
        name: "Renamed Category",
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
    render(<RejectCategoryFormModal open onOpenChange={onOpenChange} mode="create" />);

    await user.type(screen.getByLabelText(/name/i), "Duplicate");
    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledTimes(1);
    });
    await new Promise((r) => setTimeout(r, 300));
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });
});
