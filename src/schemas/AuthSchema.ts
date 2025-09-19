// src/schemas/auth.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Minimal 6 karakter"),
  remember: z.boolean().optional(),
});
export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email("Email tidak valid"),
  name: z.string().min(3, "Minimal 3 karakter"),
  username: z.string().min(3, "Minimal 3 karakter"),
  password: z.string().min(6, "Minimal 6 karakter"),
});
export type RegisterSchema = z.infer<typeof registerSchema>;


export const verifySchema = z.object({
  code: z.string().min(6, "Minimal 6 karakter"),
  email: z.string().email("Email tidak valid"),
});

export type VerifySchema = z.infer<typeof verifySchema>;

