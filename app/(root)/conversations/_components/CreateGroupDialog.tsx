"use client";

import React, { useMemo } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMutationState } from "@/hooks/useMutationState";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { CirclePlus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
type Props = {};

const CreateGroupDialog = () => {
  const friends = useQuery(api.friends.get);

  const { mutate: createGroup, pending } = useMutationState(
    api.conversation.createGroup
  );

  const createGroupFormSchema = z.object({
    name: z.string().min(1, { message: "this field can't be empty" }),

    members: z
      .string()
      .array()
      .min(1, { message: "you must select at least one item" }),
  });

  const form = useForm<z.infer<typeof createGroupFormSchema>>({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const members = form.watch("members", []);

  console.log(friends);

  const unselectedFriends = useMemo(() => {
    return friends
      ? friends.filter((friend) => !members.includes(friend._id))
      : [];
  }, [friends?.length, members.length]);

  const handleSubmit = async (
    values: z.infer<typeof createGroupFormSchema>
  ) => {
    await createGroup({ name: values.name, members: values.members })
      .then(() => {
        form.reset();
        toast.success("group created");
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError
            ? error.data
            : "unexpected error occurred"
        );
      });
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger>
          <Button size={"icon"} variant={"outline"}>
            <DialogTrigger asChild>
              <CirclePlus />
            </DialogTrigger>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>create group</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="w-[80%] md:w-[100%]">
        <DialogHeader>
          <DialogTitle>create group</DialogTitle>
          <DialogDescription>Add your friend to get started</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="group name..." {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="members"
              render={() => (
                <FormItem>
                  <FormLabel>Friends</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        disabled={unselectedFriends.length === 0}
                      >
                        <Button className="w-full" variant={"outline"}>
                          Select
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {unselectedFriends.map((friend) => {
                          return (
                            <DropdownMenuCheckboxItem
                              key={friend._id}
                              className="flex items-center gap-2 w-full p-2"
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  form.setValue("members", [
                                    ...members,
                                    friend._id,
                                  ]);
                                }
                              }}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={friend.imageUrl} />
                                <AvatarFallback>
                                  {friend.username.substring(0, 1)}
                                </AvatarFallback>
                              </Avatar>
                              <h4 className="truncate">{friend.username}</h4>
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {members && members.length ? (
              <Card className="flex items-center gap-3 overflow-x-auto w-full h-24 p-2 no-scrollbar">
                {friends
                  ?.filter((friend) => members.includes(friend._id))
                  .map((friend) => {
                    return (
                      <div
                        key={friend._id}
                        className="flex flex-col items-center gap-1"
                      >
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={friend.imageUrl} />
                            <AvatarFallback>
                              {friend.username.substring(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <X
                            className="text-muted-foreground w-4 h-4 absolute bottom-8 left-7 bg-muted rounded-full cursor-pointer"
                            onClick={() => {
                              form.setValue(
                                "members",
                                members.filter((id) => id !== friend._id)
                              );
                            }}
                          />
                        </div>
                        <p className="text-sm truncate">
                          {friend.username.split(" ")[0]}
                        </p>
                      </div>
                    );
                  })}
              </Card>
            ) : null}
            <DialogFooter>
              <Button disabled={pending} type="submit">
                create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
