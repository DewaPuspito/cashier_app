import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  role: z.enum(["ADMIN", "CASHIER"], { 
    required_error: "Role is required",
    invalid_type_error: "Role must be either 'ADMIN' or 'CASHIER'"
  })
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(1, { message: "Password is required" }),
});
