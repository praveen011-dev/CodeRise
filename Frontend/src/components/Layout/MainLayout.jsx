import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useAuthStore from "../../store/authStore";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "../ScrollToTop";
import HomePageSkeleton from "@/features/landing/components/HomePageSkeleton";
import ProblemsSkeleton from "@/features/problems/components/ProblemsSkeleton";
import CreateProblemFormSkeleton from "@/features/problems/components/CreateProblemFormSkeleton";
import EditProblemFormSkeleton from "@/features/problems/components/EditProblemFormSkeleton";
import ProfilePageSkeleton from "@/features/auth/components/ProfilePageSkeleton";

// Define a mapping of *exact* paths to their corresponding skeleton components
const ExactPathToSkeletonMap = {
  "/": HomePageSkeleton,
  "/problems": ProblemsSkeleton,
  "/admin/add-problem": CreateProblemFormSkeleton,
  "/profile": ProfilePageSkeleton, // Add this line

  // For other exact paths
};

// Define a mapping of *pattern-based* paths to their corresponding skeleton components
const PatternToSkeletonMap = [
  { path: "/admin/edit-problem/", skeleton: EditProblemFormSkeleton }, 
];

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
            let SpecificSkeleton = null;

            // 1. Check exact paths first
            if (ExactPathToSkeletonMap[location.pathname]) {
              SpecificSkeleton = ExactPathToSkeletonMap[location.pathname];
            } else {
              // 2. Check pattern-based paths
              for (const map of PatternToSkeletonMap) {
                if (location.pathname.startsWith(map.path)) {
                  SpecificSkeleton = map.skeleton;
                  break; // Found a match, no need to check further
                }
              }
            }

            if (SpecificSkeleton) {
              return <SpecificSkeleton />;
            } else {
              // Fallback for paths without a specific skeleton
              return (
                <div className="flex justify-center items-center min-h-screen">
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
