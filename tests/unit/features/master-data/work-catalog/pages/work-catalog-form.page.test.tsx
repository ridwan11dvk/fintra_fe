import {
  WorkCatalogCreatePage,
  WorkCatalogEditPage,
  WorkCatalogShowPage,
} from "@/features/master-data/work-catalog/pages/work-catalog-form.page";
import { server } from "@tests/unit/mocks/server";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { delay, http, HttpResponse } from "msw";
import type { ReactNode } from "react";
import { Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { navigate, taxRates } = vi.hoisted(() => ({
  navigate: vi.fn(),
  taxRates: [
    {
      id: 1,
      name: "PPN 11%",
      ratePercent: 11,
      coefficientNumerator: 11,
      coefficientDenominator: 100,
    },
    {
      id: 2,
      name: "PPh 2%",
      ratePercent: 2,
      coefficientNumerator: 2,
      coefficientDenominator: 1,
    },
    {
      id: "abc",
      name: "Bad Tax",
      ratePercent: null,
      coefficientNumerator: null,
      coefficientDenominator: null,
    },
  ],
}));

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return { ...actual, useNavigate: () => navigate };
});

vi.mock("@railfinance/core/masterdata", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@railfinance/core/masterdata")>();
  return {
    ...actual,
    useGetActiveTaxRates: () => ({
      data: { status: "SUCCESS", data: taxRates },
    }),
  };
});

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@railfinance/core")>();
  return {
    ...actual,
    Page: ({ children, title }: { children?: ReactNode; title?: string }) => (
      <div data-testid="page">
        <h1>{title}</h1>
        {children}
      </div>
    ),
    PageHeader: ({ title }: { title?: string }) => <h2>{title}</h2>,
    Separator: () => <hr />,
    Visibility: ({ children }: { children?: ReactNode }) => <>{children}</>,
    Select: ({
      value,
      onValueChange,
      disabled,
      children,
    }: {
      value?: string;
      onValueChange?: (value: string) => void;
      disabled?: boolean;
      children?: ReactNode;
    }) => (
      <select
        aria-label="Applicable Taxes"
        value={value ?? ""}
        disabled={disabled}
        onChange={(event) => onValueChange?.(event.target.value)}
      >
        <option value="">Choose</option>
        {children}
      </select>
    ),
    SelectTrigger: ({ children }: { children?: ReactNode }) => <>{children}</>,
    SelectValue: () => null,
    SelectContent: ({ children }: { children?: ReactNode }) => <>{children}</>,
    SelectItem: ({
      value,
      children,
    }: {
      value: string;
      children?: ReactNode;
    }) => <option value={value}>{children}</option>,
  };
});

const BASE = "http://localhost:3000";

const detailRecord = {
  id: 1,
  workType: "Pengangkutan",
  isActive: true,
  subCategory: {
    id: 1,
    code: "SUB-01.1",
    name: "SUB-01.1: Operasional & Utility",
  },
  groupCategory: { id: 1, name: "Utility & Fasilitas" },
  mainCategory: { id: 1, code: "CASH", name: "Cash" },
  cashflowCategory: { id: 1, code: "CAT-A", name: "Category A" },
  procurementSchema: {
    id: 1,
    code: "GOODS",
    name: "Pengadaan Barang Murni",
  },
  description: "Jasa angkut barang",
  taxes: [
    {
      id: 1,
      taxSubject: "BADAN_USAHA" as const,
      taxRateId: 1,
      taxRateName: "Nama lama PPN",
      coefficientNumerator: 9,
      coefficientDenominator: 1,
      coefficient: 9,
      ratePercent: 9,
      sortOrder: 0,
    },
    {
      id: 2,
      taxSubject: "PERORANGAN" as const,
      taxRateId: 2,
      taxRateName: "Nama lama PPh",
      sortOrder: 1,
    },
  ],
};

function renderEdit(path = "/master-data/work-catalog/1/edit") {
  return render(
    <Routes>
      <Route
        path="/master-data/work-catalog/:id/edit"
        element={<WorkCatalogEditPage />}
      />
    </Routes>,
    { initialEntries: [path] },
  );
}

function taxComboboxes() {
  return screen.getAllByRole("combobox").filter((select) =>
    [...select.querySelectorAll("option")].some((option) =>
      ["PPN 11%", "PPh 2%", "Bad Tax", "99"].includes(option.textContent ?? ""),
    ),
  );
}

