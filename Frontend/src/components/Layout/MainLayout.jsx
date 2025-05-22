import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./footer";
import Navbar from "./navbar";

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {" "}
      {/* Main site background */}
      <Navbar />
      <main className="flex-grow container mx-auto py-6 px-4">
        {" "}
        {/* Content area */}
        <Outlet />{" "}
        {/* This is where React Router will render the current page */}
      </main>
      <Footer />
    </div>
  );
}
export default MainLayout;
