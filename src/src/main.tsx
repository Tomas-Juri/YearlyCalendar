import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { PrimeReactProvider } from "primereact/api";
import "./styles/index.css";
import "primeicons/primeicons.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </Provider>
  </StrictMode>
);
