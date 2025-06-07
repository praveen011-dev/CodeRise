import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "../schemas/Signup.schema.js";
import { toast } from "sonner";

// Import Shadcn/UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Import Lucide Icons for eye toggle
import { Eye, EyeOff } from "lucide-react";

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isRHFSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(SignUpSchema),
  });

  const signupAction = useAuthStore((state) => state.signup);
  const isLoadingFromStore = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const clearAuthError = useAuthStore((state) => state.clearError);
  const navigate = useNavigate();

  const isLoading = isRHFSubmitting || isLoadingFromStore;

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  const onSubmit = async (data) => {
    clearAuthError();
    const userData = {
      username: data.username,
      email: data.email,
      password: data.password,
    };

    const result = await signupAction(userData);
    if (result.success) {
      toast.success("Account Created!", {
        description: "Welcome! Please log in to continue.",
      });
      console.log("SignupPage: Signup successful, navigating to login.");
      reset();
      navigate("/login");
    } else {
      toast.error("Signup Failed", {
        description: result.error || "An unexpected error occurred.",
      });
      console.log("SignupPage: Signup failed. Auth store error:", authError);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow grid lg:grid-cols-2 py-8 md:py-16">
        <div className="flex items-center justify-center p-4">
          <Card
            className="
              w-full max-w-md p-6 md:p-8 space-y-6 rounded-xl shadow-2xl relative z-10
              bg-card/70 border border-border/50
              backdrop-blur-md transition-colors duration-500
            "
          >
            <CardHeader className="text-center p-0 pb-4">
              <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
                Create Account
              </CardTitle>
              <CardDescription className="mt-2 text-sm text-muted-foreground">
                Join us and start your coding journey!
              </CardDescription>
            </CardHeader>

            {authError && (
              <div
                className="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-3 mb-4 text-sm"
                role="alert"
              >
                <p>{authError}</p>
              </div>
            )}

            <CardContent className="p-0">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                {/* Username Field */}
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    autoComplete="username"
                    {...register("username")}
                    disabled={isLoading}
                    className={`mt-1 bg-input/80 text-foreground ${
                      errors.username
                        ? "border-destructive focus:ring-destructive"
                        : ""
                    }`}
                    placeholder="Choose a username"
                  />
                  <p
                    className={`text-xs text-destructive min-h-[1.25rem] mt-1 ${
                      errors.username ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {errors.username?.message || "placeholder text for spacing"}
                  </p>
                </div>

                {/* Email Field */}
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register("email")}
                    disabled={isLoading}
                    className={`mt-1 bg-input/80 text-foreground ${
                      errors.email
                        ? "border-destructive focus:ring-destructive"
                        : ""
                    }`}
                    placeholder="you@example.com"
                  />
                  <p
                    className={`text-xs text-destructive min-h-[1.25rem] mt-1 ${
                      errors.email ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {errors.email?.message || "placeholder text for spacing"}
                  </p>
                </div>

                {/* Password Field - Added show/hide toggle */}
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      {...register("password")}
                      disabled={isLoading}
                      className={`mt-1 bg-input/80 text-foreground pr-10 ${
                        errors.password
                          ? "border-destructive focus:ring-destructive"
                          : ""
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button" // Important: type="button" to prevent form submission
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </button>
                  </div>
                  <p
                    className={`text-xs text-destructive min-h-[1.25rem] mt-1 ${
                      errors.password ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {errors.password?.message || "placeholder text for spacing"}
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      {...register("confirmPassword")}
                      disabled={isLoading}
                      className={`mt-1 bg-input/80 text-foreground pr-10 ${
                        errors.confirmPassword
                          ? "border-destructive focus:ring-destructive"
                          : ""
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button" // Important: type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                      <span className="sr-only">
                        {showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"}
                      </span>
                    </button>
                  </div>
                  <p
                    className={`text-xs text-destructive min-h-[1.25rem] mt-1 ${
                      errors.confirmPassword ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {errors.confirmPassword?.message ||
                      "placeholder text for spacing"}
                  </p>
                </div>

                <div>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </form>
              <p className="mt-6 text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary/80 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="hidden lg:flex items-center justify-center p-10 text-center">
          <div className="text-foreground">
            <h1 className="text-4xl font-bold mb-4">Welcome to CodeRise!</h1>
            <p className="text-xl">Start building amazing projects today.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
