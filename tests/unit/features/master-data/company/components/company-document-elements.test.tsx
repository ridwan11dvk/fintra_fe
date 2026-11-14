import { render, screen } from "@tests/unit/utils/render-with-providers";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  CompanyDocumentElements,
  type CompanyDocumentElementsRef,
} from "@/features/master-data/company/components/company-document-elements";

function createMockFile(name: string, size: number, type = "image/png") {
  return new File([new ArrayBuffer(size)], name, { type });
}

async function uploadFile(sectionIndex: number, file: File) {
  const user = userEvent.setup();
  const inputs = document.querySelectorAll<HTMLInputElement>(
    'input[type="file"]',
  );
  await user.upload(inputs[sectionIndex], file);
}

describe("CompanyDocumentElements", () => {
  it("renders card with title and description", () => {
    render(<CompanyDocumentElements />);
    expect(screen.getByText("Company Document Elements")).toBeInTheDocument();
    expect(
      screen.getByText(/attach company document elements/i),
    ).toBeInTheDocument();
  });

  it("shows upload buttons for logo, header, and footer", () => {
    render(<CompanyDocumentElements />);
    expect(screen.getByText("Upload Logo")).toBeInTheDocument();
    expect(screen.getByText("Upload Header")).toBeInTheDocument();
    expect(screen.getByText("Upload Footer")).toBeInTheDocument();
  });

  it("shows 'Change Logo' text after a file is selected", async () => {
    render(<CompanyDocumentElements />);
    const file = createMockFile("logo.png", 1024);
    await uploadFile(0, file);

    expect(await screen.findByText("Change Logo")).toBeInTheDocument();
    expect(await screen.findByText(/Selected: logo.png/)).toBeInTheDocument();
  });

  it("displays error when file exceeds 10MB", async () => {
    render(<CompanyDocumentElements />);
    const largeFile = createMockFile("large.png", 11 * 1024 * 1024);
    await uploadFile(0, largeFile);

    expect(
      await screen.findByText(/File size exceeds 10MB limit/),
    ).toBeInTheDocument();
    expect(screen.getByText("Upload Logo")).toBeInTheDocument();
  });

  it("disables buttons when isLoading is true", () => {
    render(<CompanyDocumentElements isLoading={true} />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it("getFiles returns null for all files when nothing is selected", () => {
    const ref = createRef<CompanyDocumentElementsRef>();
    render(<CompanyDocumentElements ref={ref} />);

    const files = ref.current?.getFiles();
    expect(files).toEqual({ logo: null, header: null, footer: null });
  });

  it("getFiles returns selected files", async () => {
    const ref = createRef<CompanyDocumentElementsRef>();
    render(<CompanyDocumentElements ref={ref} />);

    const logoFile = createMockFile("logo.png", 1024);
    await uploadFile(0, logoFile);

    const headerFile = createMockFile("header.png", 2048);
    await uploadFile(1, headerFile);

    await vi.waitFor(() => {
      const files = ref.current?.getFiles();
      expect(files?.logo).toBeInstanceOf(File);
      expect(files?.header).toBeInstanceOf(File);
      expect(files?.footer).toBeNull();
    });
  });

  it("removes logo file when remove button is clicked", async () => {
    render(<CompanyDocumentElements />);
    const file = createMockFile("logo.png", 1024);
    await uploadFile(0, file);

    expect(await screen.findByText("Change Logo")).toBeInTheDocument();

    // Click the trash/remove overlay button
    const trashIcon = document.querySelector(".lucide-trash-2");
    const removeBtn = trashIcon?.closest("button");
    removeBtn?.click();

    expect(await screen.findByText("Upload Logo")).toBeInTheDocument();
  });
});
