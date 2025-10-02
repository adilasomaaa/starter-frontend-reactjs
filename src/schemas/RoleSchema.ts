import { z } from "zod";

export const roleSchema = z.object({
  name: z.string(),
  permissions: z
    .array(z.number().min(1, "Minimal 1"))
    .min(1, "Permissions harus minimal 1"),
});

export type RoleSchema = z.infer<typeof roleSchema>;
