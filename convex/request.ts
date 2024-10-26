import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getCurrentUser } from "@/hooks/getCurrentUser";

// create new request: 
export const create = mutation({
  args: {
    email: v.string(),  
  },

  handler: async (ctx, args) => {
    const { email } = args;

    const{identity,currentUser}=await getCurrentUser({ctx})

    // if the email you write is your email: 
    if(email === identity.email){
        throw new ConvexError('you can send a request to yourself');
    }


    // get the receiver:
    const receiver = await ctx.db.query('users').withIndex('by_email',(q)=>q.eq('email',args.email)).unique();
    if(!receiver){
        throw new ConvexError('users could not be found')
    }

    //if the request is already sent if the (request's receiver = the receiver) and (request's sender = current user )

    const existingRequest = await ctx.db
      .query("requests")
      .withIndex('by_receiver_sender',q=>q.eq('receiver',receiver._id).eq('sender',currentUser._id))
      .unique();

    if (existingRequest) {
      throw new Error("Request already sent a request");
    }

    //  if the request it received: 
    const requestAlreadyReceiver=await ctx.db.query('requests').withIndex('by_receiver_sender',(q)=>q.eq('receiver',currentUser._id).eq('sender',receiver._id)).unique();

    if(requestAlreadyReceiver){
        throw new ConvexError('this user has already sent you a request,check your request list');
    }

    // check if there is a friendship : 
    const friends1=  await ctx.db
    .query('friends')
    .withIndex('by_user1',(q)=>q.eq('user1',currentUser._id))
    .collect();

    const friends2=  await ctx.db
    .query('friends')
    .withIndex('by_user2',(q)=>q.eq('user2',currentUser._id))
    .collect();

    if(friends1.some((friend)=>friend.user2===receiver._id)||friends2.some((friend)=>friend.user1===receiver._id)){
        throw new ConvexError('you are already friends with this user');
    }

    //  create the new request
    const request = await ctx.db.insert("requests", {
        receiver:receiver._id,
        sender:currentUser._id,
    });

    return request;
  }
});

// deny request: 
export const deny= mutation({
  args:{
    id:v.id('requests'),
  },
  handler:async (ctx,args)=>{

    //get the current user: 
    const {identity , currentUser}= await getCurrentUser({ctx});
    
    // get the request: 
    const request = await ctx.db.get(args.id);
       if(!request || request.receiver !==currentUser._id){
        throw new ConvexError('there was an error denying this  request')
       }
       await ctx.db.delete(request._id);
  }
})

// accept request: 
export const accept = mutation({
  args:{
    id:v.id('requests')
  },
  handler:async (ctx,args)=>{
    const{identity,currentUser}= await getCurrentUser({ctx});

    // get the request from requests table : 
    const request = await ctx.db.get(args.id);

    if(!request || request.receiver !==currentUser._id){
      throw new ConvexError('there was an error accepting this request ')
    }

    // add new conversation to conversations table : 
    const conversationId = await ctx.db.insert('conversations',{
      isGroup:false,
    })

    // add new friends to friends table : 
    await ctx.db.insert('friends',{
      user1:currentUser._id,
      user2:request.sender,
      conversationId,
    })
    
    // add new table to conversationMembers table for the current user :
    await ctx.db.insert('conversationMembers',{
      memberId:currentUser._id,
      conversationId,
    }) 
    // add new table to conversationMembers table for the sender :
    await ctx.db.insert('conversationMembers',{
      memberId:request.sender,
      conversationId,
    }) 
    // delete the request from requests table : 
    await ctx.db.delete(request._id);
  }
})
