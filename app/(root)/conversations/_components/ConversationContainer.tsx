"use client";
import { Card } from "@/components/ui/card";
import { useConversation } from "@/hooks/useConversation";
import { cn } from "@/lib/utils";
import React from "react";

type Props = React.PropsWithChildren<{}>;

const ConversationContainer = ({ children }: Props) => {
  const isActive = useConversation();
  return (
    <Card
      className={cn(
        "p-2 h-full w-full flex gap-2  flex-col  justify-center text-secondary-foreground bg-secondary"
      )}
    >
      {children}
    </Card>
  );
};

export default ConversationContainer;
