import { getCurrentUser } from "@/hooks/getCurrentUser";
import { query } from "./_generated/server";
import { ConvexError } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const { currentUser } = await getCurrentUser({ ctx });

    // friendships = [friendships where the current uer is the first user] +[friendships where the current uer is the second user]
    //[1]-
    const friendships1 = await ctx.db
      .query("friends")
      .withIndex("by_user1", (q) => q.eq("user1", currentUser._id))
      .collect();

    //[2]-
    const friendships2 = await ctx.db
      .query("friends")
      .withIndex("by_user2", (q) => q.eq("user2", currentUser._id))
      .collect();

    //[3]-
    const friendships = [...friendships1, ...friendships2];
    console.log(friendships);
    // return friends = all the members of the friendships except the current user:
    const friends = await Promise.all(
      friendships.map(async (friendship) => {
        const friend = await ctx.db.get(
          friendship.user1 === currentUser._id
            ? friendship.user2
            : friendship.user1
        );

        if (!friend) {
          throw new ConvexError("friend could not be found");
        }
        return friend;
      })
    );
    console.log("friends", friends);
    return friends;
  },
});
