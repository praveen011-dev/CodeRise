// src/router/index.jsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout"; // Correct path to your MainLayout
import HomePage from "../pages/HomePage";
import ProblemDetailPage from "../pages/ProblemDetailPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProblemListPage from "@/pages/ProblemListPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "problems/:problemId",
        element: <ProblemDetailPage />,
      },
      {
        path: "problems",
        element: <ProblemListPage />,
      },
      // Add other pages that should use MainLayout here later
    ],
  },
  {
    // Routes that should NOT use MainLayout (e.g., a full-page login if you had one)
    // For now, we only have the catch-all outside.
    path: "*",
    element: <NotFoundPage />,
  },
]);
