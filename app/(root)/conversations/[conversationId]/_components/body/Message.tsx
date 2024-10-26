import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

type MessageProps = {
  fromCurrentUser: boolean;
  senderImage: string;
  senderName: string;
  lastByUser: boolean;
  content: string[];
  seen?: React.ReactNode;
  type: string;
  createdAt: number;
};

const Message = ({
  fromCurrentUser,
  senderImage,
  senderName,
  lastByUser,
  content,
  seen,
  type,
  createdAt,
}: MessageProps) => {
  // Helper function to format the timestamp into "HH:mm"
  const formatTime = (timestamp: number) => format(timestamp, "HH:mm");

  return (
    <div
      className={cn("flex items-end", {
        "justify-end": fromCurrentUser,
      })}
    >
      <div
        className={cn("flex flex-col mx-2 w-full", {
          "order-1 items-end": fromCurrentUser,
          "order-2 items-start": !fromCurrentUser,
        })}
      >
        <div
          className={cn("px-4 py-2 rounded-lg max-w-[70%]", {
            "bg-primary text-primary-foreground": fromCurrentUser,
            "bg-secondary text-secondary-foreground dark:text-primary-foreground bg-gray-300":
              !fromCurrentUser,
            "rounded-br-none": fromCurrentUser && !lastByUser,
            "rounded-bl-none": !fromCurrentUser && !lastByUser,
          })}
        >
          <p className="break-words whitespace-pre-wrap break-all">{content}</p>
          <p
            className={cn("text-xs flex w-full mt-1", {
              "justify-end text-primary-foreground": fromCurrentUser,
              "justify-start text-secondary-foreground dark:text-primary-foreground bg-gray-300":
                !fromCurrentUser,
            })}
          >
            {formatTime(createdAt)}
          </p>
        </div>
        {seen}
      </div>
      <Avatar
        className={cn("relative h-8 w-8", {
          "order-2": fromCurrentUser,
          "order-1": !fromCurrentUser,
          invisible: lastByUser,
        })}
      >
        <AvatarImage src={senderImage} />
        <AvatarFallback>
          <User />
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Message;
