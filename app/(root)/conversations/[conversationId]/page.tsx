"use client";
import React, { useState } from "react";
import ConversationContainer from "../_components/ConversationContainer";
import Header from "./_components/Header";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ChatInput from "./_components/ChatInput";
import Body from "./_components/body/Body";
import DeleteFriendDialog from "./_components/Dialog/DeleteFriendDialog";
import DeleteGroupDialog from "./_components/Dialog/DeleteGroupDialog";
import LeaveGroupDialog from "./_components/Dialog/LeaveGroupDialog";
import { LoaderIcon } from "lucide-react";

type Props = {
  params: {
    conversationId: Id<"conversations">;
  };
};

const page = ({ params: { conversationId } }: Props) => {
  const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [deleteFriendDialogOpen, setDeleteFriendDialogOpen] = useState(false);

  const conversation = useQuery(api.conversation.get, {
    id: conversationId,
  });
  return (
    <>
      {conversation ? (
        conversation === null ? (
          <div className="h-full w-full flex items-center justify-center">
            conversation not found
          </div>
        ) : (
          <ConversationContainer>
            <DeleteFriendDialog
              open={deleteFriendDialogOpen}
              setOpen={setDeleteFriendDialogOpen}
              conversationId={conversationId}
            />
            <DeleteGroupDialog
              open={deleteGroupDialogOpen}
              setOpen={setDeleteGroupDialogOpen}
              conversationId={conversationId}
            />
            <LeaveGroupDialog
              open={leaveGroupDialogOpen}
              setOpen={setLeaveGroupDialogOpen}
              conversationId={conversationId}
            />
            <Header
              imageUrl={
                conversation.isGroup
                  ? undefined
                  : conversation.otherMember?.imageUrl
              }
              name={
                (conversation.isGroup
                  ? conversation.name
                  : conversation.otherMember?.username) || ""
              }
              options={
                conversation.isGroup
                  ? [
                      {
                        label: "Leave group",
                        destructive: false,
                        onClick: () => setLeaveGroupDialogOpen(true),
                      },
                      {
                        label: "Delete group",
                        destructive: true,
                        onClick: () => setDeleteGroupDialogOpen(true),
                      },
                    ]
                  : [
                      {
                        label: "Delete friend",
                        destructive: true,
                        onClick: () => setDeleteFriendDialogOpen(true),
                      },
                    ]
              }
            />
            <Body
              members={
                conversation.isGroup
                  ? conversation.otherMembers
                    ? conversation.otherMembers
                    : []
                  : conversation.otherMember
                    ? [conversation.otherMember]
                    : []
              }
            />
            <ChatInput />
          </ConversationContainer>
        )
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <LoaderIcon className="animate-spin" />
        </div>
      )}
    </>
  );
};

export default page;
