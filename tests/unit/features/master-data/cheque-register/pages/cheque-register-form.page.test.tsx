import { ChequeRegisterFormPage } from "@/features/master-data/cheque-register/pages/cheque-register-form.page";
import { render, screen, within } from "@tests/unit/utils/render-with-providers";
import { chequeRegisterService } from "@/features/master-data/cheque-register/data/cheque-register.service";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { Route, Routes } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@railfinance/core/components/page-shell", () => ({
  Page: ({ children }: { children?: ReactNode }) => <main>{children}</main>,
}));

vi.mock("@railfinance/core/components/page-header", () => ({
  PageHeader: ({ title }: { title?: string }) => <h1>{title}</h1>,
}));

describe("ChequeRegisterFormPage create layout", () => {
  it("places the information banner before the House Bank row", async () => {
    render(<ChequeRegisterFormPage mode="create" />);

    const banner = await screen.findByRole("region", {
      name: "Add multiple cheques at once",
    });
    expect(banner).toHaveTextContent(
      "For consecutive cheque numbers, enter the starting and ending numbers to add them all at once.",
    );
    expect(banner).toHaveClass("py-4");
    const houseBank = screen.getByRole("combobox", { name: "House Bank *" });
    const bannerBeforeHouseBank = Boolean(
      banner.compareDocumentPosition(houseBank) & Node.DOCUMENT_POSITION_FOLLOWING,
    );

    expect(bannerBeforeHouseBank).toBe(true);
  });

  it("renders QA multiple-row controls in Figma-style cheque cards", async () => {
    const user = userEvent.setup();
    const { container } = render(<ChequeRegisterFormPage mode="create" />);
    await screen.findByRole("region", { name: "Add multiple cheques at once" });
    const form = container.querySelector("form");
    expect(form).toHaveClass("w-full", "max-w-none");

    const addButton = await screen.findByRole("button", {
      name: "Add another Cheque Number",
    });
    await user.click(addButton);
    await user.click(addButton);

    const rows = screen.getAllByRole("group", { name: /Cheque Number row/ });
    expect(rows).toHaveLength(3);
    rows.forEach((row) => {
      expect(row).toHaveClass("rounded-lg", "border");
      expect(row).toHaveClass("px-4", "py-5");
      expect(row).toHaveClass("md:grid-cols-[292px_minmax(0,1fr)]");
      expect(row.parentElement).toHaveClass("md:max-w-[888px]");
    });

    const status = screen.getAllByRole("combobox", { name: "Status *" })[0];
    expect(status.closest('[data-slot="native-select-wrapper"]')).toHaveClass("[&_select]:h-11");
    expect(screen.getAllByRole("textbox", { name: "Cheque Number *" })[0]).toHaveClass("h-11");
    expect(screen.getAllByRole("textbox", { name: "Cheque Number *" })[0]).toHaveAttribute(
      "placeholder",
      "Enter Cheque Number",
    );
    expect(within(status as HTMLElement).getByRole("option", { name: "Open" })).toBeInTheDocument();
    expect(within(status as HTMLElement).getByRole("option", { name: "Booked" })).toBeInTheDocument();
    expect(within(status as HTMLElement).getByRole("option", { name: "Cancel" })).toBeInTheDocument();
    const removeButtons = screen.getAllByRole("button", { name: /Remove Cheque Number row/ });
    expect(removeButtons).toHaveLength(3);
    expect(removeButtons[0]).toHaveClass("size-11", "text-white");
    expect(addButton.parentElement).toHaveClass("justify-center");
    expect(addButton).toHaveClass("h-10", "border-primary", "text-primary");
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveClass("h-10", "border-primary", "text-primary");
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Save" })).toHaveClass(
      "h-10", "bg-muted", "text-muted-foreground", "opacity-100",
    );
    expect(screen.queryByText("Activation Status")).not.toBeInTheDocument();
  });
});

describe("ChequeRegisterFormPage edit layout", () => {
  afterEach(() => vi.restoreAllMocks());

  it("uses the Add form's cheque-card layout and aligned controls while retaining edit fields", async () => {
    vi.spyOn(chequeRegisterService, "getHouseBanks").mockResolvedValue([
      {
        id: "7",
        name: "Mandiri 102-00-098765-1 (PT KAI Holding)",
        status: "ACTIVE",
      },
    ]);
    vi.spyOn(chequeRegisterService, "get").mockResolvedValue({
      id: "123",
      houseBankId: "7",
      houseBankName: "Mandiri 102-00-098765-1 (PT KAI Holding)",
      chequeNumber: "CHQ-001",
      status: "RELEASE",
      releaseDate: "2026-10-15",
      isActive: true,
    });

    const { container } = render(
      <Routes>
        <Route
          path="/master-data/cheque-register/:id/edit"
          element={<ChequeRegisterFormPage mode="edit" />}
        />
      </Routes>,
      { initialEntries: ["/master-data/cheque-register/123/edit"] },
    );

    expect(
      await screen.findByRole("heading", { name: "Edit Cheque Register" }),
    ).toBeInTheDocument();
    await screen.findByRole("group", { name: "Cheque Number row 1" });
    const form = container.querySelector("form");
    expect(form).toHaveClass("w-full", "max-w-none");

    const row = await screen.findByRole("group", {
      name: "Cheque Number row 1",
    });
    expect(row).toHaveClass("rounded-lg", "border", "px-4", "py-5");
    expect(row).toHaveClass("md:grid-cols-[292px_minmax(0,1fr)]");
    expect(row.parentElement).toHaveClass("md:max-w-[824px]");
    expect(
      screen.getByRole("textbox", { name: "Cheque Number *" }),
    ).toHaveClass("h-11");
    const status = screen.getByRole("combobox", { name: "Status *" });
    expect(status.closest('[data-slot="native-select-wrapper"]')).toHaveClass(
      "[&_select]:h-11",
    );
    expect(
      within(status).getByRole("option", { name: "Release" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Release Date *")).toHaveClass("h-11");
    // Activation is managed from the list actions, not the edit form.
    expect(
      screen.queryByRole("switch", { name: "Activation Status" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveClass(
      "h-10",
      "border-primary",
      "text-primary",
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Add another Cheque Number" }),
    ).not.toBeInTheDocument();
  });
});
