import { z } from "zod";
export const authUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().url().nullable().optional(),
});
export type AuthUser = z.infer<typeof authUserSchema>;