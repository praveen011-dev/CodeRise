import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";

// You can import Shadcn/UI components here if you've added them
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginAction = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const clearAuthError = useAuthStore((state) => state.clearError);

  const navigate = useNavigate();

  // Clear error when component mounts or identifier/password changes
  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAuthError(); // Clear previous errors before a new attempt

    // console.log("Login form submitted with:", { email, password });
    const result = await loginAction({ email, password });

    if (result.success) {
      console.log("LoginPage: Login successful, navigating to home.");
      navigate("/");
    } else {
      console.log("LoginPage: Login failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        {" "}
        {/* Using Card-like styling with Tailwind */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back!</h2>
          <p className="mt-2 text-sm text-slate-600">
            Please sign in to continue
          </p>
        </div>
        {/* {authError && <p className="text-sm text-red-500 text-center">{authError}</p>} */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email Address / Username
            </label>
            <input
              id="email"
              name="email"
              type="email" // Or "text" if you allow username for login
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          {/* Optional: Add "Forgot password?" link here */}
          {/* <div className="text-sm text-right">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot your password?
            </a>
          </div> */}

          <div>
            <button
              type="submit"
              // disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
            >
              {/* {isLoading ? 'Signing in...' : 'Sign In'} */}
              Sign In
            </button>
          </div>
        </form>
        <p className="mt-6 text-sm text-center text-slate-600">
          Not a member?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
