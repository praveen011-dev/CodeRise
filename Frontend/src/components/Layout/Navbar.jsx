import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUserRound } from "lucide-react";

function Navbar() {
  const { isLoggedIn, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleProfileNavigate = () => {
    navigate("/profile");
  };

  return (
    <header className="bg-gradient-to-l from-green-600 via-slate-900 to-black text-white p-4 shadow-lg">
      <nav className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold border p-2 rounded hover:bg-slate-700 transition-colors duration-200"
        >
          CodeRise
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="hover:text-slate-300 transition-colors duration-200"
          >
            Problems
          </Link>

          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 hover:text-slate-300 focus:outline-none transition-colors duration-200">
                  <CircleUserRound className="h-6 w-6" />{" "}
                  {/* Icon added here */}
                  <span className="hidden sm:inline">
                    {user.username || user.email || "Account"}
                  </span>{" "}
                  {/* Username/email, hidden on very small screens */}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 mr-2 md:mr-0" align="end">
                <DropdownMenuLabel>
                  {user.username || user.email || "My Account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleProfileNavigate}
                  className="cursor-pointer"
                >
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-500 hover:!bg-red-500 hover:!text-white focus:bg-red-500 focus:text-white"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="hover:text-slate-300 transition-colors duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
