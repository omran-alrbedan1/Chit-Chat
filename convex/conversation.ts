import { getCurrentUser } from "@/hooks/getCurrentUser";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
export const get = query({
  args: {
    id: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const { currentUser } = await getCurrentUser({ ctx });

    // get the conversations:
    const conversation = await ctx.db.get(args.id);
    if (!conversation) {
      throw new ConvexError("conversation not found");
    }

    // get the membership of the conversation to see if you are member of this conversation:
    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q.eq("memberId", currentUser._id).eq("conversationId", conversation._id)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("you are not member of this conversation");
    }

    // get all members:
    const allConversationMemberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.id))
      .collect();

    if (!conversation.isGroup) {
      const otherMembership = allConversationMemberships.filter(
        (membership) => membership.memberId !== currentUser._id
      )[0];
      const otherMemberDetails = await ctx.db.get(otherMembership.memberId);

      return {
        ...conversation,
        otherMember: {
          ...otherMemberDetails,
          lastSeenMessageId: otherMembership.lastSeenMessage,
        },
        otherMembers: null,
      };
    } else {
      // get other members for the group:
      const otherMembers = await Promise.all(
        allConversationMemberships
          .filter((membership) => membership.memberId !== currentUser._id)
          .map(async (membership) => {
            const member = await ctx.db.get(membership.memberId);
            if (!member) {
              throw new ConvexError("member could not be found");
            }
            return {
              _id: member._id,
              username: member.username,
            };
          })
      );

      return { ...conversation, otherMember: null, otherMembers };
    }
  },
});

export const createGroup = mutation({
  args: {
    name: v.string(),
    members: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { currentUser } = await getCurrentUser({ ctx });

    // add group :
    const conversationId = await ctx.db.insert("conversations", {
      isGroup: true,
      name: args.name,
    });

    // add members to conversationMembers table :
    await Promise.all(
      [...args.members, currentUser._id].map(async (memberId) => {
        await ctx.db.insert("conversationMembers", {
          memberId,
          conversationId,
        });
      })
    );
  },
});

export const deleteGroup = mutation({
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

    if (!memberships || memberships.length <= 1) {
      throw new ConvexError("this conversation does not have any member");
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

    //[2]-delete all memberships :
    await Promise.all(
      memberships.map(async (memberships) => {
        await ctx.db.delete(memberships._id);
      })
    );

    //[3]-delete all messages :
    await Promise.all(
      messages.map(async (message) => {
        await ctx.db.delete(message._id);
      })
    );
  },
});
export const leaveGroup = mutation({
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

    // get membership:
    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q
          .eq("memberId", currentUser._id)
          .eq("conversationId", args.conversationId)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("you are not member of this conversation");
    }

    await ctx.db.delete(membership._id);
  },
});

export const markRead = mutation({
  args: {
    conversationId: v.id("conversations"),
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const { currentUser } = await getCurrentUser({ ctx });

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q
          .eq("memberId", currentUser._id)
          .eq("conversationId", args.conversationId)
      )
      .unique();
    if (!membership) {
      throw new ConvexError("you are not member of this conversation");
    }

    const lastMessage = await ctx.db.get(args.messageId);
    await ctx.db.patch(membership._id, {
      lastSeenMessage: lastMessage ? lastMessage._id : undefined,
    });
  },
});
