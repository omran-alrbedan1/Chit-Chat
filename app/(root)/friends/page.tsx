"use client";
import ItemList from "@/components/ItemList/ItemList";
import React from "react";
import ConversationFallback from "../conversations/_components/ConversationFallback";
import AddFriendDialog from "./_components/AddFriendDialog";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LoaderIcon } from "lucide-react";
import Request from "./_components/Request";

const layout = () => {
  const requests = useQuery(api.requests.get);

  return (
    <>
      <ItemList title="Friends" action={<AddFriendDialog />}>
        {requests ? (
          requests.length > 0 ? (
            requests.map((request) => (
              <Request
                key={request.request._id}
                id={request.request._id}
                imageUrl={request.sender.imageUrl}
                name={request.sender.username}
                email={request.sender.email}
              />
            ))
          ) : (
            <p>no friend requests found</p>
          )
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <LoaderIcon className="animate-spin" />
          </div>
        )}
      </ItemList>
      <ConversationFallback />
    </>
  );
};

export default layout;
