import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"), // Email validation
  password: z.string().min(1, "Password is required"), // Password validation (min 1 char)
});
