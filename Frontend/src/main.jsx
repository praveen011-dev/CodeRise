import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router as myAppRoutes } from "./router"; //effectively resolves to src/router/index.jsx.
import "./index.css";

// ✅ Apply saved theme before app renders
const savedTheme = localStorage.getItem("theme");
const html = document.documentElement;
if (savedTheme === "dark") {
  html.classList.add("dark");
} else {
  html.classList.remove("dark");
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={myAppRoutes} />
  </React.StrictMode>
);
