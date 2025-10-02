import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(3, "Username minimal harus 3 karakter."),
  email: z.string().email("Format email tidak valid."),
  roles: z.array(z.number()).min(1, "Pilih setidaknya satu peran."),
});

export type UserSchema = z.infer<typeof userSchema>;
