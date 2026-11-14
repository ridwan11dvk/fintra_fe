import { describe, expect, it } from "vitest";

describe("users barrel exports", () => {
  it("should export data modules", async () => {
    const mod = await import("@/features/settings/users/data/external-user.schema");
    expect(mod).toHaveProperty("externalUserSchema");
  });

  it("should export utils", async () => {
    const mod = await import("@/features/settings/users/data/user.utils");
    expect(mod).toHaveProperty("externalUserDetailUrl");
    expect(mod).toHaveProperty("internalUserDetailUrl");
  });

  it("should export service with user methods", async () => {
    const mod = await import("@/features/settings/users/data/user.service");
    expect(mod).toHaveProperty("userService");
    expect(mod.userService).toHaveProperty("createExternalUser");
    expect(mod.userService).toHaveProperty("createInternalUserFromEsa");
    expect(mod.userService).toHaveProperty("createInternalUserDirect");
  });
});
