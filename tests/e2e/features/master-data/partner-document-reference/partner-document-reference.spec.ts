import { expect, test } from "./partner-document-reference.fixture";

test.describe("Partner Document Reference Master Data", () => {
  test.beforeEach(async ({ partnerDocumentReferencePage }) => {
    await partnerDocumentReferencePage.goto();
    await partnerDocumentReferencePage.waitForTableLoad();
  });

  test("should display the partner document reference page", async ({
    partnerDocumentReferencePage,
  }) => {
    await expect(partnerDocumentReferencePage.pageTitle).toBeVisible();
  });

  test("should display the data table", async ({
    partnerDocumentReferencePage,
  }) => {
    await expect(
      partnerDocumentReferencePage.dataTable.container,
    ).toBeVisible();
  });

  test("should display add button", async ({
    partnerDocumentReferencePage,
  }) => {
    await expect(partnerDocumentReferencePage.addButton).toBeVisible();
  });
});
