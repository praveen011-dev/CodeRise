// src/features/auth/pages/SignupPage.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "../schemas/Signup.schema.js";

// Assuming you might use Shadcn/UI components later:
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

function SignupForm() {
  const {
    register,
    handleSubmit, // RHF's submit handler
    formState: { errors, isSubmitting: isRHFSubmitting }, // Form errors and submitting state from RHF
    reset, // Optional: function to reset form fields
  } = useForm({
    resolver: zodResolver(SignUpSchema), // Use Zod for validation
  });

  //   const [username, setUsername] = useState("");
  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");
  //   const [confirmPassword, setConfirmPassword] = useState("");
  //   const [formError, setFormError] = useState(null); // for showing form errors.

  // Get what you need from the auth store - for now, mainly for consistency or future use
  const signupAction = useAuthStore((state) => state.signup);
  const isLoadingFromStore = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const clearAuthError = useAuthStore((state) => state.clearError);
  const navigate = useNavigate();

  // Combine RHF's submitting state with store's loading state
  const isLoading = isRHFSubmitting || isLoadingFromStore;

  useEffect(() => {
    clearAuthError(); // Clear auth store errors on mount
  }, [clearAuthError]);

  // Submission handler for RHF
  const onSubmit = async (data) => {
    clearAuthError(); // Clear previous auth store errors

    const userData = {
      // Prepare data for signup action
      username: data.username,
      email: data.email,
      password: data.password,
    };

    const result = await signupAction(userData); // Call signup action
    if (result.success) {
      console.log("SignupPage: Signup successful, navigating to login.");
      reset(); // Optional: reset form fields after successful submission
      navigate("/"); // Redirect after successful signup
    } else {
      // Auth error is set in the authStore by signupAction
      // It will be displayed by the {authError && ...} block in the JSX
      console.log("SignupPage: Signup failed. Auth store error:", authError);
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Join us and start your coding journey!
            </p>
          </div>

          {/* Display global auth errors (e.g., from API if connected) */}

          {authError && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {" "}
            {/* Reduced space-y slightly */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                {...register("username")} // Register input
                disabled={isLoading}
                className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-slate-50"
                placeholder="Choose a username"
              />
              {errors.username && ( // Display field-specific error
                <p className="mt-1 text-xs text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                {...register("email")} // Register input
                disabled={isLoading}
                className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-slate-50"
                placeholder="you@example.com"
              />
              {errors.email && ( // Display field-specific error
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
                name="password"
                type="password"
                autoComplete="new-password"
                {...register("password")} // Register input
                disabled={isLoading}
                className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-slate-50"
                placeholder="••••••••"
              />
              {errors.password && ( // Display field-specific error
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword")} // Register input
                disabled={isLoading}
                className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-slate-50"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
          <p className="mt-6 text-sm text-center text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <div className="bg-gradient-to-r from-green-600 via-slate-900 to-black   hidden lg:flex items-center justify-center">
        <div className="text-center text-white p-10">
          <h1 className="text-4xl font-bold mb-4">Welcome to CodeRise!</h1>
          <p className="text-xl">Start building amazing projects today.</p>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
