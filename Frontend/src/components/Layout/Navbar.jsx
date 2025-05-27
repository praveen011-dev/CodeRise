// src/components/layout/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

function Navbar() {
  const { isLoggedIn, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-l from-green-600 via-slate-900 to-black text-white p-4 shadow-lg">
      <nav className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold border p-2 rounded hover:bg-slate-700"
        >
          CodeRise
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-slate-300">
            Problems
          </Link>
          {isLoggedIn ? (
            <>
              <span className="text-sm">
                Welcome, {user?.username || user?.email || "User"}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-slate-300">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
