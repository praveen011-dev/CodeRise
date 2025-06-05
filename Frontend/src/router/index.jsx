import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import HomePage from "../pages/HomePage";
import ProblemDetailPage from "@/features/problems/pages/ProblemDetailPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProblemListPage from "@/features/problems/pages/ProblemListPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import ProtectedRoute from "./ProtectedRoute";
import AddProblemPage from "@/features/problems/pages/AddProblemPage";
import ProfilePage from "../features/auth/pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/", // Matches the homepage URL
    element: <MainLayout />, // So, render MainLayout
    errorElement: <NotFoundPage />,
    children: [
      /* all childeren pages like hompage,login,singup,ProtectedRoute group
                 will be rendered *inside* MainLayout's <Outlet />*/
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
          {
            path: "profile", //
            element: <ProfilePage />,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["ADMIN"]} />, // Pass the allowed roles
        children: [
          { path: "admin/add-problem", element: <AddProblemPage /> },
          // Add other admin-only routes here
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
