import { setupConfigurationService } from "@/features/settings/setup-configuration/data/setup-configuration.service";
import {
  getStoredComplianceFssc,
  getStoredFinancialControlValidation,
  saveStoredComplianceFssc,
  saveStoredFinancialControlValidation,
} from "@/features/settings/setup-configuration/data/setup-configuration.mock";
import { describe, expect, it, beforeEach } from "vitest";

describe("setupConfigurationService", () => {
  beforeEach(() => {
    localStorage.clear();
    saveStoredComplianceFssc([]);
    saveStoredFinancialControlValidation([]);
  });

  describe("getComplianceFsscItems()", () => {
    it("[FSSC-COMP-002] returns stored compliance checklist items", async () => {
      saveStoredComplianceFssc([
        { id: "fssc-1", name: "Checklist A", description: "Desc A" },
      ]);

      const result = await setupConfigurationService.getComplianceFsscItems();

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toEqual([
        { id: "fssc-1", name: "Checklist A", description: "Desc A" },
      ]);
    });

    it("[FSSC-COMP-009] returns an empty list when nothing is stored", async () => {
      const result = await setupConfigurationService.getComplianceFsscItems();

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toEqual([]);
    });
  });

  describe("saveComplianceFsscItems()", () => {
    it("[FSSC-COMP-011] persists compliance checklist items", async () => {
      const items = [
        { id: "fssc-new", name: "New checklist", description: "Saved desc" },
      ];

      const result = await setupConfigurationService.saveComplianceFsscItems({
        items,
      });

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toEqual(items);
      expect(getStoredComplianceFssc()).toEqual(items);
    });

    it("[FSSC-COMP-012] persists checklist item with only Checklist Name", async () => {
      const items = [{ id: "fssc-name-only", name: "Name only", description: "" }];
      const result = await setupConfigurationService.saveComplianceFsscItems({
        items,
      });
      expect(result.data).toEqual(items);
    });

    it("[FSSC-COMP-014] persists more than one checklist item in one Save", async () => {
      const items = [
        { id: "a", name: "A", description: "" },
        { id: "b", name: "B", description: "B desc" },
      ];
      const result = await setupConfigurationService.saveComplianceFsscItems({
        items,
      });
      expect(result.data).toHaveLength(2);
    });

    it("[FSSC-COMP-017] persists Description change on existing checklist card", async () => {
      const items = [
        { id: "fssc-1", name: "Checklist A", description: "Changed" },
      ];
      await setupConfigurationService.saveComplianceFsscItems({ items });
      expect(getStoredComplianceFssc()[0]?.description).toBe("Changed");
    });

    it("[FSSC-COMP-018] persists emptied Description on existing checklist card", async () => {
      const items = [{ id: "fssc-1", name: "Checklist A", description: "" }];
      await setupConfigurationService.saveComplianceFsscItems({ items });
      expect(getStoredComplianceFssc()[0]?.description).toBe("");
    });

    it("[FSSC-COMP-020] persists after deleting a checklist item", async () => {
      await setupConfigurationService.saveComplianceFsscItems({
        items: [
          { id: "keep", name: "Keep", description: "" },
          { id: "drop", name: "Drop", description: "" },
        ],
      });
      const remaining = [{ id: "keep", name: "Keep", description: "" }];
      await setupConfigurationService.saveComplianceFsscItems({ items: remaining });
      expect(getStoredComplianceFssc()).toEqual(remaining);
    });

    it("[FSSC-COMP-022] Save stores the full Compliance FSSC tab payload", async () => {
      const items = [
        { id: "1", name: "One", description: "d1" },
        { id: "2", name: "Two", description: "d2" },
      ];
      const result = await setupConfigurationService.saveComplianceFsscItems({
        items,
      });
      expect(result.status).toBe("SUCCESS");
      expect(getStoredComplianceFssc()).toEqual(items);
    });
  });

  describe("getFinancialControlValidationItems()", () => {
    it("[FSSC-FCV-002] returns stored financial control validation items", async () => {
      saveStoredFinancialControlValidation([
        { id: "fcv-1", title: "Title A", subTitle: "Sub A" },
      ]);

      const result =
        await setupConfigurationService.getFinancialControlValidationItems();

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toEqual([
        { id: "fcv-1", title: "Title A", subTitle: "Sub A" },
      ]);
    });

    it("[FSSC-FCV-009] returns an empty list when nothing is stored", async () => {
      const result =
        await setupConfigurationService.getFinancialControlValidationItems();

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toEqual([]);
    });
  });

  describe("saveFinancialControlValidationItems()", () => {
    it("[FSSC-FCV-011] persists financial control validation items", async () => {
      const items = [{ id: "fcv-new", title: "Control", subTitle: "Detail" }];

      const result =
        await setupConfigurationService.saveFinancialControlValidationItems({
          items,
        });

      expect(result.status).toBe("SUCCESS");
      expect(result.data).toEqual(items);
      expect(getStoredFinancialControlValidation()).toEqual(items);
    });

    it("[FSSC-FCV-012] persists parameter with Title only", async () => {
      const items = [{ id: "fcv-1", title: "Title only", subTitle: "" }];
      const result =
        await setupConfigurationService.saveFinancialControlValidationItems({
          items,
        });
      expect(result.data).toEqual(items);
    });

    it("[FSSC-FCV-014] persists more than one parameter in one Save", async () => {
      const items = [
        { id: "a", title: "A", subTitle: "" },
        { id: "b", title: "B", subTitle: "Sub" },
      ];
      const result =
        await setupConfigurationService.saveFinancialControlValidationItems({
          items,
        });
      expect(result.data).toHaveLength(2);
    });

    it("[FSSC-FCV-017] persists Title change on existing parameter", async () => {
      const items = [{ id: "fcv-1", title: "Changed", subTitle: "Sub" }];
      await setupConfigurationService.saveFinancialControlValidationItems({
        items,
      });
      expect(getStoredFinancialControlValidation()[0]?.title).toBe("Changed");
    });

    it("[FSSC-FCV-018] persists Sub Title change on existing parameter", async () => {
      const items = [{ id: "fcv-1", title: "Title", subTitle: "New sub" }];
      await setupConfigurationService.saveFinancialControlValidationItems({
        items,
      });
      expect(getStoredFinancialControlValidation()[0]?.subTitle).toBe("New sub");
    });

    it("[FSSC-FCV-019] persists emptied Sub Title on existing parameter", async () => {
      const items = [{ id: "fcv-1", title: "Title", subTitle: "" }];
      await setupConfigurationService.saveFinancialControlValidationItems({
        items,
      });
      expect(getStoredFinancialControlValidation()[0]?.subTitle).toBe("");
    });

    it("[FSSC-FCV-021] persists after deleting a parameter", async () => {
      await setupConfigurationService.saveFinancialControlValidationItems({
        items: [
          { id: "keep", title: "Keep", subTitle: "" },
          { id: "drop", title: "Drop", subTitle: "" },
        ],
      });
      const remaining = [{ id: "keep", title: "Keep", subTitle: "" }];
      await setupConfigurationService.saveFinancialControlValidationItems({
        items: remaining,
      });
      expect(getStoredFinancialControlValidation()).toEqual(remaining);
    });

    it("[FSSC-FCV-025] Save stores the full Financial Control Validation tab payload", async () => {
      const items = [
        { id: "1", title: "One", subTitle: "s1" },
        { id: "2", title: "Two", subTitle: "s2" },
      ];
      const result =
        await setupConfigurationService.saveFinancialControlValidationItems({
          items,
        });
      expect(result.status).toBe("SUCCESS");
      expect(getStoredFinancialControlValidation()).toEqual(items);
    });
  });
});
