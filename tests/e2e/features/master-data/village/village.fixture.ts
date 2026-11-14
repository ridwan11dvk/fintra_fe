import { test as base } from "../../../shared/fixtures/base.fixture";
import { VillagePage } from "./village.page";

type VillageFixtures = {
  villagePage: VillagePage;
};

export const test = base.extend<VillageFixtures>({
  villagePage: async ({ page }, use) => {
    const villagePage = new VillagePage(page);
    await use(villagePage);
  },
});

export { expect } from "@playwright/test";
