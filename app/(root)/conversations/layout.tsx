"use client";
import ItemList from "@/components/ItemList/ItemList";
import React from "react";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {

 
  LoaderIcon,
} from "lucide-react";
import DMConversation from "./_components/DMConversation";
import CreateGroupDialog from "./_components/CreateGroupDialog";
import ConversationGroupItem from "./_components/ConversationGroupItem";

type Props = React.PropsWithChildren<{}>;

const layout = ({ children }: Props) => {
  const conversations = useQuery(api.conversations.get);
  console.log(conversations);
  return (
    <>
      <ItemList title="conversations" action={<CreateGroupDialog />}>
        {conversations ? (
          conversations.length == 0 ? (
            <p>no conversations</p>
          ) : (
            conversations.map((conversation) => {
              return conversation.conversation.isGroup ? (
                <ConversationGroupItem
                  key={conversation.conversation._id}
                  id={conversation.conversation._id}
                  name={conversation.conversation.name || ""}
                  lastMessageContent={conversation.lastMessage?.content || ""}
                  lastMessageSender={conversation.lastMessage?.sender || ""}
                  unSeenMessageCount={conversation.unseenCount}
                />
              ) : (
                <DMConversation
                  key={conversation.conversation._id}
                  id={conversation.conversation._id}
                  name={conversation.otherMember?.username || ""}
                  imageUrl={conversation.otherMember?.imageUrl || ""}
                  lastMessageContent={conversation.lastMessage?.content || ""}
                  lastMessageSender={conversation.lastMessage?.sender || ""}
                  unSeenMessageCount={conversation.unseenCount}
                />
              );
            })
          )
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <LoaderIcon className="animate-spin" />
          </div>
        )}
      </ItemList>
      {children}
    </>
  );
};

export default layout;
