import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import "./locales/i18n";

import "./index.css";
import { Analytics } from '@vercel/analytics/react';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
      <Analytics />
  </React.StrictMode>
);
