import { NotificationFormModal } from "@/features/notification/components/notification-form-modal";
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

const createSpy = vi.hoisted(() =>
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
        createNotification: createSpy,
        getCategories: catSpy,
      },
    };
  },
);

async function openSelectAndPick(combo: HTMLElement, optionText?: string) {
  combo.focus();
  const user = userEvent.setup();
  await user.keyboard("{ArrowDown}");
  await waitFor(() => {
    expect(document.querySelectorAll("[role='option']").length).toBeGreaterThan(
      0,
    );
  });
  if (optionText) {
    const option = [...document.querySelectorAll("[role='option']")].find(
      (o) => o.textContent === optionText,
    );
    await user.click(option!);
  } else {
    await user.keyboard("{Enter}");
  }
  await waitFor(() => {
    expect(document.querySelectorAll("[role='option']").length).toBe(0);
  });
}

describe("NotificationFormModal", () => {
  beforeEach(() => {
    createSpy.mockClear();
    catSpy.mockClear();
    (toast.success as ReturnType<typeof vi.fn>).mockClear();
    (toast.error as ReturnType<typeof vi.fn>).mockClear();
    // jsdom does not implement scrollIntoView (needed by radix select)
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("renders title and footer buttons", () => {
    render(<NotificationFormModal isOpen onClose={vi.fn()} />);

    expect(screen.getByText("Create Notification")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<NotificationFormModal isOpen onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(screen.getByText("Category is required")).toBeInTheDocument();
    });
    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(screen.getByText("Message is required")).toBeInTheDocument();
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("closes and resets when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<NotificationFormModal isOpen onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("submits a valid notification (EMAIL channel) and closes on success", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<NotificationFormModal isOpen onClose={onClose} />);
    await new Promise((r) => setTimeout(r, 200));

    const combos = screen.getAllByRole("combobox");
    await openSelectAndPick(combos[0], "Announcement");
    await user.type(screen.getByPlaceholderText("Notification title"), "Hello");
    await user.type(
      screen.getByPlaceholderText("Notification message"),
      "World",
    );

    // Switch to EMAIL channel: the recipient-email input is only rendered for
    // EMAIL, and an empty recipientEmail fails schema validation.
    await openSelectAndPick(screen.getAllByRole("combobox")[1], "Email");
    await user.type(
      screen.getByPlaceholderText("recipient@example.com"),
      "recipient@example.com",
    );

    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledTimes(1);
    });
    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        categoryId: 1,
        title: "Hello",
        message: "World",
        channel: "EMAIL",
        recipientEmail: "recipient@example.com",
        maxRetries: 3,
      }),
    );
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Notification created successfully",
      );
    });
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it("shows email validation error when EMAIL channel is selected without recipient", async () => {
    const user = userEvent.setup();
    render(<NotificationFormModal isOpen onClose={vi.fn()} />);
    await new Promise((r) => setTimeout(r, 200));

    await openSelectAndPick(screen.getAllByRole("combobox")[0], "Announcement");
    await user.type(screen.getByPlaceholderText("Notification title"), "Mail");
    await user.type(
      screen.getByPlaceholderText("Notification message"),
      "Body",
    );

    // switch channel to EMAIL (second combobox) — re-query because React
    // re-renders (and replaces the DOM nodes) after the category selection
    await openSelectAndPick(screen.getAllByRole("combobox")[1], "Email");

    await user.click(screen.getByRole("button", { name: "Create" }));

    // The empty recipient fails the email format check first
    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });
    expect(createSpy).not.toHaveBeenCalled();
    expect(
      screen.getByPlaceholderText("recipient@example.com"),
    ).toBeInTheDocument();
  });

  it("adds and removes a metadata link", async () => {
    const user = userEvent.setup();
    render(<NotificationFormModal isOpen onClose={vi.fn()} />);

    await user.type(screen.getByPlaceholderText("Link key"), "orderId");
    await user.type(screen.getByPlaceholderText("Link URL"), "/orders/1");
    const addLinkButton = screen
      .getByPlaceholderText("Link URL")
      .closest("div.flex.gap-2")
      ?.querySelector("button");
    expect(addLinkButton).toBeTruthy();
    await user.click(addLinkButton!);

    await waitFor(() => {
      expect(screen.getByDisplayValue("orderId")).toBeInTheDocument();
      expect(screen.getByDisplayValue("/orders/1")).toBeInTheDocument();
    });

    // remove it again (ghost button with trash icon next to the link row)
    const removeButton = screen
      .getByDisplayValue("orderId")
      .closest("div.flex.gap-2.items-center")
      ?.querySelector("button");
    expect(removeButton).toBeTruthy();
    await user.click(removeButton!);

    await waitFor(() => {
      expect(screen.queryByDisplayValue("orderId")).not.toBeInTheDocument();
    });
  });
});
