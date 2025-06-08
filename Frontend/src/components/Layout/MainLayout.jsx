import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useAuthStore from "../../store/authStore";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "../ScrollToTop";
import HomePageSkeleton from "@/features/landing/components/HomePageSkeleton";
import ProblemsSkeleton from "@/features/problems/components/ProblemsSkeleton";

// Define a mapping of paths to their corresponding skeleton components
const PathToSkeletonMap = {
  "/": HomePageSkeleton,
  "/problems": ProblemsSkeleton, // Assuming this is the path to your problems page
  // Add other paths and their skeletons as needed, e.g.:
  // "/dashboard": DashboardSkeleton,
  // "/settings": SettingsSkeleton,
};

function MainLayout() {
  // get the action from the auth store
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  // local state to track session verification
  const [isVerifyingSession, setIsVerifyingSession] = useState(true);

  useEffect(() => {
    // This function runs once when MainLayout first loads
    const initializeAuth = async () => {
      try {
        // ask the store to check the auth status
        await checkAuthStatus();
      } catch (error) {
        console.log(
          "Initial session check completed (no active session or error)."
        );
      } finally {
        setIsVerifyingSession(false);
      }
    };
    initializeAuth();
  }, [checkAuthStatus]);

  return (
    <div>
      <ScrollToTop />
      <Navbar />
      <main>
        {isVerifyingSession ? (
          // If session is still verifying, render the specific skeleton for the current path
          (() => {
            const SpecificSkeleton = PathToSkeletonMap[location.pathname];
            if (SpecificSkeleton) {
              return <SpecificSkeleton />;
            } else {
              // Fallback for paths without a specific skeleton
              return (
                <div className="flex justify-center items-center min-h-screen text-xl">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary dark:border-primary-foreground"></div>
                </div>
              );
            }
          })()
        ) : (
          // Once session verification is complete, render the actual page content via Outlet
          <Outlet />
        )}
      </main>
      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
}
export default MainLayout;
