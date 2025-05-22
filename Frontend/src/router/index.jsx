//Main Routing Configuration

import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ProblemDetailPage from "../pages/ProblemDetailPage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/problems/:problemId",
    element: <ProblemDetailPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
