import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import { User } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  id: Id<"conversations">;
  name: string;
  lastMessageSender?: string;
  lastMessageContent?: string;
  unSeenMessageCount: number;
};

const ConversationGroupItem = ({
  id,
  name,
  lastMessageSender,
  lastMessageContent,
  unSeenMessageCount,
}: Props) => {
  return (
    <Link className="w-full" href={`/conversations/${id}`}>
      <Card className="w-full flex flex-row justify-between p-1 items-center">
        <Avatar>
          <AvatarFallback>{name.charAt(0).toLocaleLowerCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col  justify-start truncate">
          <h4 className=" font-semibold truncate">
            {name.replace("null", "")}
          </h4>
          {lastMessageContent && lastMessageSender ? (
            <p className="flex text-sm truncate text-gray-600 ">
              <span className="font-semibold">
                {lastMessageSender.replace("null", "")} :&nbsp;{" "}
              </span>
              <span className="overflow-ellipsis text-gray-500">
                {lastMessageContent}
              </span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground truncate">
              start the conversations
            </p>
          )}
        </div>
        {unSeenMessageCount ? <Badge>{unSeenMessageCount}</Badge> : null}
      </Card>
    </Link>
  );
};

export default ConversationGroupItem;
