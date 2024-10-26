import { z } from "zod";

export const addFriendFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field can't be empty" })
    .email("Please enter a valid email"),
});

export const chatMessageSchema = z.object({
  content: z.string().min(1, { message: "write a message" }),
});
