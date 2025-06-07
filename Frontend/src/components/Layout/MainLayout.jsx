import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useAuthStore from "../../store/authStore";
import { Toaster } from "@/components/ui/sonner";

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

  if (isVerifyingSession) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        Loading Application...
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
}
export default MainLayout;
