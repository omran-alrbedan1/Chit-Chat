import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConversation } from "@/hooks/useConversation";
import { useQuery } from "convex/react";
import React, { useEffect } from "react";
import Message from "./Message";
import { useMutationState } from "@/hooks/useMutationState";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  members: {
    lastSeenMessageId?: Id<"messages">;
    username?: string;
    [key: string]: any;
  }[];
};

const Body = ({ members }: Props) => {
  const { conversationId } = useConversation();
  const { mutate: markRead, pending } = useMutationState(
    api.conversation.markRead
  );

  const messages = useQuery(api.messages.get, {
    id: conversationId as Id<"conversations">,
  });

  useEffect(() => {
    if (messages && messages.length > 0) {
      markRead({ conversationId, messageId: messages[0]?.message._id });
    }
  }, [messages?.length, markRead, conversationId]);

  const formatSeenBy = (names: string[]) => {
    switch (names.length) {
      case 1:
        return (
          <p className="text-muted-foreground text-sm text-right">{`seen by ${names[0]}`}</p>
        );
      case 2:
        return (
          <p className="text-muted-foreground text-sm text-right">{`seen by ${names[0]} and ${names[1]}`}</p>
        );

      default:
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <p>{`seen by ${names[0]} and ${names[1]} and ${names.length - 2} more`}</p>
              </TooltipTrigger>
              <TooltipContent>
                <ul>
                  {names.map((name, index) => {
                    return <li key={index}>{name}</li>;
                  })}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
    }
  };

  const getSeenMessage = (messageId: Id<"messages">) => {
    const seenUsers = members
      .filter((member) => member.lastSeenMessageId === messageId)
      .map((user) => user.username!.split(" ")[0]);

    if (seenUsers.length === 0) {
      return undefined;
    }

    return formatSeenBy(seenUsers);
  };

  return (
    <div
      className="
      w-full flex flex-1 gap-1 flex-col-reverse overflow-y-scroll no-scrollbar"
    >
      {messages?.map(
        ({ message, senderImage, senderName, isCurrentUser }, index) => {
          // get the lastMessage from each user:
          const lastByUser =
            index > 0 &&
            messages[index - 1].message.senderId === message.senderId;

          const seenMessage = isCurrentUser
            ? getSeenMessage(message._id)
            : undefined;
          return (
            <Message
              key={message._id}
              fromCurrentUser={isCurrentUser}
              senderImage={senderImage}
              senderName={senderName}
              lastByUser={lastByUser}
              content={message.content}
              createdAt={message._creationTime}
              type={message.type}
              seen={seenMessage}
            />
          );
        }
      )}
    </div>
  );
};

export default Body;
