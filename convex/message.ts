import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getCurrentUser } from "@/hooks/getCurrentUser";

export const create = mutation({
  args: {
    conversationId: v.id("conversations"),
    type: v.string(),
    content: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { currentUser } = await getCurrentUser({ ctx });

    // check if the current user is member of the conversation:
    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q
          .eq("memberId", currentUser._id)
          .eq("conversationId", args.conversationId)
      )
      .unique();

    if (!membership) {
      return new ConvexError("you are not member of this conversation");
    }

    // add the message to messages table :
    const message = await ctx.db.insert("messages", {
      senderId: currentUser._id,
      ...args,
    });

    // update the lastMessage of the of this conversation:
    await ctx.db.patch(args.conversationId, {
      lastMessageId: message,
    });
    return message;
  },
});
