"use client";
import React from "react";
import { Card } from "../ui/card";
import { useConversation } from "@/hooks/useConversation";
import { cn } from "@/lib/utils";

type Props = React.PropsWithChildren<{
  title: string;
  action?: React.ReactNode;
}>;

const ItemList = ({ children, title, action: Action }: Props) => {
  const { isActive } = useConversation();

  return (
    <Card
      className={cn(
        "h-full lg:flex-none hidden   w-full lg:w-80 p-3 md:p-2 md:block",
        {
          block: !isActive,
          "lg:block": isActive,
        }
      )}
    >
      <div className="mb-8 flex items-center justify-between ">
        <h1 className="text-2xl font-semibold tracking-tight text-blue-500">
          {title}
        </h1>
        {Action ? Action : null}
      </div>
      <div className="h-full w-full flex flex-col items-center justify-start gap-2">
        {children}
      </div>
    </Card>
  );
};

export default ItemList;
