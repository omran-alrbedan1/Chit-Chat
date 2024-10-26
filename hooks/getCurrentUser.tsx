import { MutationCtx, QueryCtx } from "@/convex/_generated/server";
import { ConvexError } from "convex/values";

export const getUserByClerkId = async ({
  ctx,
  clerkId,
}: {
  ctx: QueryCtx | MutationCtx;
  clerkId: string;
}) => {
  return await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
    .unique();
};

export const getCurrentUser = async ({
  ctx,
}: {
  ctx: QueryCtx | MutationCtx;
}) => {
  //if unauthorized:
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("unauthorized");
  }
  
 // //see if the email you inputted in the app : 
  const currentUser = await getUserByClerkId({
    ctx,
    clerkId: identity.subject,
  });

  if (!currentUser) {
    throw new ConvexError("user not found");
  }

  return { identity, currentUser };
};
