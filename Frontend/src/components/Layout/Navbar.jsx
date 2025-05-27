import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore"; // Adjust path if needed
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import from Shadcn/UI
import { CircleUserRound } from "lucide-react";
// You might want an icon for the trigger, e.g., from lucide-react

function Navbar() {
  const { isLoggedIn, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleProfileNavigate = () => {
    navigate("/profile"); // You'll create this page later
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
          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 hover:text-slate-300 focus:outline-none">
                  <CircleUserRound className="h-5 w-5" />
                  <span>{user.username || user.email || "Account"}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 " align="end">
                {" "}
                {/* Added mr-2 for slight offset if needed */}
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleProfileNavigate}
                  className="cursor-pointer"
                >
                  My Profile
                </DropdownMenuItem>
                {/* Add other links here if needed, e.g., Settings */}
                {/* <DropdownMenuItem className="cursor-pointer">
                  Settings
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
