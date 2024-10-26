import { Card } from "@/components/ui/card";
import React from "react";

const ConversationFallback = () => {
  return (
    <Card className="hidden p-2 h-full w-full lg:flex items-center justify-center text-secondary-foreground bg-secondary">
      Select / Start conversation to get started
    </Card>
  );
};

export default ConversationFallback;
