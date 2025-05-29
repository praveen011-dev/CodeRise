// src/router/index.jsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import HomePage from "../pages/HomePage";
import ProblemDetailPage from "@/features/problems/pages/ProblemDetailPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProblemListPage from "@/features/problems/pages/ProblemListPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import ProtectedRoute from "./ProtectedRoute";

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
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "problems/:problemId",
            element: <ProblemDetailPage />,
          },
          {
            path: "problems",
            element: <ProblemListPage />,
          },
        ],
      },

      // Add other pages that should use MainLayout here later
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