function comboboxWithOption(name: string) {
  const select = screen.getAllByRole("combobox").find((element) =>
    [...element.querySelectorAll("option")].some(
      (option) => option.textContent === name,
    ),
  );
  if (!select) throw new Error(`Missing select option ${name}`);
  return select;
}

async function fillCatalogFields(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(
    (
      await screen.findByRole("option", {
        name: "SUB-01.1: Operasional & Utility",
      })
    ).closest("select")!,
    "1",
  );
  await user.selectOptions(
    (await screen.findByRole("option", { name: "Category A" })).closest(
      "select",
    )!,
    "1",
  );
  await user.selectOptions(
    (
      await screen.findByRole("option", { name: "Pengadaan Barang Murni" })
    ).closest("select")!,
    "1",
  );
}

const catalogPayload = {
  subCategoryId: 1,
  groupCategoryId: 1,
  mainCategoryId: 1,
  cashflowCategoryId: 1,
  procurementSchemaId: 1,
};

function useWorkCatalogFormHandlers() {
  server.use(
    http.get(`${BASE}/master/payment-categories`, () =>
      HttpResponse.json({
        status: "SUCCESS",
        data: [
          {
            sub: { id: 1, name: "SUB-01.1: Operasional & Utility" },
            group: { id: 1, name: "Utility & Fasilitas" },
            main: { id: 1, name: "Cash" },
          },
        ],
      }),
    ),
    http.get(`${BASE}/master/cashflow-categories/options`, () =>
      HttpResponse.json({
        status: "SUCCESS",
        data: [{ id: 1, value: "1", label: "Category A" }],
      }),
    ),
    http.get(`${BASE}/master/lookup-value/options`, ({ request }) => {
      const typeCode = new URL(request.url).searchParams.get("typeCode");
      if (typeCode !== "PROCUREMENT_SCHEMA") {
        return HttpResponse.json({ status: "SUCCESS", data: [] });
      }
      return HttpResponse.json({
        status: "SUCCESS",
        data: [
          {
            id: 1,
            value: "1",
            label: "Pengadaan Barang Murni",
          },
        ],
      });
    }),
  );
}

function renderShow(path = "/master-data/work-catalog/1") {
  return render(
    <Routes>
      <Route
        path="/master-data/work-catalog/:id"
        element={<WorkCatalogShowPage />}
      />
    </Routes>,
    { initialEntries: [path] },
  );
}

