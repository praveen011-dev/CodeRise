import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../schemas/Login.schema.js"; // Import login schema
import useAuthStore from "../../../store/authStore"; // Import auth store
import { toast } from "sonner";

// Import Shadcn/UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  // Function to call when the form is submitted and valid
  const onSubmit = async (data) => {
    clearAuthError(); // Clear previous API errors
    const result = await loginAction({
      email: data.email,
      password: data.password,
    });
    if (result.success && result.user) {
      toast.success("Login Successful!", {
        // Display success toast
        description: `Welcome back, ${
          result.user.username || result.user.email || "User"
        }!`,
      });
      reset(); // Reset form on successful login
      navigate("/"); // Redirect to homepage
    } else {
      toast.error("Login Failed", {
        // Display error toast
        description: result.error || "Invalid credentials or server error.",
      });
      console.log("LoginForm: Login failed.", result.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      {/* You can wrap this with <Card> for Shadcn styling if you add it */}
      <div className="w-full max-w-md p-6 md:p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
            Welcome Back!
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to continue your journey.
          </p>
        </div>

        {/* Display global auth error from store (e.g., network error before Zod kicks in on backend) */}
        {/* Toasts are usually preferred for success/validation messages from submit */}
        {authError &&
          !isLoading && ( // Show if not loading and there's an error from a previous attempt
            <div
              className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 mb-4 text-sm"
              role="alert"
            >
              <p>{authError}</p>
            </div>
          )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <div>
            <Label htmlFor="email">Email Address / Username</Label>
            <Input
              id="email"
              type="email" // Or "text" if you allow username and schema reflects it
              autoComplete="email"
              {...register("email")} // Register with react-hook-form
              disabled={isLoading}
              className={`mt-3 ${
                errors.email ? "border-red-500 focus:ring-red-500" : ""
              }`}
              placeholder="you@example.com"
            />
            {errors.email && ( // Display client-side validation error from Zod
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")} // Register with react-hook-form
              disabled={isLoading}
              className={`mt-3 ${
                errors.password ? "border-red-500 focus:ring-red-500" : ""
              }`}
              placeholder="••••••••"
            />
            {errors.password && ( // Display client-side validation error from Zod
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </div>
        </form>
        <p className="mt-6 text-sm text-center text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
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
