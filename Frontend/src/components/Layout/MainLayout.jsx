import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";
import useAuthStore from "../../store/authStore"; // Adjust path if needed

function MainLayout() {
  // Get the action to check auth status from our Zustand store
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  // Local state to know if we are currently trying to verify an existing session
  const [isVerifyingSession, setIsVerifyingSession] = useState(true);

  useEffect(() => {
    // This function runs once when MainLayout first loads
    const initializeAuth = async () => {
      try {
        // Ask the store to check if there's an active session (via cookies)
        await checkAuthStatus();
      } catch (error) {
        // checkAuthStatus in the store already handles setting isLoggedIn to false on error
        console.log(
          "Initial session check completed (no active session or error)."
        );
      } finally {
        // Whether successful or not, the initial verification attempt is done
        setIsVerifyingSession(false);
      }
    };
    initializeAuth();
  }, [checkAuthStatus]); // Runs once on mount because checkAuthStatus reference is stable

  // Show a loading indicator for the whole page while we verify the session
  if (isVerifyingSession) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        Loading Application...
      </div>
    );
  }

  // Once session verification is done, render the main application layout
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
