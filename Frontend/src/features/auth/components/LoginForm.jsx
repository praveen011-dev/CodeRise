// src/features/auth/components/LoginForm.jsx
import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../schemas/Login.schema.js"; // Import login schema
import useAuthStore from "../../../store/authStore"; // Import auth store

function LoginForm() {
  const {
    register, // RHF register function
    handleSubmit, // RHF submit handler
    formState: { errors, isSubmitting: isRHFSubmitting }, // Form errors and RHF submitting state
    reset, // RHF reset function
  } = useForm({
    resolver: zodResolver(LoginSchema), // Use Zod for login validation
  });

  // Auth store hooks
  const loginAction = useAuthStore((state) => state.login);
  const isLoadingFromStore = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const clearAuthError = useAuthStore((state) => state.clearError);
  const navigate = useNavigate();

  // Combine loading states
  const isLoading = isRHFSubmitting || isLoadingFromStore;

  useEffect(() => {
    clearAuthError(); // Clear previous auth errors on mount
  }, [clearAuthError]);

  // Form submission logic
  const onSubmit = async (data) => {
    clearAuthError(); // Clear previous errors
    const result = await loginAction({
      email: data.email,
      password: data.password,
    });
    if (result.success) {
      console.log("LoginForm: Login successful, navigating to home.");
      reset(); // Reset form on successful login
      navigate("/"); // Redirect to homepage
    } else {
      console.log("LoginForm: Login failed.", authError);
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Decorative Panel (Optional, can be different from signup) */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-700 to-green-600 hidden lg:flex items-center justify-center">
        <div className="text-center text-white p-10">
          <h1 className="text-4xl font-bold mb-4">CodeRise Login</h1>
          <p className="text-xl">
            Access your account and continue your projects.
          </p>
        </div>
      </div>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back!</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to continue your journey.
          </p>
        </div>

        {/* Display global auth errors (e.g., from API) */}
        {authError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{authError}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")} // Register email input
              disabled={isLoading}
              className={`mt-1 block w-full px-4 py-3 border ${
                errors.email ? "border-red-500" : "border-slate-300"
              } rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-slate-50`}
              placeholder="you@example.com"
            />
            {errors.email && ( // Display email validation error
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
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
              type="password"
              autoComplete="current-password"
              {...register("password")} // Register password input
              disabled={isLoading}
              className={`mt-1 block w-full px-4 py-3 border ${
                errors.password ? "border-red-500" : "border-slate-300"
              } rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-slate-50`}
              placeholder="••••••••"
            />
            {errors.password && ( // Display password validation error
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Optional: Add a "Forgot password?" link here */}
          {/* <div className="text-sm text-right">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Forgot password?
          </a>
        </div> */}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>
        <p className="mt-8 text-sm text-center text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/signup" // Link to your signup page
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