describe("WorkCatalogCreatePage", () => {
  beforeEach(() => {
    navigate.mockReset();
    useWorkCatalogFormHandlers();
  });

  it("keeps save disabled until work type and one tax subject are selected", async () => {
    const user = userEvent.setup();
    render(<WorkCatalogCreatePage />);

    expect(screen.getAllByRole("heading", { name: "Add Work Catalog" })).toHaveLength(
      2,
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();

    await user.type(
      screen.getByPlaceholderText("Enter work name"),
      "   ",
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();

    await user.clear(screen.getByPlaceholderText("Enter work name"));
    await user.type(
      screen.getByPlaceholderText("Enter work name"),
      "Bongkar Muat",
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();

    const [businessSelect, individualSelect] = taxComboboxes();
    await user.selectOptions(businessSelect, "1");
    expect(screen.getByDisplayValue("11/100")).toBeInTheDocument();
    expect(screen.getByDisplayValue("11")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();

    await fillCatalogFields(user);
    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();

    await user.selectOptions(businessSelect, "");
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();

    await user.selectOptions(individualSelect, "2");
    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
  });

  it("posts badan usaha and perorangan taxes, then returns to the list", async () => {
    let body: unknown;
    server.use(
      http.post(`${BASE}/master/work-catalog`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({
          status: "SUCCESS",
          message: "created",
          data: detailRecord,
        });
      }),
    );

    const user = userEvent.setup();
    render(<WorkCatalogCreatePage />);

    await user.type(
      screen.getByPlaceholderText("Enter work name"),
      "Bongkar Muat",
    );
    await user.type(
      screen.getByPlaceholderText("Enter a brief description of the work type"),
      "Deskripsi singkat",
    );
    const [businessSelect, individualSelect] = taxComboboxes();
    await user.selectOptions(businessSelect, "1");
    await user.selectOptions(individualSelect, "2");
    await fillCatalogFields(user);
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(body).toEqual({
        workType: "Bongkar Muat",
        ...catalogPayload,
        description: "Deskripsi singkat",
        taxes: [
          { taxSubject: "BADAN_USAHA", taxRateId: 1 },
          { taxSubject: "PERORANGAN", taxRateId: 2 },
        ],
      }),
    );
    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith("/master-data/work-catalog"),
    );
  });

  it("drops a tax id that is not a number", async () => {
    let body: unknown;
    server.use(
      http.post(`${BASE}/master/work-catalog`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({
          status: "SUCCESS",
          message: "created",
          data: detailRecord,
        });
      }),
    );

    const user = userEvent.setup();
    render(<WorkCatalogCreatePage />);

    await user.type(screen.getByPlaceholderText("Enter work name"), "Cek");
    const [businessSelect, individualSelect] = taxComboboxes();
    await user.selectOptions(businessSelect, "abc");
    await user.selectOptions(individualSelect, "abc");
    await fillCatalogFields(user);
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(body).toEqual({
        workType: "Cek",
        ...catalogPayload,
        description: "",
        taxes: [],
      }),
    );
  });

  it("hides a tax already chosen on another row of the same subject", async () => {
    const user = userEvent.setup();
    render(<WorkCatalogCreatePage />);

    const [businessSelect] = taxComboboxes();
    await user.selectOptions(businessSelect, "1");
    await user.click(
      screen.getAllByRole("button", { name: "Add another Applicable Tax" })[0],
    );

    const businessSelects = taxComboboxes().slice(0, 2);
    const secondOptions = [...businessSelects[1].querySelectorAll("option")].map(
      (option) => option.textContent,
    );

    expect(secondOptions).toEqual(["Choose", "PPh 2%", "Bad Tax"]);
    expect(taxComboboxes()).toHaveLength(3);
  });

  it("keeps save enabled after one tax subject is removed while the other remains", async () => {
    const user = userEvent.setup();
    render(<WorkCatalogCreatePage />);

    await user.type(screen.getByPlaceholderText("Enter work name"), "Cek");
    await fillCatalogFields(user);
    const [businessSelect, individualSelect] = taxComboboxes();
    await user.selectOptions(businessSelect, "1");
    await user.selectOptions(individualSelect, "2");
    await user.click(
      screen.getAllByRole("button", { name: "Remove applicable tax 1" })[0],
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();

    await user.click(
      screen.getByRole("button", { name: "Remove applicable tax 1" }),
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("returns to the list when cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<WorkCatalogCreatePage />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(navigate).toHaveBeenCalledWith("/master-data/work-catalog");
  });
});

describe("WorkCatalogEditPage", () => {
  beforeEach(() => {
    navigate.mockReset();
    useWorkCatalogFormHandlers();
  });

  it("loads the detail into the form and puts the same tax payload", async () => {
    let body: unknown;
    let requestUrl = "";
    server.use(
      http.put(`${BASE}/master/work-catalog/:id`, async ({ request }) => {
        requestUrl = request.url;
        body = await request.json();
        return HttpResponse.json({
          status: "SUCCESS",
          message: "updated",
          data: detailRecord,
        });
      }),
    );

    const user = userEvent.setup();
    renderEdit();

    expect(
      await screen.findByDisplayValue("Pengangkutan"),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("Jasa angkut barang")).toBeInTheDocument();
    expect(taxComboboxes()[0]).toHaveValue("1");
    expect(taxComboboxes()[1]).toHaveValue("2");

    await user.clear(screen.getByPlaceholderText("Enter work name"));
    await user.type(
      screen.getByPlaceholderText("Enter work name"),
      "Pengangkutan darat",
    );
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(requestUrl).toContain("/master/work-catalog/1"));
    expect(body).toEqual({
      workType: "Pengangkutan darat",
      ...catalogPayload,
      description: "Jasa angkut barang",
      taxes: [
        { taxSubject: "BADAN_USAHA", taxRateId: 1 },
        { taxSubject: "PERORANGAN", taxRateId: 2 },
      ],
    });
    expect(navigate).toHaveBeenCalledWith("/master-data/work-catalog");
  });

  it("shows a stored tax that is no longer in the active list", async () => {
    server.use(
      http.get(`${BASE}/master/work-catalog/:id`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          data: {
            ...detailRecord,
            taxes: [{ taxSubject: "BADAN_USAHA", taxRateId: 99 }],
          },
        }),
      ),
    );

    renderEdit();

    expect(await screen.findByRole("option", { name: "99" })).toBeInTheDocument();
    expect(taxComboboxes()[0]).toHaveValue("99");
  });

  it("shows a loading state before the detail arrives", async () => {
    server.use(
      http.get(`${BASE}/master/work-catalog/:id`, async () => {
        await delay(200);
        return HttpResponse.json({ status: "SUCCESS", data: detailRecord });
      }),
    );

    renderEdit();

    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading work catalog...",
    );
    expect(await screen.findByDisplayValue("Pengangkutan")).toBeInTheDocument();
  });

  it("shows an error and can go back when detail fails", async () => {
    server.use(
      http.get(`${BASE}/master/work-catalog/:id`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    const user = userEvent.setup();
    renderEdit();

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent("Failed to load work catalog.");
    await user.click(
      screen.getByRole("button", { name: "Back to Work Catalog" }),
    );
    expect(navigate).toHaveBeenCalledWith("/master-data/work-catalog");
  });

  it("shows not found when the id is not a number", () => {
    renderEdit("/master-data/work-catalog/abc/edit");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Work Catalog not found.",
    );
  });
});

