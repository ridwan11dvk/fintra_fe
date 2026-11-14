import {
  MaintenanceContent,
  MaintenancePage,
} from "@/features/errors/pages/maintenance.page";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const navigateFn = vi.fn();
const reloadFn = vi.fn();

vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useNavigate: () => navigateFn,
}));

describe("MaintenanceContent", () => {
  beforeAll(() => {
    Object.defineProperty(globalThis, "location", {
      value: { reload: reloadFn },
      writable: true,
    });
  });

  it("renders 503 heading", () => {
    render(<MaintenanceContent />);
    expect(screen.getByText("503")).toBeInTheDocument();
  });

  it("renders 'Under Maintenance' title", () => {
    render(<MaintenanceContent />);
    expect(screen.getByText("Under Maintenance")).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(<MaintenanceContent />);
    expect(
      screen.getByText(/currently performing scheduled maintenance/),
    ).toBeInTheDocument();
  });

  it("renders Go Back button", () => {
    render(<MaintenanceContent />);
    expect(
      screen.getByRole("button", { name: /go back/i }),
    ).toBeInTheDocument();
  });

  it("renders Refresh Page button", () => {
    render(<MaintenanceContent />);
    expect(
      screen.getByRole("button", { name: /refresh page/i }),
    ).toBeInTheDocument();
  });

  it("calls navigate(-1) when Go Back is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<MaintenanceContent />);
    await user.click(screen.getByRole("button", { name: /go back/i }));
    expect(navigateFn).toHaveBeenCalledWith(-1);
  });

  it("calls location.reload() when Refresh Page is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<MaintenanceContent />);
    await user.click(screen.getByRole("button", { name: /refresh page/i }));
    expect(reloadFn).toHaveBeenCalledOnce();
  });
});

describe("MaintenancePage", () => {
  beforeAll(() => {
    Object.defineProperty(globalThis, "location", {
      value: { reload: reloadFn },
      writable: true,
    });
  });

  it("renders content", () => {
    render(<MaintenancePage />);
    expect(screen.getByText("503")).toBeInTheDocument();
  });
});
