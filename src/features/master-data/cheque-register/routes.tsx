import { Route } from "react-router";
import { CHEQUE_REGISTER_BASE } from "./data/cheque-register.utils";
import { ChequeRegisterCreateLazyPage, ChequeRegisterDetailLazyPage, ChequeRegisterEditLazyPage, ChequeRegisterListLazyPage } from "./pages";

export const chequeRegisterRoutes = <Route><Route path={CHEQUE_REGISTER_BASE} element={<ChequeRegisterListLazyPage />} /><Route path={`${CHEQUE_REGISTER_BASE}/create`} element={<ChequeRegisterCreateLazyPage />} /><Route path={`${CHEQUE_REGISTER_BASE}/:id`} element={<ChequeRegisterDetailLazyPage />} /><Route path={`${CHEQUE_REGISTER_BASE}/:id/edit`} element={<ChequeRegisterEditLazyPage />} /></Route>;
