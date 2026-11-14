import {
  ExcelIcon,
  GenericFileIcon,
  PdfIcon,
} from "@/shared/components/icons/document-icons";
import { render } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it } from "vitest";

describe("document-icons", () => {
  it("renders PdfIcon svg with PDF label", () => {
    const { container } = render(<PdfIcon />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.textContent).toContain("PDF");
  });

  it("renders ExcelIcon svg with XLS label", () => {
    const { container } = render(<ExcelIcon />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.textContent).toContain("XLS");
  });

  it.each(["doc", "txt", "csv"])(
    "renders GenericFileIcon with %s label",
    (ext) => {
      const { container } = render(<GenericFileIcon ext={ext} />);
      const svg = container.querySelector("svg");
      expect(svg).not.toBeNull();
      expect(svg?.textContent).toContain(ext.slice(0, 3));
    },
  );
});
