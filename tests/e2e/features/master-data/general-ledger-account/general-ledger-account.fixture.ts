import { test as base } from "../../../shared/fixtures/base.fixture";
import { GeneralLedgerAccountPage } from "./general-ledger-account.page";

type GeneralLedgerAccountFixtures = {
  generalLedgerAccountPage: GeneralLedgerAccountPage;
};

export const test = base.extend<GeneralLedgerAccountFixtures>({
  generalLedgerAccountPage: async ({ page }, use) => {
    const generalLedgerAccountPage = new GeneralLedgerAccountPage(page);
    await use(generalLedgerAccountPage);
  },
});

export { expect } from "@playwright/test";
