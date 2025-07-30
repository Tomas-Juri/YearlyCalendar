import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { migrateLocalStorage } from "./utilities/migrations.ts";

// Run migrations before importing store
try {
  migrateLocalStorage();
} catch (error) {
  console.error("Migration failed, using fresh state:", error);
}

import "primeicons/primeicons.css";
import { locale, PrimeReactProvider, updateLocaleOption } from "primereact/api";
import { store } from "./redux/store.ts";
import "./styles/index.css";

updateLocaleOption("firstDayOfWeek", 1, "en");
locale("en");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </Provider>
  </StrictMode>,
);
