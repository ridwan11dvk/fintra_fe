import { NotificationBulkFormModal } from "@/features/notification/components/notification-bulk-form-modal";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

// The component imports `toast` from @railfinance/ui, which bundles its own
// sonner internally — route it to the mocked external sonner so assertions work.
async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    const { toast } = await import("sonner");
    return { ...actual, toast };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/scroll-area", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

const bulkSpy = vi.hoisted(() =>
  vi.fn(() =>
    Promise.resolve({ status: "SUCCESS", message: "OK", data: null }),
  ),
);
const catSpy = vi.hoisted(() =>
  vi.fn(() =>
    Promise.resolve({
      status: "SUCCESS",
      message: "OK",
      data: [
        { id: 1, name: "Announcement" },
        { id: 2, name: "Reminder" },
      ],
    }),
  ),
);

vi.mock(
  "@/features/notification/data/notification.service",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("@/features/notification/data/notification.service")
      >();
    return {
      ...actual,
      notificationService: {
        ...actual.notificationService,
        createBulkNotifications: bulkSpy,
        getCategories: catSpy,
      },
    };
  },
);

async function pickCategory(optionText: string) {
  const combo = screen.getAllByRole("combobox")[0];
  combo.focus();
  const user = userEvent.setup();
  await user.keyboard("{ArrowDown}");
  await waitFor(() => {
    expect(document.querySelectorAll("[role='option']").length).toBeGreaterThan(
      0,
    );
  });
  const option = [...document.querySelectorAll("[role='option']")].find(
    (o) => o.textContent === optionText,
  );
  await user.click(option!);
  await waitFor(() => {
    expect(document.querySelectorAll("[role='option']").length).toBe(0);
  });
}

describe("NotificationBulkFormModal", () => {
  beforeEach(() => {
    bulkSpy.mockClear();
    catSpy.mockClear();
    (toast.success as ReturnType<typeof vi.fn>).mockClear();
    (toast.error as ReturnType<typeof vi.fn>).mockClear();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("renders title and footer buttons", () => {
    render(<NotificationBulkFormModal isOpen onClose={vi.fn()} />);

    expect(screen.getByText("Create Bulk Notifications")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Bulk" }),
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<NotificationBulkFormModal isOpen onClose={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Create Bulk" }));

    await waitFor(() => {
      expect(screen.getByText("Category is required")).toBeInTheDocument();
    });
    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(screen.getByText("Message is required")).toBeInTheDocument();
    expect(bulkSpy).not.toHaveBeenCalled();
  });

  it("closes when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<NotificationBulkFormModal isOpen onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("submits a valid bulk notification with default IN_APP channel", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<NotificationBulkFormModal isOpen onClose={onClose} />);
    await new Promise((r) => setTimeout(r, 200));

    await pickCategory("Announcement");
    await user.type(screen.getByPlaceholderText("Notification title"), "Hello");
    await user.type(
      screen.getByPlaceholderText("Notification message"),
      "World",
    );

    await user.click(screen.getByRole("button", { name: "Create Bulk" }));

    await waitFor(() => {
      expect(bulkSpy).toHaveBeenCalledTimes(1);
    });
    expect(bulkSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        categoryId: 1,
        title: "Hello",
        message: "World",
        channels: ["IN_APP"],
      }),
    );
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Bulk notifications created successfully",
      );
    });
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it("adds and removes target user ids", async () => {
    const user = userEvent.setup();
    render(<NotificationBulkFormModal isOpen onClose={vi.fn()} />);

    const input = screen.getByPlaceholderText("User ID");
    await user.type(input, "42");
    const addButton = input.closest("div.flex.gap-2")?.querySelector("button");
    expect(addButton).toBeTruthy();
    await user.click(addButton!);

    await waitFor(() => {
      expect(screen.getByText("User ID: 42")).toBeInTheDocument();
    });
    expect(input).toHaveValue(null);

    // remove it again
    const row = screen
      .getByText("User ID: 42")
      .closest("div.flex.items-center.justify-between");
    const removeButton = row?.querySelector("button");
    expect(removeButton).toBeTruthy();
    await user.click(removeButton!);

    await waitFor(() => {
      expect(screen.queryByText("User ID: 42")).not.toBeInTheDocument();
    });
  });

  it("requires user type when target users are specified", async () => {
    const user = userEvent.setup();
    render(<NotificationBulkFormModal isOpen onClose={vi.fn()} />);
    await new Promise((r) => setTimeout(r, 200));

    await pickCategory("Announcement");
    await user.type(screen.getByPlaceholderText("Notification title"), "Hello");
    await user.type(
      screen.getByPlaceholderText("Notification message"),
      "World",
    );

    const input = screen.getByPlaceholderText("User ID");
    await user.type(input, "42");
    const addButton = input.closest("div.flex.gap-2")?.querySelector("button");
    await user.click(addButton!);
    await waitFor(() => {
      expect(screen.getByText("User ID: 42")).toBeInTheDocument();
    });
    expect(screen.getByText("User Type *")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Create Bulk" }));

    await waitFor(() => {
      expect(
        screen.getByText(
          "User type is required when target users are specified",
        ),
      ).toBeInTheDocument();
    });
    expect(bulkSpy).not.toHaveBeenCalled();
  });
});
