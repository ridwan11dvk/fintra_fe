import { test as base } from "../../../shared/fixtures/base.fixture";
import { PartnerDocumentReferencePage } from "./partner-document-reference.page";

type PartnerDocumentReferenceFixtures = {
  partnerDocumentReferencePage: PartnerDocumentReferencePage;
};

export const test = base.extend<PartnerDocumentReferenceFixtures>({
  partnerDocumentReferencePage: async ({ page }, use) => {
    const partnerDocumentReferencePage = new PartnerDocumentReferencePage(page);
    await use(partnerDocumentReferencePage);
  },
});

export { expect } from "@playwright/test";
