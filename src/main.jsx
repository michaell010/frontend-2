import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "./index.css";
import AppRouter from "./routes/AppRouter";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      <AppRouter />

      {/* 🔥 Toaster GLOBAL */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#1f2937",
            color: "#fff",
            fontWeight: "500",
          },
          success: {
            duration: 2500,
          },
          error: {
            duration: 4000,
          },
        }}
      />
    </>
  </StrictMode>
);