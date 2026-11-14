import { lazy } from "react";

export const M2mClientLazyPage = lazy(() =>
  import("./m2m-client.page").then((mod) => ({
    default: mod.M2mClientPage,
  })),
);

export const AddM2mClientLazyPage = lazy(() =>
  import("./add-m2m-client.page").then((mod) => ({
    default: mod.AddM2mClientPage,
  })),
);

export const ShowM2mClientLazyPage = lazy(() =>
  import("./show-m2m-client.page").then((mod) => ({
    default: mod.ShowM2mClientPage,
  })),
);

export const EditM2mClientLazyPage = lazy(() =>
  import("./edit-m2m-client.page").then((mod) => ({
    default: mod.EditM2mClientPage,
  })),
);
