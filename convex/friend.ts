import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getCurrentUser } from "@/hooks/getCurrentUser";

export const remove = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const { currentUser } = await getCurrentUser({ ctx });

    // get the conversation:
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      return new ConvexError("conversation not found");
    }

    // get members of the conversation :
    const memberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    if (!memberships || memberships.length !== 2) {
      throw new ConvexError("this conversation does not have any member");
    }

    // get the friendship :
    const friendship = await ctx.db
      .query("friends")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .unique();

    if (!friendship) {
      throw new ConvexError("friend could not be found");
    }

    // get all messages :
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    //[1]-delete the conversation from conversations table :
    await ctx.db.delete(args.conversationId);

    //[2]-delete the friendship from friendships table :
    await ctx.db.delete(friendship._id);

    //[3]-delete all memberships :
    await Promise.all(
      memberships.map(async (memberships) => {
        await ctx.db.delete(memberships._id);
      })
    );

    //[4]-delete all messages :
    await Promise.all(
      messages.map(async (message) => {
        await ctx.db.delete(message._id);
      })
    );

    
  },
});
