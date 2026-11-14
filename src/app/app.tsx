import { Toaster } from "@railfinance/core/ui/sonner";
import { BrowserRouter } from "react-router";
import Provider from "./provider";
import AppRoutes from "./routes/routes";

function App() {
  return (
    <BrowserRouter>
      <Provider>
        <Toaster position="top-right" closeButton richColors />
        <AppRoutes />
      </Provider>
    </BrowserRouter>
  );
}

export default App;
