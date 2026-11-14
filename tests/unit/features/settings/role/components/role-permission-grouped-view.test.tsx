import { RolePermissionGroupedView } from "@/features/settings/role/components/role-permission-grouped-view";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const permissions = [
  { id: 1, featureName: "bank", name: "bank.read", description: "Read bank" },
  { id: 2, featureName: "bank", name: "bank.create", description: "Create bank" },
  {
    id: 3,
    featureName: "company",
    name: "company.read",
    description: "Read company",
  },
] as never[];

describe("RolePermissionGroupedView", () => {
  it("renders total permission count and groups sorted by resource", () => {
    render(<RolePermissionGroupedView permissions={permissions} />);

    expect(screen.getByText("3 permissions")).toBeInTheDocument();
    expect(screen.getByText("bank")).toBeInTheDocument();
    expect(screen.getByText("company")).toBeInTheDocument();
  });

  it("renders custom module name heading", () => {
    render(
      <RolePermissionGroupedView
        permissions={permissions}
        moduleName="Banking"
      />,
    );
    expect(screen.getByText("Banking Permissions")).toBeInTheDocument();
  });

  it("shows empty state when no permissions", () => {
    render(<RolePermissionGroupedView permissions={[]} />);
    expect(
      screen.getByText("No permissions assigned"),
    ).toBeInTheDocument();
  });

  it("expands a group to show its permissions and collapses again", async () => {
    const user = userEvent.setup();
    render(<RolePermissionGroupedView permissions={permissions} />);

    const expandBank = screen.getByText("bank")
      .closest("div")!
      .querySelector("button")!;

    await user.click(expandBank);
    expect(screen.getByText("Read bank")).toBeInTheDocument();
    expect(screen.getByText("Create bank")).toBeInTheDocument();

    await user.click(expandBank);
    expect(screen.queryByText("Read bank")).not.toBeInTheDocument();
  });

  it("expand all / collapse all toggles every group", async () => {
    const user = userEvent.setup();
    render(<RolePermissionGroupedView permissions={permissions} />);

    await user.click(screen.getByText("Expand All"));
    expect(screen.getByText("Read bank")).toBeInTheDocument();
    expect(screen.getByText("Collapse All")).toBeInTheDocument();

    await user.click(screen.getByText("Collapse All"));
    expect(screen.queryByText("Read bank")).not.toBeInTheDocument();
    expect(screen.getByText("Expand All")).toBeInTheDocument();
  });

  it("groups permissions without resource under Uncategorized", async () => {
    const user = userEvent.setup();
    const noResource = [
      { id: 9, name: "report.export", description: "Export report" },
    ] as never[];
    render(<RolePermissionGroupedView permissions={noResource} />);

    const expandUncategorized = screen.getByText("Uncategorized")
      .closest("div")!
      .querySelector("button")!;
    await user.click(expandUncategorized);
    expect(screen.getByText("Export report")).toBeInTheDocument();
  });
});
