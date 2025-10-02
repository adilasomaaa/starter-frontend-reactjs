import { z } from "zod";
export const clientSchema = z.object({
  status: z.string().min(1, "Status minimal 1"),
});
export type ClientSchema = z.infer<typeof clientSchema>;