describe("WorkCatalogShowPage", () => {
  beforeEach(() => {
    navigate.mockReset();
    useWorkCatalogFormHandlers();
  });

  it("shows work type and tax values from the active tax rate list", async () => {
    server.use(
      http.get(`${BASE}/master/work-catalog/:id`, () =>
        HttpResponse.json({ status: "SUCCESS", data: detailRecord }),
      ),
    );

    renderShow();

    expect(await screen.findByText("Pengangkutan")).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", { name: "Detail Work Catalog" }),
    ).toHaveLength(2);
    expect(screen.getByText("Jasa angkut barang")).toBeInTheDocument();
    expect(screen.getByText("PPN 11%")).toBeInTheDocument();
    expect(screen.getByText("11/100")).toBeInTheDocument();
    expect(screen.getByText("11%")).toBeInTheDocument();
    expect(screen.getByText("PPh 2%")).toBeInTheDocument();
    expect(screen.getByText("2%")).toBeInTheDocument();
    expect(screen.queryByText("Nama lama PPN")).not.toBeInTheDocument();
  });

  it("falls back to legacy tax rows when the detail has no taxes array", async () => {
    server.use(
      http.get(`${BASE}/master/work-catalog/:id`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          data: {
            ...detailRecord,
            workType: "Nama cadangan",
            taxes: [],
            businessEntityTaxes: [
              { taxId: "77", taxName: "Legacy PPN", coefficient: "3", ratePercent: "3" },
            ],
            individualTaxes: [],
          },
        }),
      ),
    );

    renderShow();

    expect(await screen.findByText("Nama cadangan")).toBeInTheDocument();
    expect(screen.getByText("Legacy PPN")).toBeInTheDocument();
    expect(screen.getByText("3.00")).toBeInTheDocument();
    expect(screen.getByText("3%")).toBeInTheDocument();
    expect(screen.getByText("Tax Subject: Perorangan").parentElement).toHaveTextContent(
      "—",
    );
  });

  it("renders nested category refs from the detail response", async () => {
    server.use(
      http.get(`${BASE}/master/work-catalog/:id`, () =>
        HttpResponse.json({ status: "SUCCESS", data: detailRecord }),
      ),
    );

    renderShow();

    expect(await screen.findByText("Pengangkutan")).toBeInTheDocument();
    expect(
      screen.getByText("SUB-01.1: Operasional & Utility"),
    ).toBeInTheDocument();
    expect(screen.getByText("Utility & Fasilitas")).toBeInTheDocument();
    expect(screen.getByText("Cash")).toBeInTheDocument();
    expect(screen.getByText("Category A")).toBeInTheDocument();
    expect(screen.getByText("Pengadaan Barang Murni")).toBeInTheDocument();
  });

  it("navigates to edit and back to the list", async () => {
    const user = userEvent.setup();
    renderShow();

    await screen.findByText("Pengangkutan");
    await user.click(screen.getByRole("button", { name: "Edit" }));
    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(navigate).toHaveBeenNthCalledWith(
      1,
      "/master-data/work-catalog/1/edit",
    );
    expect(navigate).toHaveBeenNthCalledWith(2, "/master-data/work-catalog");
  });
});
