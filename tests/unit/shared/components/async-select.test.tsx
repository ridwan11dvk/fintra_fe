import { AsyncSelect, type AsyncSelectProps } from "@/shared/components/ui/async-select";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

interface Item {
  id: string;
  name: string;
}

const items: Item[] = [
  { id: "1", name: "Item One" },
  { id: "2", name: "Item Two" },
];

const baseProps = {
  value: "",
  onValueChange: vi.fn(),
  searchValue: "",
  onSearchChange: vi.fn(),
  items,
  renderItem: (item: Item) => <span>{item.name}</span>,
  getKey: (item: Item) => item.id,
  getValue: (item: Item) => item.id,
};

describe("AsyncSelect", () => {
  const setup = async (props: Partial<AsyncSelectProps<Item>> = {}) => {
    const user = (
      await import("@testing-library/user-event")
    ).default.setup();
    render(<AsyncSelect<Item> {...baseProps} {...props} />);
    await user.click(screen.getByPlaceholderText("Search..."));
    return user;
  };

  it("renders the search input with placeholder", () => {
    render(<AsyncSelect<Item> {...baseProps} />);
    const input = screen.getByPlaceholderText("Search...");
    expect(input).toBeInTheDocument();
  });

  it("shows loading state while isLoading", async () => {
    await setup({ isLoading: true });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders items when available", async () => {
    await setup();
    expect(screen.getByText("Item One")).toBeInTheDocument();
    expect(screen.getByText("Item Two")).toBeInTheDocument();
  });

  it("renders without items without crashing", () => {
    render(<AsyncSelect<Item> {...baseProps} items={[]} />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("shows custom empty message node when items empty and searchValue set", async () => {
    const user = (
      await import("@testing-library/user-event")
    ).default.setup();
    render(
      <AsyncSelect<Item>
        {...baseProps}
        items={[]}
        searchValue="zzz"
        emptyMessage={<div>Custom empty</div>}
      />,
    );
    await user.click(screen.getByPlaceholderText("Search..."));
    expect(screen.getByText("Custom empty")).toBeInTheDocument();
  });

  it("shows error message when isError and errorMessage provided", () => {
    render(
      <AsyncSelect<Item>
        {...baseProps}
        isError
        errorMessage="Something went wrong"
      />,
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("calls onSearchChange when typing", async () => {
    const user = (
      await import("@testing-library/user-event")
    ).default.setup();
    const onSearchChange = vi.fn();
    render(
      <AsyncSelect<Item> {...baseProps} onSearchChange={onSearchChange} />,
    );

    await user.type(screen.getByPlaceholderText("Search..."), "a");

    expect(onSearchChange).toHaveBeenCalledWith("a");
  });
});
