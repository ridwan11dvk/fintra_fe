import { test as base } from "../../../shared/fixtures/base.fixture";
import { UnitOfMeasurePage } from "./unit-of-measure.page";

type UnitOfMeasureFixtures = {
  unitOfMeasurePage: UnitOfMeasurePage;
};

export const test = base.extend<UnitOfMeasureFixtures>({
  unitOfMeasurePage: async ({ page }, use) => {
    const unitOfMeasurePage = new UnitOfMeasurePage(page);
    await use(unitOfMeasurePage);
  },
});

export { expect } from "@playwright/test";
