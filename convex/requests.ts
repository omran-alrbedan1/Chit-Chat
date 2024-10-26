import { getCurrentUser } from "@/hooks/getCurrentUser";
import { query } from "./_generated/server";
import { ConvexError } from "convex/values";

export const get = query({
    args:{},
    handler: async (ctx)=>{
        const{currentUser}=await getCurrentUser({ctx})

        // get all requests : 
        const requests = await ctx.db
        .query('requests')
        .withIndex('by_receiver',q=>q.eq('receiver',currentUser._id))
        .collect();

        // get the request with his sender : 
        const requestsWithSender = await Promise.all(
            requests.map(async(request)=>{
                const sender = await ctx.db.get(request.sender);

                if(!sender){
                    throw new ConvexError('request sender could not be found')
                }
                return{sender,request};
            })
        )
        return requestsWithSender;

    }
})

export const count = query({
    args:{},
    handler:async(ctx)=>{
        const{currentUser}= await getCurrentUser({ctx});
        
        const requests= await ctx.db
        .query('requests')
        .withIndex('by_receiver',q=>q.eq('receiver',currentUser._id))
        .collect();

        return requests.length;
    }
})
