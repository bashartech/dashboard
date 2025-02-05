import { z } from "zod";

export const signUpSchema = z
 .object({
    name:z.string({message: "Name is required"}),
    email: z.string({message: "Email is require"})
    .email("invalid email"),
    password: z.string({message: "Password is required"})
    .min(6, "Password must be at least 6")
    .max(20, "Password must be less than 20")
  
})
.strict()

