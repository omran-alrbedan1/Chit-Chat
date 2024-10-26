import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Settings, Trash, User } from "lucide-react";
import Link from "next/link";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ExitIcon } from "@radix-ui/react-icons";

type Props = {
  imageUrl?: string;
  name: string;
  options?: {
    label: string;
    destructive: boolean;
    onClick: () => void;
  }[];
};

const Header = ({ imageUrl, name, options }: Props) => {
  return (
    <Card className="w-full p-2 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link href={"/conversations"} className="lg:hidden">
          <ArrowLeft />
        </Link>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={imageUrl} />
            <AvatarFallback>{name.substring(0, 1)}</AvatarFallback>
          </Avatar>
          <p className=" font-semibold">{name}</p>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Settings />
        </DropdownMenuTrigger>
        {options ? (
          <DropdownMenuContent>
            {options.map((option) => (
              <DropdownMenuLabel
                className={cn("flex items-center gap-1", {
                  "text-red-400": option.destructive,
                })}
                onClick={option.onClick}
              >
                {option.label.startsWith("Delete") ? (
                  <Trash className="size-4" />
                ) : (
                  <ExitIcon className="size-4" />
                )}
                {option.label}
              </DropdownMenuLabel>
            ))}
          </DropdownMenuContent>
        ) : null}
      </DropdownMenu>
    </Card>
  );
};

export default Header;
