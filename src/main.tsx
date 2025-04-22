import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/index";
import "@scss/root.scss";
createRoot(document.getElementById("root")!).render(
  <StrictMode>

      <App />
  </StrictMode>
);
