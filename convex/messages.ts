import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getCurrentUser } from "@/hooks/getCurrentUser";

export const get = query({
  args: {
    id: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const { currentUser } = await getCurrentUser({ ctx });

    // check if the user member of the conversation:
    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q.eq("memberId", currentUser._id).eq("conversationId", args.id)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("you are not member of this conversation");
    }

    // get all messages of this conversation:
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.id))
      .order("desc")
      .collect();

    // fetch the messages with the sender details :
    const messageWithUsers = Promise.all(messages.map( async message =>{
        const messageSender = await ctx.db.get(message.senderId)

        if(!messageSender){
            throw new ConvexError('could not found sender of message');
        }
        return {
            message,
            senderImage:messageSender.imageUrl,
            senderName:messageSender.username,
            isCurrentUser:messageSender._id==currentUser._id
            
        }
    }))

    
    return messageWithUsers
  },
});
