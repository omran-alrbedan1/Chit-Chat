import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

// Mutation to create or update a user in the Convex database
export const create = internalMutation({
  args: {
    username: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Check if user already exists by Clerk ID
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
        .unique();

      if (existingUser) {
        // If user exists, update their information
        await ctx.db.patch(existingUser._id, {
          username: args.username,
          imageUrl: args.imageUrl,
          email: args.email,
        });
        console.log(`User with Clerk ID ${args.clerkId} updated successfully`);
      } else {
        // If user does not exist, insert a new user
        await ctx.db.insert("users", {
          clerkId: args.clerkId,
          username: args.username,
          imageUrl: args.imageUrl,
          email: args.email,
        });
        console.log(`User with Clerk ID ${args.clerkId} created successfully`);
      }
    } catch (error) {
      console.error(`Error creating/updating user with Clerk ID ${args.clerkId}:`, error);
      throw new Error("Failed to create or update the user.");
    }
  },
});

// Query to get a user by their Clerk ID
export const get = internalQuery({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
        .unique();

      if (!user) {
        console.log(`No user found with Clerk ID ${args.clerkId}`);
        return null;
      }
      
      return user;
    } catch (error) {
      console.error(`Error fetching user with Clerk ID ${args.clerkId}:`, error);
      throw new Error("Failed to fetch the user.");
    }
  },
});
