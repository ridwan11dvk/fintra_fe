import { test as base } from "../../../shared/fixtures/base.fixture";
import { CostCenterPage } from "./cost-center.page";

type CostCenterFixtures = {
  costCenterPage: CostCenterPage;
};

export const test = base.extend<CostCenterFixtures>({
  costCenterPage: async ({ page }, use) => {
    const costCenterPage = new CostCenterPage(page);
    await use(costCenterPage);
  },
});

export { expect } from "@playwright/test";
