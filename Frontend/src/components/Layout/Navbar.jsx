import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Keep Link, useNavigate, useLocation
import useAuthStore from "../../store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import ThemeToggle from "../ThemeToggle/ThemeToggle";
import useThemeDetector from "../../hooks/useThemeDetector";

import CodeRiseLogoLight from "../../assets/lightlogo.png";
import CodeRiseLogoDark from "../../assets/darklogo.png";

function Navbar() {
  const { isLoggedIn, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useThemeDetector();

  const [scrolled, setScrolled] = useState(false);

  const handleSmoothScroll = (id) => {
    // If the current path is not the homepage ('/')
    if (location.pathname !== "/") {
      navigate("/", { replace: true });
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // If already on the homepage, directly scroll to the element
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleProfileNavigate = () => {
    navigate("/profile");
  };

  const handleAddProblemNavigate = () => {
    navigate("/admin/add-problem");
  };

  const displayUserWithRole = () => {
    if (!user) return "Account";
    const name = user.username || user.email || "User";
    return user.role ? `${name} (${user.role.toUpperCase()})` : name;
  };

  const getAvatarContent = () => {
    if (user?.image) {
      return (
        <AvatarImage src={user.image} alt={`${user.username}'s profile`} />
      );
    } else if (user?.username) {
      const nameParts = user.username.split(" ");
      let initials = "";
      if (nameParts.length > 0) {
        initials += nameParts[0][0];
        if (nameParts.length > 1) {
          initials += nameParts[nameParts.length - 1][0];
        }
      }
      return <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>;
    }
    return <AvatarFallback>USR</AvatarFallback>;
  };

  return (
    <header
      className={`
        sticky top-0 z-50 w-full p-4 shadow-lg border-b border-border/20
        transition-all duration-300 ease-in-out
        ${scrolled ? "bg-background/80 backdrop-blur-md" : "bg-transparent"}
      `}
    >
      <nav className="container mx-auto flex justify-between items-center">
        {/* Left: CodeRise Logo/Brand */}
        <Link
          to="/"
          // className="text-xl font-bold border p-2 rounded hover:bg-muted transition-colors duration-200 text-foreground"
        >
          {/* Conditional logo rendering based on theme */}
          {theme === "dark" ? (
            <img
              src={CodeRiseLogoDark}
              alt="CodeRise Logo Dark"
              className="h-8 md:h-10"
            />
          ) : (
            <img
              src={CodeRiseLogoLight}
              alt="CodeRise Logo Light"
              className="h-8 md:h-10"
            />
          )}
          {/* Optional: If you want text alongside the logo, or as a fallback */}
          {/* <span className="ml-2 text-foreground">CodeRise</span> */}
        </Link>

        {/* Center: Main Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="hover:text-foreground/80 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/problems"
            className="hover:text-foreground/80 transition-colors duration-200"
          >
            Problems
          </Link>

          {/* Changed 'About' from Link to <a> tag and added onClick */}
          <a
            href="#about" // Semantic HTML for anchor links
            onClick={(e) => {
              e.preventDefault(); // Prevent default browser jump behavior
              handleSmoothScroll("about"); // Call our custom smooth scroll function
            }}
            className="hover:text-foreground/80 transition-colors duration-200"
          >
            About
          </a>

          <a
            href="#pricing"
            onClick={(e) => {
              e.preventDefault(); // Prevent default browser jump behavior
              handleSmoothScroll("pricing"); // Call custom function
            }}
            className="hover:text-foreground/80 transition-colors duration-200"
          >
            Pricing
          </a>
        </div>

        {/* Right: User Actions and Theme Toggle */}
        <div className="flex items-center space-x-4">
          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 hover:text-foreground/80 focus:outline-none transition-colors duration-200">
                  <Avatar className="h-8 w-8 border-2 border-primary-foreground">
                    {getAvatarContent()}
                  </Avatar>
                  <span className="hidden sm:inline">
                    {user.username || user.email || "Account"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="
                  w-48 mr-2 md:mr-0
                  bg-popover/80 border border-border/50 rounded-md shadow-lg
                  backdrop-blur-md transition-colors duration-300
                  text-popover-foreground
                "
                align="end"
              >
                <DropdownMenuLabel className="text-popover-foreground">
                  {displayUserWithRole()}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem
                  onClick={handleProfileNavigate}
                  className="cursor-pointer hover:bg-accent/30 hover:text-accent-foreground"
                >
                  My Profile
                </DropdownMenuItem>
                {user.role === "ADMIN" && (
                  <DropdownMenuItem
                    onClick={handleAddProblemNavigate}
                    className="cursor-pointer hover:bg-accent/30 hover:text-accent-foreground"
                  >
                    Add Problem
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="
                    cursor-pointer text-destructive
                    hover:!bg-destructive/30 hover:!text-destructive-foreground
                    focus:bg-destructive/30 focus:text-destructive-foreground
                  "
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="hover:text-foreground/80 transition-colors duration-200"
            >
              Login
            </Link>
          )}

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
