import { z } from "zod";

export const ZodUser = z.object({
  username: z.string(),
  password: z
    .string({ required_error: "password is Required" })
    .nonempty("password is empty"),
  email: z.string().email().nullish(),
});

export const UpdateZodUser = ZodUser.extend({
  id: z.string().uuid(),
});

export type AddZodUser = z.infer<typeof ZodUser>;
