import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { locale, PrimeReactProvider, updateLocaleOption } from "primereact/api";
import "./styles/index.css";
import "primeicons/primeicons.css";

updateLocaleOption("firstDayOfWeek", 1, "en");
locale("en");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </Provider>
  </StrictMode>
);
