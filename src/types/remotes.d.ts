// Type declarations for Module Federation remotes consumed by this host.
// Both host and remote build with `dts: false`, so the exposed modules are
// declared manually here until dts generation is enabled.

declare module "tax/TaxRoutes" {
  import type { ComponentType } from "react";

  const TaxRoutes: ComponentType;
  export default TaxRoutes;
}

declare module "payable/PayableRoutes" {
  import type { ComponentType } from "react";

  const PayableRoutes: ComponentType;
  export default PayableRoutes;
}
