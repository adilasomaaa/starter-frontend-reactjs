import { z } from "zod";

export const permissionsSchema = z.object({
  name: z.string(),
});

export type PermissionsSchema = z.infer<typeof permissionsSchema>;
