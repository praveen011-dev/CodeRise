import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../schemas/Login.schema.js";
import useAuthStore from "../../../store/authStore";
import { toast } from "sonner";

// Import Shadcn/UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Import Lucide Icons for eye toggle
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isRHFSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const loginAction = useAuthStore((state) => state.login);
  const isLoadingFromStore = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const clearAuthError = useAuthStore((state) => state.clearError);
  const navigate = useNavigate();

  const isLoading = isRHFSubmitting || isLoadingFromStore;

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  const onSubmit = async (data) => {
    clearAuthError();
    const result = await loginAction({
      email: data.email,
      password: data.password,
    });
    if (result.success && result.user) {
      toast.success("Login Successful!", {
        description: `Welcome back, ${
          result.user.username || result.user.email || "User"
        }!`,
      });
      reset();
      navigate("/");
    } else {
      toast.error("Login Failed", {
        description: result.error || "Invalid credentials or server error.",
      });
      console.log("LoginForm: Login failed.", result.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card
        className="
          w-full max-w-md p-6 md:p-8 space-y-6 rounded-xl shadow-2xl relative z-10
          bg-card/70 border border-border/50
          backdrop-blur-md transition-colors duration-500
        "
      >
        <CardHeader className="text-center p-0 pb-4">
          <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
            Welcome Back!
          </CardTitle>
          <CardDescription className="mt-2 text-sm text-muted-foreground">
            Sign in to continue your journey.
          </CardDescription>
        </CardHeader>

        {authError && !isLoading && (
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
            className="space-y-5"
            noValidate
          >
            <div>
              <Label htmlFor="email">Email Address / Username</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                disabled={isLoading}
                className={`mt-3 bg-input/80 text-foreground ${
                  errors.email
                    ? "border-destructive focus:ring-destructive"
                    : ""
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                {" "}
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  disabled={isLoading}
                  className={`mt-3 bg-input/80 text-foreground pr-10 ${
                    errors.password
                      ? "border-destructive focus:ring-destructive"
                      : ""
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
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

              {/* Error message container for password - Keep it consistent to prevent jumps */}
              <p
                className={`text-xs text-destructive min-h-[1.25rem] ${
                  errors.password ? "opacity-100" : "opacity-0"
                }`}
              >
                {errors.password?.message || "placeholder text for spacing"}
              </p>
            </div>

            <div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            Don't have an account?
            <Link
              to="/signup"
              className="font-medium text-primary hover:text-primary/80 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;
