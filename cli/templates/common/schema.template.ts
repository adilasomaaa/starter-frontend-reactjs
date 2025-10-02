import { z } from "zod";

export const __name__Schema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  // Disesuaikan sesuai kebutuhan
});

export type __Name__Schema = z.infer<typeof __name__Schema>;
