import { test as base } from "../../../shared/fixtures/base.fixture";
import { DistrictPage } from "./district.page";

type DistrictFixtures = {
  districtPage: DistrictPage;
};

export const test = base.extend<DistrictFixtures>({
  districtPage: async ({ page }, use) => {
    const districtPage = new DistrictPage(page);
    await use(districtPage);
  },
});

export { expect } from "@playwright/test";
